// Library Imports
import * as React from "react";
import { Grid, Link } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AddIcon from "@mui/icons-material/Add";
import NotesTemplateSelect from "./NotesTemplateSelect";

// header import
import { getHeaders } from "../utils/HeaderHelper";

// app setting imports
import { AuthenticationContext } from "../Context";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Props {
  blocks: Array<any>;
  setBlocks: any;
  encounterStatus: string;
  encounterBillingId: string;
  setReloadLogger: any;
  readOnly: boolean;
}

const PatientInstructionsPanel: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // For field states
  const [panelExpanded, setPanelExpanded] = React.useState<boolean>(false);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [templateModalOpen, setTemplateModalOpen] =
    React.useState<boolean>(false);
  const [template, setTemplate] = React.useState<any>();

  React.useEffect(() => {
    getNotes();
  }, []);

  const getEncounterId = () => {
    const url_string = window.location.href;
    const url = new URL(url_string);
    return url.searchParams.get("encounter_id");
  };

  const getNotes = () => {
    const encounterId = getEncounterId();
    if (encounterId) {
      fetch(`/encounters/patient_instructions_panel_data/${encounterId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            console.log(result);
            console.log(result?.resource?.notes?.[0]?.blocks);
            props.setBlocks(
              result?.resource?.instructions?.blocks || [{ note: "", order: 1 }]
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  React.useEffect(() => {
    setDisabled(false);
  }, [props.encounterStatus]);

  const updateBlock = (order, newValue) => {
    let newBlocks = props.blocks;
    newBlocks[order - 1].note = newValue;
    props.setBlocks([...newBlocks]);
  };

  React.useEffect(() => {
    template && props.setBlocks(template.blocks);
  }, [template]);

  const generatePDF = () => {
    const encounterId = getEncounterId();
    if (encounterId) {
      fetch(`/encounters/instructions_pdf?encounter_id=${encounterId}`, {
        method: "Post",
        headers: {
          "content-type": "application/pdf",
          accept: "application/pdf",
          "X-CSRF-Token": authenticationSetting.csrfToken,
          "X-Frame-Options": "sameorigin",
          "X-XSS-Protection": "1; mode=block",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Content-Security-Policy": "default-src 'self'",
        },
      })
        .then((result) => {
          // Check if the response is a valid PDF file
          const contentType = result.headers.get("content-type");
          if (contentType && contentType.indexOf("application/pdf") !== -1) {
            return result.blob();
          } else {
            throw new Error("The response is not a valid PDF file");
          }
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          const date = new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          });
          a.download = `patient_visit_summary_${date}.pdf`;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // Clean up the URL object
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.log(error);
          alert("Error occurred with pdf download.");
        });
    }
  };

  return (
    <Grid container item xs={12} className="single-panel">
      <NotesTemplateSelect
        templateModalOpen={templateModalOpen}
        setTemplateModalOpen={setTemplateModalOpen}
        setTemplate={setTemplate}
      />
      <Grid item xs={12}>
        <Grid container direction="row" className="admin-header">
          <Grid item xs={11} justifyContent="space-between">
            <h3 style={{ display: "inline-block" }}>Patient Instructions</h3>
            {props.encounterStatus != "signed" && (
              <div
                className="action-container"
                style={{ display: "inline-block" }}
              >
                <Link
                  className="action-link"
                  onClick={() => setTemplateModalOpen(true)}
                >
                  <AddIcon className="plus-icon" />{" "}
                  <span className="">Add Template</span>
                </Link>
              </div>
            )}
          </Grid>
          <Grid
            container
            item
            xs={1}
            direction="row"
            justifyContent="flex-end"
            style={{ flexWrap: "nowrap" }}
          >
            {panelExpanded ? (
              <>
                <span>
                  <Link className="action-icon">
                    <ArrowDropUpIcon className="expand-icon" />
                  </Link>
                </span>
              </>
            ) : (
              <>
                <span>
                  <Link className="action-icon ">
                    <ArrowDropDownIcon className="expand-icon" />
                  </Link>
                </span>
              </>
            )}
          </Grid>
        </Grid>

        {props.blocks.map((block, index) => (
          <Grid key={index} container className="form-body notes-container">
            <ReactQuill
              theme="snow"
              value={block.note}
              onChange={(value) => updateBlock(block.order, value)}
              className="field field-2 note-field"
              readOnly={disabled || props.readOnly}
              modules={{
                clipboard: {
                  matchVisual: false,
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Link
        onClick={generatePDF}
        className={
          getEncounterId()
            ? "basic-button generate-pdf orange-btn"
            : "basic-button generate-pdf orange-btn disabled"
        }
      >
        {" "}
        Generate PDF Version{" "}
      </Link>
    </Grid>
  );
};

export default PatientInstructionsPanel;

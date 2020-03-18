// Library Imports
import * as React from "react";
import { Grid, Link, TextField } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AddIcon from "@mui/icons-material/Add";
// import { TextareaAutosize } from "@mui/material";
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

const EncounterNotesPanel: React.FC<Props> = (props: any) => {
  // authentication context
  const authenticationSetting = React.useContext(AuthenticationContext);

  // For field states
  const [panelExpanded, setPanelExpanded] = React.useState<boolean>(false);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [addendumForm, setAddendumForm] = React.useState<boolean>(false);
  const [addendumNotes, setAddendumNotes] = React.useState<string>("");
  const [templateModalOpen, setTemplateModalOpen] =
    React.useState<boolean>(false);
  const [template, setTemplate] = React.useState<any>();
  const [allAddendumNotes, setAllAddendumNotes] = React.useState<string>("");

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
      fetch(`/encounters/encounter_notes_panel_data/${encounterId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            console.log(result);
            props.setBlocks(result?.resource?.notes?.[0]?.blocks || []);
            setAllAddendumNotes(result?.resource?.addendums?.join(" || "));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  React.useEffect(() => {
    if (props.encounterStatus == "pended") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [props.encounterStatus]);

  const handleCancel = () => {
    setAddendumForm(false);
  };
  const handleSave = () => {
    fetch(`/encounters/add_billing_addendum/${props.encounterBillingId}`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        encounter_notes: {
          notes: addendumNotes,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setAllAddendumNotes(result.resource.addendums?.join(""));
          setAddendumForm(false);
          setAddendumNotes("");
          props.setReloadLogger(Date.now().toString()); //Trigerring the logger reload
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateBlock = (order, newValue) => {
    let newBlocks = props.blocks;
    newBlocks[order - 1].note = newValue;
    props.setBlocks([...newBlocks]);
  };

  React.useEffect(() => {
    template && props.setBlocks(template.blocks);
  }, [template]);

  return (
    <Grid container item xs={12} className="single-panel">
      <NotesTemplateSelect
        templateModalOpen={templateModalOpen}
        setTemplateModalOpen={setTemplateModalOpen}
        setTemplate={setTemplate}
      />
      <Grid item xs={12}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          className="admin-header"
        >
          <Grid item xs={11} lg={6}>
            <h3 style={{ display: "inline-block" }}>Encounter Notes</h3>
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
              readOnly={disabled}
              modules={{
                clipboard: {
                  matchVisual: false,
                },
              }}
            />
          </Grid>
        ))}

        {allAddendumNotes && (
          <Grid item xs={12} className="field-container form-body">
            <h5
              style={{ marginTop: "0px", marginBottom: "0px", color: "grey" }}
            >
              {" "}
              Addendum{" "}
            </h5>
            <TextField
              id="addendum-input"
              value={allAddendumNotes}
              className="field field-2"
              required
              minRows={5}
              onChange={(event) => {
                props.setAllAddendumNotes(event.target.value);
              }}
              disabled={disabled || props.readOnly}
              fullWidth
            />
          </Grid>
        )}

        <Grid container>
          {disabled && (
            <>
              {addendumForm ? (
                <Grid container className="form-body">
                  <Grid item xs={12} className="field-container">
                    <h5
                      style={{
                        marginTop: "0px",
                        marginBottom: "0px",
                        color: "grey",
                      }}
                    >
                      {" "}
                      Add Addendum{" "}
                    </h5>
                    <TextField
                      id="plan_name"
                      value={addendumNotes}
                      className="field field-2"
                      required
                      multiline
                      minRows={5}
                      onChange={(event) => {
                        setAddendumNotes(event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      className="button-container"
                      justifyContent="center"
                      spacing={1}
                    >
                      <Grid item xs={2}>
                        <div className="cancel-link-container">
                          <Link className="cancel-link" onClick={handleCancel}>
                            Cancel
                          </Link>
                        </div>
                      </Grid>
                      <Grid item className="save-btn-container" xs={2}>
                        <Link className="save-btn" onClick={handleSave}>
                          Save
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid container>
                  <Grid item xs={12}>
                    <div className="action-container">
                      <Link
                        className="action-link"
                        onClick={() => setAddendumForm(true)}
                      >
                        <AddIcon className="plus-icon" />
                        <span>Add Addendum</span>
                      </Link>
                    </div>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EncounterNotesPanel;

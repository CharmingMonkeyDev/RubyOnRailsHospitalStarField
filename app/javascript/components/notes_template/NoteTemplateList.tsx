/* eslint-disable prettier/prettier */
// library imports
import * as React from "react";
import { Grid, Link, Modal } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

// component import
import FlashMessage from "../shared/FlashMessage";

interface Props {}

const NoteTemplateList: React.FC<Props> = (props: any) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  const [templates, setTemplates] = React.useState<any>([]);
  const [deleteTemplate, setDeleteTemplate] = React.useState<any>(null);

  React.useEffect(() => {
    getNotesTemplates();
  }, []);

  const getNotesTemplates = () => {
    fetch(`/notes_templates`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          setTemplates(result?.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showDeleteDialog = () => {
    if (deleteTemplate) {
      return true;
    } else {
      return false;
    }
  };

  const handleTemplateDelete = () => {
    if (deleteTemplate) {
      fetch(`/notes_templates/${deleteTemplate.id}`, {
        method: "DELETE",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            setDeleteTemplate(null);
            getNotesTemplates();
            setFlashMessage({ message: "Template archived", type: "success" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="template-list-container">
      <FlashMessage flashMessage={flashMessage} />
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          {templates.map((template) => {
            return (
              <Grid
                container
                justifyContent="space-between"
                key={template.id}
                className="template-card"
              >
                <Grid item xs={6}>
                  {template.name}
                </Grid>
                <Grid item xs={3} style={{ textAlign: "right" }}>
                  <Link href={`/edit-note-template/${template.id}`}>
                    <CreateIcon
                      style={{
                        fontSize: 20,
                        color: "#c1b7b3",
                        display: "inline-block",
                        cursor: "pointer",
                      }}
                    />
                  </Link>

                  <Link onClick={() => setDeleteTemplate(template)}>
                    <DeleteIcon
                      style={{
                        fontSize: 20,
                        color: "#c1b7b3",
                        display: "inline-block",
                        cursor: "pointer",
                        marginLeft: 5,
                      }}
                    />
                  </Link>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>

      <Modal
        open={showDeleteDialog()}
        className="unsaved-changes-modal-container"
      >
        <div className="paper" style={{ marginTop: "10%" }}>
          <div className="paperInner">
            <Grid container>
              <Grid item xs={12}>
                <p className="main-header">Delete Template? </p>
              </Grid>
              <Grid item xs={12}>
                <p>
                  You are attempting to delete <b> {deleteTemplate?.name} </b>{" "}
                  template. This action cannot be undone. Would you like to
                  continue?
                </p>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={6} className="cancel-link-container">
                <Link
                  className="cancel-link"
                  onClick={() => setDeleteTemplate(null)}
                >
                  Cancel
                </Link>
              </Grid>
              <Grid item xs={6} className="confirm-btn-container">
                <Link onClick={handleTemplateDelete} className="confirm-btn">
                  Continue
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NoteTemplateList;

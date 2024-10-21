/* eslint-disable prettier/prettier */
import * as React from "react";
import { Modal, Grid, TextField, Link, Snackbar } from "@mui/material";
import { Alert } from '@mui/material';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

// helper
import { getHeaders } from "../utils/HeaderHelper";
import GeneralModal from "../modals/GeneralModal";

interface Props {
  csrfToken: string;
  editResource: any;
  setEditResource: any;
  redirect: boolean;
}

const AddResource: React.FC<Props> = (props: any) => {
  const [name, setName] = React.useState<string>(
    props.editResource ? props.editResource.name : ""
  );
  const [type, setType] = React.useState<string>(
    props.editResource ? props.editResource.resource_type : "pdf"
  );
  const [linkUrl, setLinkUrl] = React.useState<string>(
    props.editResource ? props.editResource.link_url : ""
  );
  const [selectedFile, setSelectedFile] = React.useState<any>(null);

  const [open, setOpen] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [invalidFieldsArray, setInvalidFieldsArray] = React.useState<string[]>(
    []
  );
  const [disabledButton, setDisabledButton] = React.useState(false);

  const closeModal = () => {
    props.setEditResource(null);
    window.location.href = "/resource-catalog";
  };

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const unarchiveResource = (resource_item) => {
    if (confirm("Are you sure you want to unarchive the resource?")) {
      fetch(`/resource_items/${resource_item.id}`, {
        method: "PATCH",
        headers: getHeaders(props.csrfToken),
        body: JSON.stringify({
          is_deleted: false,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            window.location.href = `/resource-catalog`;
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const validForm = () => {
    let valid = false;

    let fields = [
      [name, "Name"],
      [type, "Type"],
    ];

    if (type == "pdf" && !props.editResource) {
      fields.push([selectedFile, "PDF"]);
    }

    if (type != "pdf") {
      fields.push([linkUrl, "Link Url"]);
    }

    const invalid = fields.filter((field) => !field[0] || field[0].length == 0);
    let invalidFieldArrayObject = invalid.map((field) => field[1]);

    if (invalidFieldArrayObject.length == 0) {
      valid = true;
    } else {
      setInvalidFieldsArray(invalidFieldArrayObject);
    }

    return valid;
  };

  React.useEffect(() => {
    if (invalidFieldsArray.length > 0) {
      setError(`Please fill out ${invalidFieldsArray.join(", ")}`);
    }
  }, [invalidFieldsArray]);

  const saveResource = () => {
    setError("");
    setDisabledButton(true);

    if (validForm()) {
      var formData = new FormData();
      formData.append("name", name);
      if (type == "pdf" && selectedFile) formData.append("pdf", selectedFile);
      formData.append("resource_type", type);
      formData.append("link_url", linkUrl);

      if (props.editResource) {
        updateResourceItem(formData);
      } else {
        createResourceItem(formData);
      }
    } else {
      setError("Invalid entries, please check your entries and try again.");
      setDisabledButton(false);
    }
  };

  const updateResourceItem = (formData) => {
    fetch(`/resource_items/${props.editResource.id}`, {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "X-CSRF-Token": props.csrfToken,
        "X-Frame-Options": "sameorigin",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Content-Security-Policy": "default-src 'self'",
      },
      body: formData,
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          setError(result.message);
          setDisabledButton(false);
        } else {
          if (!props.redirect) {
            setDisabledButton(false);
            props.setEditResource(result.resource)
          } else {
            window.location.href = `/resource-catalog`;
          }
        }
      })
      .catch((error) => {
        setError(error);
        setDisabledButton(false);
      });
  };

  const createResourceItem = (formData) => {
    fetch(`/resource_items`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "X-CSRF-Token": props.csrfToken,
        "X-Frame-Options": "sameorigin",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Content-Security-Policy": "default-src 'self'",
      },
      body: formData,
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          setError(result.message);
          setDisabledButton(false);
        } else {
          if (!props.redirect) {
            setDisabledButton(false);
            props.setEditResource(result.resource)
          } else {
            window.location.href = `/resource-catalog`;
          }
        }
      })
      .catch((error) => {
        setError(error);
        setDisabledButton(false);
      });
  };

  return (
    <>
      {error.length > 0 && (
        <Snackbar
          open={error.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            setError("");
          }}
        >
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        </Snackbar>
      )}

      <GeneralModal
        open={open}
        title={(props.editResource ? "Edit " : "Add ") + " Resource"}
        successCallback={saveResource}
        closeCallback={closeModal}
        containerClassName="add-patient-modal"
        confirmButtonText="Save"
        width="600px"
      >
        <Grid style={{ paddingTop: 25 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Type</FormLabel>
            <RadioGroup
              aria-label="type"
              name="type"
              value={type}
              onChange={(event) => {
                setType(event.target.value);
              }}
            >
              <FormControlLabel
                value="pdf"
                control={
                  <Radio />
                }
                label="PDF"
              />
              <FormControlLabel
                value="video"
                control={
                  <Radio />
                }
                label="Video"
              />
              <FormControlLabel
                value="link"
                control={
                  <Radio />
                }
                label="Link"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            id="name_of_action"
            label="Name of Resource*"
            value={name}
            className="textInput"
            required
            maxRows={20}
            variant="filled"
            onChange={(event) => {
              setName(event.target.value);
            }}
            InputLabelProps={{
              required: false,
            }}
          />

          {type == "pdf" && (
            <>
              <div className="imageUpload">
                <label style={{ font: "16px QuicksandMedium" }}>File: </label>
                <input
                  id="raised-button-file"
                  type="file"
                  onChange={onFileChange}
                  accept="application/pdf"
                />
              </div>
              {props.editResource && props.editResource.pdf_url && (
                <p style={{ font: "16px QuicksandMedium" }}>
                  Existing PDF:{" "}
                  <a
                    href={props.editResource.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open PDF
                  </a>
                </p>
              )}
            </>
          )}
          {type != "pdf" && (
            <TextField
              id="link_url"
              label="Link Url"
              value={linkUrl}
              className="textInput"
              required
              maxRows={20}
              variant="filled"
              onChange={(event) => {
                setLinkUrl(event.target.value);
              }}
            />
          )}

          {props.editResource && props.editResource.is_deleted && (
            <Link
              onClick={() => {
                unarchiveResource(props.editResource);
              }}
              style={{
                float: "left",
                marginRight: 20,
                marginTop: 5,
                cursor: "pointer",
              }}
            >
              <div style={{ float: "left", marginRight: 5, marginTop: 2 }}>
                <UnarchiveIcon style={{ color: "#919191" }} />
              </div>
              <div
                style={{
                  float: "left",
                  fontSize: 16,
                  marginTop: 5,
                  color: "#757575",
                  font: "14px QuicksandMedium",
                }}
              >
                Unarchive Resource
              </div>
            </Link>
          )}
        </Grid>
      </GeneralModal>
    </>
  );
};

export default AddResource;

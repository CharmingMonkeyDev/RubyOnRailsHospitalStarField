import { Grid, InputLabel, TextField } from "@mui/material";
import * as React from "react";

import CloseIcon from "@mui/icons-material/Close";

// helpers imports
import { AuthenticationContext } from "../Context";
import FlashMessage from "../shared/FlashMessage";
import { getHeaders } from "../utils/HeaderHelper";
import GeneralModal from "../modals/GeneralModal";

interface Props {
  modalOpen: boolean;
  closeModal: any;
  selectedCatId: string;
  categoryName: string;
  setRenderingKey: any;
}

const CategoryModal: React.FC<Props> = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  const [name, setName] = React.useState<string>("");
  const [formType, setFormType] = React.useState<string>("new");

  const validForm = () => {
    return !!name;
  };

  React.useEffect(() => {
    if (props.selectedCatId) {
      setFormType("Edit");
      setName(props.categoryName);
    }
  }, [props.selectedCatId]);

  const getCategorDetail = () => {
    fetch(`/action_categories/${props.selectedCatId}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          if (result?.resource) {
            const cat = result.resource;
            setName(cat.display_name);
          } else {
            alert("Something is wrong and template cannot be saved");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveCategory = () => {
    if (validForm()) {
      let url = `/action_categories`;
      let method = "POST";
      let message = "New Category Added";
      if (props.selectedCatId) {
        url = `${url}/${props.selectedCatId}`;
        method = "PUT";
        message = "Category Updated";
      }
      fetch(url, {
        method: method,
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          action_category: {
            name: name,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            if (result?.resource) {
              setFlashMessage({
                message: message,
                type: "success",
              });
              closeModal();
            } else {
              alert("Something is wrong and template cannot be saved");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setFlashMessage({
        message: "Invalid Name",
        type: "error",
      });
    }
  };

  const closeModal = () => {
    setName("");
    props.setRenderingKey(Math.random);
    props.closeModal();
  };

  return (
    <>
      <FlashMessage flashMessage={flashMessage} />
      <GeneralModal
        open={props.modalOpen}
        title={(formType == "new" ? "Add New " : "Edit ") + "Custom Category"}
        successCallback={saveCategory}
        closeCallback={closeModal}
        width="500px"
        containerClassName="form-container"
        modalClassName="patient-edit-container"
        confirmButtonText="Save Category"
      >
        <Grid container>
          <Grid item xs={12}>
            <InputLabel htmlFor="name" className="field-label">
              Category Name
            </InputLabel>
          </Grid>
          <Grid item xs={12} className="field-container">
            <TextField
              id="name"
              size="small"
              value={name}
              className="the-field"
              required
              variant="outlined"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </Grid>
        </Grid>
      </GeneralModal>
    </>
  );
};

export default CategoryModal;

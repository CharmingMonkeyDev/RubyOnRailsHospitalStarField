import { Grid, InputLabel, MenuItem, TextField } from "@mui/material";
import * as React from "react";

// helpers imports
import { AuthenticationContext } from "../Context";
import FlashMessage from "../shared/FlashMessage";
import { getHeaders } from "../utils/HeaderHelper";
import GeneralModal from "./GeneralModal";
import SVG from "react-inlinesvg";
import { categories } from "../CategoryIcons";

interface Props {
  modalOpen: boolean;
  setModalOpen: any;
  selectedCatId: string;
  setRenderingKey: any;
  onCategoryChange: Function;
}

const CategoryModal: React.FC<Props> = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  const [displayName, setDisplayName] = React.useState<string>("");
  const [icon, setIcon] = React.useState<string>("");
  const [formType, setFormType] = React.useState<string>("new");

  const validForm = () => {
    return !!displayName && !!icon;
  };

  React.useEffect(() => {
    if (props.selectedCatId) {
      getCategorDetail();
      setFormType("Edit");
    }
  }, [props.selectedCatId]);

  const getCategorDetail = () => {
    fetch(`/questionnaire_categories/${props.selectedCatId}`, {
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
            setDisplayName(cat.display_name);
            setIcon(cat.icon);
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
      let url = `/questionnaire_categories`;
      let method = "POST";
      let message = "New Category Added";
      if (props.selectedCatId) {
        url = `/questionnaire_categories/${props.selectedCatId}`;
        method = "PUT";
        message = "Category Updated";
      }
      fetch(url, {
        method: method,
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          questionnaire_category: {
            display_name: displayName,
            is_default: false,
            icon: icon,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            props.onCategoryChange();
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
        message: "Invalid Name or Icon",
        type: "error",
      });
    }
  };

  const closeModal = () => {
    setDisplayName("");
    setIcon("");
    props.setRenderingKey(Math.random);
    props.setModalOpen(false);
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
        <Grid container className="fum-form-container" spacing={1}>
          <Grid container>
            <Grid item xs={12}>
              <InputLabel htmlFor="name" className="field-label">
                Category Name*
              </InputLabel>
            </Grid>
            <Grid item xs={12} className="field-container">
              <TextField
                id="display_name"
                size="small"
                value={displayName}
                className="the-field"
                required
                variant="outlined"
                onChange={(event) => {
                  setDisplayName(event.target.value);
                }}
              />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12}>
              <InputLabel htmlFor="name" className="field-label">
                Icon*
              </InputLabel>
            </Grid>
            <Grid item xs={12} className="field-container">
              <TextField
                id="icon"
                size="small"
                value={icon}
                className="the-field"
                required
                variant="outlined"
                onChange={(event) => {
                  setIcon(event.target.value);
                }}
                select
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.key}
                    value={category.key}
                    style={{ display: "flex" }}
                  >
                    <SVG
                      src={category.icon}
                      width={25}
                      height={25}
                      fill={"black"}
                      aria-placeholder={category.label}
                      style={{
                        marginRight: 8,
                        marginBottom: "-3px",
                      }}
                    />

                    <span>{category.label}</span>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
      </GeneralModal>
    </>
  );
};

export default CategoryModal;

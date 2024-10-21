import * as React from "react";
import { Grid, Link, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";
import FlashMessage from "../shared/FlashMessage";

interface Props {
  modalOpen: boolean;
  setModalOpen: any;
  selectedQuestionnaireId: string;
}

const QuestionnaireResrouces: React.FC<Props> = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  const getResources = () => {
    if (props.selectedQuestionnaireId) {
      fetch(`/questionnaire_categories/`, {
        method: "Delete",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            alert(result.error);
          } else {
            setFlashMessage({
              message: "Category Archived",
              type: "success",
            });
            closeModal();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setFlashMessage({
        type: "error",
      });
      closeModal();
    }
  };

  const closeModal = () => {
    props.setModalOpen(false);
  };

  React.useEffect(() => {
    getResources;
  }, []);

  return (
    <>
      <FlashMessage flashMessage={flashMessage} />
      <Modal open={props.modalOpen} className="follow-up-modal">
        <div className="paper" style={{ width: "430px", padding: "0px" }}>
          <div className="paperInner" style={{ padding: "0px" }}>
            <Grid container className="fum-header-container">
              <Grid item xs={10}>
                <h1 className="fum-header">Questionnaire Resources</h1>
              </Grid>
              <Grid item xs={2} className="fum-close-icon-container">
                <Link onClick={closeModal} style={{ color: "black" }}>
                  <CloseIcon />
                </Link>
              </Grid>
            </Grid>
            <div className="divider-orange" style={{ margin: "0px" }}></div>
            <Grid container className="fum-form-container" spacing={1}>
              <p>
                You are attempting to archive this category. This cannot be
                undone. This will not affect published questionnaires. Would you
                like to continue?
              </p>
            </Grid>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QuestionnaireResrouces;

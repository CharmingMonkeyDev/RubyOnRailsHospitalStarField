import * as React from "react";
import { Modal as ArchiveModal } from "../modals/Modal";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";
import FlashMessage from "../shared/FlashMessage";

interface Props {
  modalOpen: boolean;
  setModalOpen: any;
  selectedCatId: string;
  setRenderingKey: any;
  onCategoryChange: Function;
}

const ArchiveCategory: React.FC<Props> = (props: Props) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  const ArchiveCategory = () => {
    if (props.selectedCatId) {
      fetch(`/questionnaire_categories/${props.selectedCatId}/archive`, {
        method: "Put",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            setFlashMessage({
              message: result.error,
              type: "error",
            });
          } else {
            props.onCategoryChange();
            setFlashMessage({
              message: "Category Archived",
              type: "success",
            });
          }
          closeModal();
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
    props.setRenderingKey(Math.random);
    props.setModalOpen(false);
  };

  return (
    <>
      <FlashMessage flashMessage={flashMessage} />
      <ArchiveModal
        successModalOpen={props.modalOpen}
        setSuccessModalOpen={props.setModalOpen}
        successHeader={"Archive Custom Category"}
        successContent={
          "You are attempting to archive this category. This cannot be undone. This will not affect published questionnaires. Would you like to continue?"
        }
        successCallback={ArchiveCategory}
        closeCallback={closeModal}
        confirmButtonText="Archive Category"
      />
    </>
  );
};

export default ArchiveCategory;

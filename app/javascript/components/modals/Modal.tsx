import { Button, Grid, Modal as MuiModal } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { ImagesContext } from "../Context";

interface Props {
  successModalOpen: boolean;
  setSuccessModalOpen: Function;
  successHeader: string | JSX.Element | Array<JSX.Element>;
  successContent: string | JSX.Element | Array<JSX.Element>;
  successCallback: Function;
  closeCallback: Function;
  confirmButtonText?: string;
  width?: string;
  buttonWidth?: string;
  isLoading?: boolean;
  padding?: string;
  closeIconSize?: number;
}

export const Modal: React.FC<Props> = (props) => {
  const {
    successModalOpen,
    setSuccessModalOpen,
    successHeader,
    successContent,
    successCallback,
    closeCallback,
    width = "800px",
    isLoading = false,
    padding = "40px",
    closeIconSize = 30,
  } = props;

  const images = React.useContext(ImagesContext);

  return (
    <>
      <MuiModal
        open={successModalOpen}
        className="modal-primary"
        onClose={() => closeCallback()}
      >
        <div className="paper" style={{ width: width }}>
          <div className="paperInner">
            <Grid container>
              <Grid item xs={12}>
                <div className="main-header">
                  {successHeader}
                  <span
                    id="dismiss-button"
                    onClick={() => {
                      setSuccessModalOpen(false);
                      closeCallback();
                    }}
                  >
                    <ClearIcon
                      sx={{ width: closeIconSize, height: closeIconSize }}
                    />
                  </span>
                </div>
              </Grid>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <div className="content" style={{ padding: padding }}>
                  {successContent}
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              className="modal-footer"
            >
              <Grid item xs={12} className="confirm-btn-container">
                <div
                  onClick={() => {
                    setSuccessModalOpen(false);
                    closeCallback();
                  }}
                  className="cancel-link"
                >
                  Cancel
                </div>
                {!isLoading ? (
                  <Button
                    onClick={() => {
                      successCallback();
                    }}
                    className="confirm-btn"
                    style={{ width: props.buttonWidth ?? "200px" }}
                  >
                    {props.confirmButtonText ?? "Continue"}
                  </Button>
                ) : (
                  <div className="cancel-link" style={{ padding: 0 }}>
                    <img src={images.spinner_src} style={{ width: 24 }}></img>
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      </MuiModal>
    </>
  );
};

export default Modal;
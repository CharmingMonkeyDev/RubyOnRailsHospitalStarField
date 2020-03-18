import { Button, Grid, Modal as MuiModal } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { ImagesContext } from "../Context";
import { string } from "prop-types";

interface Props {
  open: boolean;
  title: string | JSX.Element | Array<JSX.Element>;
  successCallback: Function;
  closeCallback: any;
  confirmButtonText?: string;
  confirmButtonClass?: string;
  cancelButtonText?: string;
  width?: string;
  children?: any;
  showClosedIcon?: boolean;
  modalClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
  showContinueIcon?: boolean;
  showCancelButton?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
  closeIconSize?: number;
}

export const GeneralModal: React.FC<Props> = ({
  open,
  title,
  successCallback,
  closeCallback,
  children,
  width = "800px",
  showClosedIcon = true,
  confirmButtonText = "Continue",
  confirmButtonClass = "",
  cancelButtonText = "Cancel",
  modalClassName = "",
  containerClassName = "",
  headerClassName = "",
  showContinueIcon = true,
  showCancelButton = true,
  fullWidth = false,
  isLoading = false,
  closeIconSize = 30,
}) => {
  const images = React.useContext(ImagesContext);

  return (
    <>
      <MuiModal
        open={open}
        className={"modal-primary " + modalClassName}
        onClose={closeCallback}
      >
        <div className="paper" style={{ width: width }}>
          <div className="paperInner">
            <Grid container className={containerClassName}>
              <Grid item xs={12}>
                <div className={`main-header ${headerClassName}`}>
                  {title}
                  {showClosedIcon && (
                    <span
                      id="dismiss-button"
                      onClick={() => {
                        closeCallback();
                      }}
                    >
                      <ClearIcon
                        sx={{ width: closeIconSize, height: closeIconSize }}
                      />
                    </span>
                  )}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div
                  className="content"
                  style={fullWidth ? {} : { padding: "0 40px 0  40px" }}
                >
                  {children}
                </div>
              </Grid>
            </Grid>
            <Grid container className="modal-footer" style={{ marginTop: 25 }}>
              <Grid
                item
                xs={12}
                container
                className="confirm-btn-container"
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                {showCancelButton && (
                  <div
                    onClick={() => {
                      closeCallback();
                    }}
                    className="cancel-link"
                  >
                    {cancelButtonText}
                  </div>
                )}
                {showContinueIcon &&
                  (!isLoading ? (
                    <Button
                      onClick={() => {
                        successCallback();
                      }}
                      className={"confirm-btn " + confirmButtonClass}
                    >
                      {confirmButtonText}
                    </Button>
                  ) : (
                    <div className="cancel-link" style={{ padding: 0 }}>
                      <img src={images.spinner_src} style={{ width: 24 }}></img>
                    </div>
                  ))}
              </Grid>
            </Grid>
          </div>
        </div>
      </MuiModal>
    </>
  );
};

export default GeneralModal;

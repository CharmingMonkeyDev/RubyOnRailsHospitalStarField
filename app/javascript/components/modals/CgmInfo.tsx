import * as React from "react";
import { Grid, Link, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import GeneralModal from "./GeneralModal";

interface Props {
  modalOpen: boolean;
  setModalOpen: any;
}

const CgmInfo: React.FC<Props> = (props: Props) => {
  const [pageNum, setPageNum] = React.useState<number>(1);

  return (
    <GeneralModal
      open={props.modalOpen}
      title={"Glucose Monitoring Resource"}
      successCallback={undefined}
      closeCallback={() => props.setModalOpen(false)}
      containerClassName="add-patient-modal"
      confirmButtonText="Confirm"
      width="700px"
      showContinueIcon={false}
      showCancelButton={false}
    >
      <Grid container justifyContent="center" className="fum-form-container">
        {pageNum == 1 ? (
          <iframe
            src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/dexcom_info_page_1.pdf#toolbar=0&navpanes=0&scrollbar=0"
            width="100%"
            height="600px"
          ></iframe>
        ) : (
          <iframe
            src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/dexcom_info_page_2.pdf#toolbar=0&navpanes=0&scrollbar=0"
            width="100%"
            height="600px"
          ></iframe>
        )}
        <Grid justifyContent="center">
          <p className="pagerLinks">
            <Link
              onClick={() => {
                setPageNum(1);
              }}
              className="linkDark"
            >
              <ArrowBackIosIcon />
            </Link>
            <Link
              key={1}
              onClick={() => {
                setPageNum(1);
              }}
              className={pageNum === 1 ? "linkDark" : "linkLight"}
            >
              1
            </Link>
            <Link
              key={2}
              onClick={() => {
                setPageNum(2);
              }}
              className={pageNum === 2 ? "linkDark" : "linkLight"}
            >
              2
            </Link>
            <Link
              onClick={() => {
                setPageNum(2);
              }}
              className="linkDark"
            >
              <ArrowForwardIosIcon />
            </Link>
          </p>
        </Grid>
      </Grid>
    </GeneralModal>
  );
};

export default CgmInfo;

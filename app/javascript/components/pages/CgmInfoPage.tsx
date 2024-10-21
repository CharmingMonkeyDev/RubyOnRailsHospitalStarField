import * as React from "react";
import { Grid, Link, Modal } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {}

const CgmInfoPage: React.FC<Props> = (props: Props) => {
  const [pageNum, setPageNum] = React.useState<number>(1);

  return (
    <div className="cgm-info-container">
      <p
        className="page-title"
        style={{
          textAlign: "center",
          fontSize: 26,
          fontFamily: "$font-qs-medium",
          marginTop: 30,
        }}
      >
        Glucose Monitoring Resource
      </p>
      <Grid container justifyContent="center" className="fum-form-container">
        {pageNum == 1 ? (
          <iframe
            src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/dexcom_info_page_1.pdf#toolbar=0&navpanes=0&scrollbar=0"
            width="100%"
            height="80%"
          ></iframe>
        ) : (
          <iframe
            src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/dexcom_info_page_2.pdf#toolbar=0&navpanes=0&scrollbar=0"
            width="100%"
            height="80%"
          ></iframe>
        )}
        <Grid alignItems="center" justifyContent="center">
          <p
            className="pagerLinks"
            style={{
              textAlign: "center",
              padding: 5,
              cursor: "pointer",
              fontSize: 25,
              fontFamily: "$font-qs-medium",
            }}
          >
            <Link
              onClick={() => {
                setPageNum(1);
              }}
              className="linkDark"
            >
              <ArrowBackIosIcon style={{ width: 20, height: 20 }} />
            </Link>
            <Link
              key={1}
              onClick={() => {
                setPageNum(1);
              }}
              style={{
                color: pageNum === 1 ? "#4a4442" : "#c1b7b3",
              }}
            >
              1
            </Link>
            <Link
              key={2}
              onClick={() => {
                setPageNum(2);
              }}
              style={{
                color: pageNum === 2 ? "#4a4442" : "#c1b7b3",
              }}
            >
              2
            </Link>
            <Link
              onClick={() => {
                setPageNum(2);
              }}
              className="linkDark"
            >
              <ArrowForwardIosIcon style={{ width: 20, height: 20 }} />
            </Link>
          </p>
        </Grid>
      </Grid>
    </div>
  );
};

export default CgmInfoPage;
import Delete from "@mui/icons-material/Delete";
import { Grid, Link } from "@mui/material";
import * as React from "react";
import { ImagesContext } from "../../../../../Context";
import { formatPhoneNumber } from "../../../../../utils/StringHelper";

interface Props {
  facility: any;
  handleRemove: Function;
  handleTransfer: Function;
}

const LtcFacilityRow: React.FC<Props> = (props) => {
  const images = React.useContext(ImagesContext);

  return (
    <div className="overview-container row space-between">
      <Grid container>
        <Grid
          item
          xs={12}
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Grid
            item
            xs={4}
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <div className="item-icon-container facility-icon-container">
              <img
                src={images.place_icon}
                alt="Insurance Icon"
                className="action-icon-image"
                style={{ width: 38, maxHeight: 37 }}
              />
            </div>
            <div className="header-text-container">
              <h4 className="overview-header">{props.facility?.name}</h4>
              <p className="facility-details">
                {props.facility?.address_1}, 
                {props.facility?.address_2} <br />
                {props.facility?.city}, {props.facility?.state}{" "}
                {props.facility?.zip}
              </p>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="header-text-container">
              <h4 className="medical_id_text facility-phone-number">
              Phone Number: {formatPhoneNumber(props.facility?.phone_number)}
              </h4>
            </div>
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            sx={{ pt: 1 }}
          >
            <div
              className="row"
              style={{
                marginTop: 25,
              }}
            >
              <Link
                className="action-link add-encounter"
                onClick={() => props.handleTransfer(props.facility)}
                sx={{ mr: 2.5 }}
              >
                <div className="item-icon-container">
                  <img
                    src={images.transfer_icon}
                    alt="Transfer"
                    className="action-icon-image"
                    style={{ width: 28, maxHeight: 27 }}
                  />{" "}
                </div>
              </Link>
              <Link
                className="action-link add-encounter"
                onClick={() => {
                  props.handleRemove(props.facility);
                }}
              >
                <div className="item-icon-container">
                  <Delete sx={{ height: 24, color: "#FF890A" }} />
                </div>
              </Link>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default LtcFacilityRow;
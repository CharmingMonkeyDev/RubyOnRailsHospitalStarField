import { Link } from "@mui/material";
import React from "react";

interface Props {
  href?: string;
  onLinkClick?: Function;
  noPadding?: boolean;
}
const AddResourceButton: React.FC<Props> = (props: any) => {
  return (
    <Link
      href={props.href ?? "#"}
      onClick={props.onLinkClick}
      className="grey-font"
      style={{
        height: "40px",
        display: "flex",
        alignItems: "center",
        fontSize: "15px",
        paddingLeft: props.noPadding ? "0" : "10px",
        marginTop: "10px",
      }}
    >
      <img
        src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/menu-track.png"
        width="20"
        alt="Add Resource"
        style={{ padding: "5px" }}
      />
      <b>Add Resource</b>
    </Link>
  );
};

export default AddResourceButton;

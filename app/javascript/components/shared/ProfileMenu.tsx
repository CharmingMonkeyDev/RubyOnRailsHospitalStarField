/* eslint-disable prettier/prettier */

// library imports
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

// customized menu imports
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";

// style and other app setting imports
import { useHeaderStyles } from "../styles/useHeaderStyles";
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

interface Props {
  user: any;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {},
}));

const ProfileMenu: React.FC<Props> = (props: any) => {
  //  context import
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states and styles
  const { classes } = useHeaderStyles();

  // customized menu options
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div id="profile-menu-container">
      <Button
        id="profile-menu-button"
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={open ? <ArrowDropUp /> : <ArrowDropDown fontSize="large" />}
      >
        <div className="hex-container">
          <span className="letter">
            {props.user.name && props.user.name[0]}
          </span>
        </div>
      </Button>
      <StyledMenu
        id="profile-menu"
        MenuListProps={{
          "aria-labelledby": "profile-menu-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {props.user.role != "patient" && (
          <RouterLink to="/profile-edit">
            <MenuItem onClick={handleClose} disableRipple>
              EDIT PROFILE
            </MenuItem>
          </RouterLink>
        )}
        <Divider />
        <a rel="nofollow" href="/terms">
          <MenuItem onClick={handleClose} disableRipple>
            TERMS & CONDITIONS
          </MenuItem>
        </a>
        <Divider />

        <a rel="nofollow" data-method="delete" href="/users/sign_out">
          <MenuItem onClick={handleClose} disableRipple>
            LOG OUT
          </MenuItem>
        </a>
      </StyledMenu>
    </div>
  );
};

export default ProfileMenu;

import { SvgIcon } from "@mui/material";
import Menu from "@mui/material/Menu"
import React, { useState } from "react"
import { ImagesContext } from "../Context";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";

interface Props {
    id: string,
    children: any,
}

const DropdownWidget: React.FC<Props> = ({
    id, children
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const images = React.useContext(ImagesContext);
    const open = Boolean(anchorEl);

    const openMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }
    return (
        <React.Fragment>
            <button 
            id={id}
            onClick={openMenu}
            style={{
                border: "none",
                borderRadius: "4px",
                background: "#EFE9E7",
                width: "208px", 
                height: "40px", 
                justifyContent:"space-between", 
                display: "inline-flex",
                padding: "unset",
            }}
            >
                <div style={{display: "inline-flex"}}>
                    <img
                        src={images.md_filter_list_icon}
                        width={20}
                        height={20}
                        style={{
                            paddingLeft: '10px',
                            paddingTop: '11px',
                            paddingBottom: '9px'
                        }}
                        className="sort-icon"
                        alt="Sort Asc"
                    />
                    <div style={{
                        paddingLeft: "6px",
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        width: "108px",
                        height: "16px",
                        color: "#1E1E1E",
                        fontFamily: "QuicksandMedium",
                        fontSize: "12px",
                        fontStyle: "normal",
                        fontWeight: "500",
                        lineHeight: "16px",
                    }}>
                        Advanced Search
                    </div>
                </div>
                <div>
                    <ArrowDropDownIcon sx={{width: 24, height: 24, color: '#1E1E1E', paddingTop: '9px', paddingRight: '9px', paddingBottom: '7px'}}/>
                </div>
            </button>
            <Menu 
            anchorEl={anchorEl}
                open={open}
                onClose={handleClose}

                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 5,
                    horizontal: 'left',
                }}>
                {children}
            </Menu>
        </React.Fragment>
    )
}

export default DropdownWidget;
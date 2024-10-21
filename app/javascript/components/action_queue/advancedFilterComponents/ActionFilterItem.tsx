import React, { useContext, useEffect } from "react";
import CountBadge from "./CountBadge";
import { AdvancedFilterContext } from "../../../context/AdvancedFilterContext";
import { FormControlLabel } from "@material-ui/core";
import { Radio } from "@mui/material";

interface props {
    value: string,
    text: string,
    count: string | number,
}

const ActionFilterItem: React.FC<props> = ({value, text, count}) => {
    const advancedFilterSetting = useContext(AdvancedFilterContext);
    if (!advancedFilterSetting) {
        throw new Error("MyComponent must be used within an AdvancedFilterProvider");
    }
    const { actionTypeFilter, setActionTypeFilter } = advancedFilterSetting;
    const handleOnChange = (e) => {
        setActionTypeFilter(value);
    }

    return (<div className="filter-item">
        <label style={{display: "inline-flex", height: '23px', alignItems: 'center'}}>
            
            <FormControlLabel
            value={value}
            checked={actionTypeFilter === value ? true : false} 
            onChange={handleOnChange} 
            control={<Radio sx={{
                '& .MuiSvgIcon-root': {
                    fontSize: 13.8,
                    padding: 0,
                },
            }} />}
            label={
                <p style={{
                    color: '#212B36',
                    fontFamily: 'QuicksandMedium',
                    fontSize: '10px',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: '20px',
                    letterSpacing: '-0.1px',
                }}>
                    {value}
                </p>
            } 
            style={{
                marginLeft: 0,
                padding: "0"
            }}/>
            <CountBadge count={count}/>
        </label>
    </div>)
}

export default ActionFilterItem;
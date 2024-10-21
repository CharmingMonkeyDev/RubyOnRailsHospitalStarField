
import React, { useContext, useEffect, useState } from "react"
import CountBadge from "./CountBadge"
import { AdvancedFilterContext } from "../../../context/AdvancedFilterContext";
import { Checkbox, FormControlLabel } from "@mui/material";

interface props {
    value: string,
    text: string,
    count: string | number
}

export const AdvancedCateogoryItem: React.FC<props> = ({value, text, count}) => {
    const advancedFilterSetting = useContext(AdvancedFilterContext);
    if (!advancedFilterSetting) {
        throw new Error("MyComponent must be used within an AdvancedFilterProvider");
    }
    const { 
        advancedCategories,
        toggleAdvancedCategories
     } = advancedFilterSetting;
    const [selected, setSelected] = useState(false);
    useEffect(() => {
        if (advancedFilterSetting) {
            setSelected(advancedCategories.includes(value));
        } 
    }, [])

    const handleOnChange = (e) => {
        e.preventDefault();
        toggleAdvancedCategories(value);
        console.log(advancedCategories);
    }

    return (
        <div className="filter-item">
            <label style={{display: "inline-flex", alignItems: 'center', height: '23px'}}>
                <FormControlLabel
                    control={<Checkbox 
                        value={value}
                        onChange={handleOnChange} 
                        checked={selected} 
                        sx={{
                        '& .MuiSvgIcon-root': {
                            fontSize: '10px',
                            width: '12px',
                            height: '12px',
                            padding: '0',
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
                            margin: '0'
                        }}>
                            {value}
                        </p>
                    } 
                    style={{
                        marginLeft: 0,
                        marginRight: 8,
                        padding: "0"
                    }}/>
                <CountBadge count={count} />
            </label>
        </div>
    )
}
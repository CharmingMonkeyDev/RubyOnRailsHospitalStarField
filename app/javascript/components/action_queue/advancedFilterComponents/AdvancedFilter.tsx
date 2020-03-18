import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import SvgIcon from '@mui/material/SvgIcon';
import ActionFilterItem from "./ActionFilterItem";
import { ProviderFilterItem } from "./ProviderFilterItem";
import { AdvancedCateogoryItem } from "./AdvancedCategoryItem";
import { ImagesContext } from "../../Context";
import { AdvancedFilterContext } from "../../../context/AdvancedFilterContext";
import TogglePannel from "./TogglePannel";

interface props {

}

const AdvancedFilter:React.FC<props> = ({}) => {
    const advancedFilterSetting = React.useContext(AdvancedFilterContext);
    if (!advancedFilterSetting) {
        throw new Error("MyComponent must be used within an AdvancedFilterProvider");
    }
    const {
        setActionTypeFilter,
        setProviderFilterList,
        setAdvancedCategories,
    } = advancedFilterSetting;
    const images = React.useContext(ImagesContext);

    const GrayPannel = ({children}) => {
        return (
            <div style={{
                width: '100%',
                background: '#F8F8F8',
            }}>
                {children}
            </div>
        )
    }

    const _handleClearAll = (e) => {
        e.preventDefault();
        setActionTypeFilter('');
        setProviderFilterList([]);
        setAdvancedCategories([]);
    }
    return (
        <React.Fragment>
            <div style={{
                width: "264px",
                height: "736px",
                borderRadius: "4px",
                background: "#FFF",
                position: 'relative',
                gap: '4px'
            }}>
                <div style={{
                    display: 'inline-flex', 
                    justifyContent:'space-between', paddingTop: '12px', paddingLeft: '20px', paddingBottom: '10px'}}>
                    <div style={{display:'inline-block'}}>
                        <p
                            style={{
                                width: '91px',
                                height: '16px',
                                color: '#1E1E1E',
                                fontFamily: 'QuicksandMedium',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: '700',
                                lineHeight: '16px', /* 100% */
                                margin: 'auto',
                            }}>Filters</p>
                        <span 
                        style={{
                            color: '#A29D9B',
                            fontFamily: 'QuicksandMedium',
                            fontSize: '10px',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            lineHeight: '16px'
                        }}
                        >02/15 - 02/28</span>
                    </div>

                    <button 
                        onClick={_handleClearAll}
                        style={{
                            display:'inline-flex',
                            border: 'none',
                            background: 'none',
                            position: 'absolute',
                            top: '12px',
                            right: '12px'
                        }}>
                        <img
                            src={images.md_close_icon}
                            width={9}
                            height={9.872}
                            style={{borderRadius: '1px', margin: 'auto'}}
                            className="sort-icon"
                            alt="Sort Asc"
                        />
                        <span className="clear-all"
                            style={{
                                marginLeft: '4px',
                                color: '#FF890A',
                                textAlign: 'right',
                                fontFamily: 'QuicksandMedium',
                                fontSize: '10px',
                                fontStyle: 'normal',
                                fontWeight: '700',
                                lineHeight: '16px',
                            }}>Clear All</span>
                    </button>
                </div>
                <GrayPannel>
                    <div 
                        className="filter-group" 
                        style={{paddingTop: '15px', paddingLeft: '12px', paddingBottom:'15px' }}
                        id='action-filter-menu'>
                        <ActionFilterItem count={123} text="All Actions" value="All Actions"/>
                        <ActionFilterItem count={20} text="My Actions" value="My Actions"/>
                        <ActionFilterItem count={23} text="Unassigned Actions" value="Unassigned Actions"/>
                        <ActionFilterItem count={100} text="Assigned Actions" value="Assigned Actions"/>
                        <ActionFilterItem count="04" text="Overdue Actions"  value="Overdue Actions"/>
                    </div>
                </GrayPannel>
                <TogglePannel title="Providers">
                    <GrayPannel>
                        <div 
                            className="filter-group" 
                            style={{paddingTop: '18px', paddingLeft: '12px', paddingBottom: '18px'}}
                            id='action-filter-menu'>
                            <ProviderFilterItem value="Smith, Jan" text="Smith, Jan" count={56} />
                            <ProviderFilterItem value="Ness, DJ" text="Ness, DJ" count={34} />
                            <ProviderFilterItem value="Davis, Anthony" text="Davis, Anthony " count={26} />
                            <ProviderFilterItem value="Rue, Jesse" text="Rue, Jesse" count={14} />
                            <ProviderFilterItem value="Chamberlain, Robert" text="Chamberlain, Robert" count={10} />
                            <ProviderFilterItem value="Diehl, Kacey" text="Diehl, Kacey" count={'08'} />                        
                            <div style={{
                                width: '75px',
                                height: '16px',
                                justifyContent: 'center',
                                color: '#FF890A',
                                fontFamily: 'QuicksandMedium',
                                fontSize: '10px',
                                fontWeight: '700',
                                lineHeight: '16px',
                                paddingLeft: '8px'
                            }}>View all...</div>
                        </div>
                    </GrayPannel>
                </TogglePannel>
                <TogglePannel title="Advanced Categories">
                    <GrayPannel>
                        <div 
                            className="filter-group" 
                            style={{paddingTop: '20px', paddingLeft: '12px', paddingBottom: '6px', }}
                            id='action-filter-menu'>
                            <AdvancedCateogoryItem value="ADT Notifications" text="ADT Notifications" count={26} />
                            <AdvancedCateogoryItem value="Questionnaire Submissions" text="Questionnaire Submissions" count={14} />
                        </div>
                    </GrayPannel>
                </TogglePannel>
            </div>
        </React.Fragment>
    )
}

export default AdvancedFilter;
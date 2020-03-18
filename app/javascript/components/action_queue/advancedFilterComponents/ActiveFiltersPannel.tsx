import {
	Grid,
	Box,
	Chip,
} from "@mui/material";
import OrangeBadgeList from "./BadgeListPannel";
import React, { useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { AdvancedFilterContext } from "../../../context/AdvancedFilterContext";

interface props {

}
const ActiveFiltersBadgesPannel: React.FC<props> = ({}) => {
    const advancedFilterSetting = useContext(AdvancedFilterContext);
    const {
        actionTypeFilter,
        providerFilterList,
        advancedCategories,
        setActionTypeFilter,
        setProviderFilterList,
        setAdvancedCategories,
    } = advancedFilterSetting;
  
    const [show, setShow] = React.useState<Boolean>(false);
    React.useEffect(() => {    
        if ((actionTypeFilter && actionTypeFilter !== '') || providerFilterList.length > 0 || advancedCategories.length > 0) {
            setShow(true);
        } else setShow(false);
    }, [actionTypeFilter, providerFilterList, advancedCategories]);

    const _handleClearAll = (e) => {
        e.preventDefault();
        setActionTypeFilter('');
        setProviderFilterList([]);
        setAdvancedCategories([]);
    }

    return (
        <>
            {show && (<Grid 
                style={{
                    paddingLeft: '30px',
                    paddingRight: '60px',
                }}
                container>
                <Grid item xs={12}>
                    <Box width={"100%"}>
                        <Box sx={{
                            paddingTop: '11px',
                            paddingBottom: '9px'
                        }}>
                            <Box sx={{
                                textAlign: 'left',
                                width: '165px',
                                height:'16px',
                                color: '#1E1E1E',
                                fontFamily: 'QuicksandMedium',
                                fontSize: '8px',
                                fontStyle: 'normal',
                                fontWeight: '500',
                                lineHeight: '16px',
                                paddingLeft: '1px',
                                paddingBottom: '1px'
                            }}>
                                Active Filters
                            </Box>
                            <Box sx={{
                                width: '100%',
                                display: 'inline-flex',
                                padding: '9px 14px 9px 16px',
                                alignItems: 'start',
                                justifyContent: 'space-between',
                                borderRadius: '4px',
                                background: '#EFE9E7'
                            }}>
                                <OrangeBadgeList />
                                <Chip
                                onClick={_handleClearAll}
                                label="Clear All Filter"
                                sx={{
                                    height: 22,
                                    backgroundColor: "#FF890A",
                                    marginTop: '5px',
                                    color: "#FAFAFA",
                                    "& .MuiChip-label": {
                                    fontSize: 10,
                                    fontWeight: 700,
                                    lineHeight: 18,
                                    paddingLeft: '10px',
                                    },
                                    "& .MuiChip-deleteIcon": {
                                    color: "#FAFAFA",
                                    paddingLeft: '2px'
                                    },
                                }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>)}
        </>
    
    )
}

export default ActiveFiltersBadgesPannel;
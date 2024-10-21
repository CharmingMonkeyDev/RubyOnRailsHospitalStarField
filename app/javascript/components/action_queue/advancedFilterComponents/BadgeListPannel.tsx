import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import { AdvancedFilterContext } from "../../../context/AdvancedFilterContext";

interface ChipData {
  key: number | string;
  label: string;
  type: string;
}

interface Props {

}

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const OrangeBadgeList: React.FC<Props> = ({}) => {

  const advancedFiltersSetting = React.useContext(AdvancedFilterContext);

  const {
      actionTypeFilter,
      setActionTypeFilter,
      providerFilterList,
      setProviderFilterList,
      advancedCategories,
      setAdvancedCategories,
  } = advancedFiltersSetting;

  const [badgeList, setBadgeList] = React.useState<ChipData[]>([]);

  React.useEffect(() => {

      var tempList: ChipData[] = [];

      if (actionTypeFilter) {
        tempList.push({
          key: actionTypeFilter,
          label: actionTypeFilter,
          type: 'actionType'
        })
      };

      const providerBadges = providerFilterList.map(item => ({
        key: item,
        label: item,
        type: 'provider'
      }));
      
      const aCategoriesBadges = advancedCategories.map(item => ({
        key: item,
        label: item,
        type: 'advancedCategory'
      }));
      
      tempList.push(...providerBadges, ...aCategoriesBadges);
      
      setBadgeList(tempList);

  }, [actionTypeFilter, providerFilterList, advancedCategories]);

  const handleDelete = (data) => () => {
    if (data.type === 'actionType') {
      setActionTypeFilter('');
    }
    
    if (data.type === 'provider') {
      const filteredProviders = providerFilterList.filter(item => item !== data.key);
      setProviderFilterList(filteredProviders);
    }
    if (data.type === 'advancedCategory') {
      const filteredCategories = advancedCategories.filter(item => item !== data.key);
      setAdvancedCategories(filteredCategories);
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "start",
        flexWrap: "wrap",
        listStyle: "none",
        border: "none",
        background: "fixed",
        boxShadow: "none",
        p: 0,
        m: 0,
      }}
      component="ul"
    >
      {badgeList.map((data) => {
        return (
          <ListItem key={data.key}>
            <Chip
              label={data.label}
              onDelete={handleDelete(data)}
              deleteIcon={<CloseIcon sx={{ width: 14, height: 14 }} />}
              sx={{
                height: 22,
                backgroundColor: "#FF890A",

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
          </ListItem>
        );
      })}
    </Paper>
  );
};

export default OrangeBadgeList;
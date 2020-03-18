/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, Tabs, Tab } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AmbulatoryDaily from "./AmbulatoryDaily";
import AmbulatoryWeek from "./AmbulatoryWeek";

interface Props {
  csrfToken: string;
}
const ReportAmbulatory: React.FC<Props> = (props: any) => {
  const [value, setValue] = React.useState(0);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`wrapped-tabpanel-${index}`}
        aria-labelledby={`wrapped-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Grid container className="ambulatory-report-container">
      <Grid item xs={12}>
        <Grid container className="tabs-container">
          <Grid item xs={12} className="tabs-header-container">
            <Tabs
              value={value}
              onChange={handleChange}
              TabIndicatorProps={{ style: { display: "none" } }}
            >
              <Tab className="tabs-link" label="Daily" {...a11yProps(0)} />
              <Tab className="tabs-link" label="2 Week" {...a11yProps(1)} />
              <Tab className="tabs-link" label="4 Week" {...a11yProps(2)} />
            </Tabs>
          </Grid>
          <Grid item xs={12} className="tab-body-container">
            <TabPanel value={value} index={0}>
              <AmbulatoryDaily csrfToken={props.csrfToken} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <AmbulatoryWeek csrfToken={props.csrfToken} weekRange={2} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <AmbulatoryWeek csrfToken={props.csrfToken} weekRange={4} />
            </TabPanel>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ReportAmbulatory;

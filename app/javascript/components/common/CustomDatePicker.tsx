import * as React from "react";
import { Grid, Link, InputLabel, Box } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ImagesContext } from "../Context";

interface Props {
  id: string;
  label: string;
  placeholder: string;
  date: any;
  handleDateChange: Function;
  disabled: boolean;
}

const CustomDatePicker: React.FC<Props> = (props) => {
  const images = React.useContext(ImagesContext);
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Grid container>
      <Grid item xs={12}>
        <InputLabel htmlFor={props.id} className="field-label">
          {props.label}
        </InputLabel>
      </Grid>
      <Grid
        container
        xs={12}
        className="field-container"
        alignItems="center"
        justifyContent="space-between"
        sx={{ paddingRight: 2 }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            className="date-box"
            sx={{
              width: "88%",
              maxHeight: 41.13,
            }}
          >
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <DatePicker
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                value={props.date}
                onChange={(x) => props.handleDateChange(x)}
                format="MMMM Do, YYYY"
                disableOpenPicker
                disabled={props.disabled}
                slotProps={{
                  textField: {
                    placeholder: props.placeholder,
                  },
                }}
                className="report-date-input no-border-outline"
              />
            </DemoContainer>
          </Box>
        </LocalizationProvider>
        <Link className="invite-app-user-link" onClick={() => setOpen(true)}>
          <img
            src={images.calendar_icon}
            alt="Calendar"
            className="action-icon-image"
            style={{ width: 22.75, maxHeight: 26 }}
          />
        </Link>
      </Grid>
    </Grid>
  );
};

export default CustomDatePicker;

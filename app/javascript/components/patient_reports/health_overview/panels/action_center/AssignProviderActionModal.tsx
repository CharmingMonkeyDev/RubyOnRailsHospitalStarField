import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Radio,
  InputLabel,
  Grid,
  TextField,
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { Stack } from "@mui/system";
import * as React from "react";
import GeneralModal from "../../../../modals/GeneralModal";
import {
  AuthenticationContext,
  FlashContext,
  ImagesContext,
} from "../../../../Context";
import { useState } from "react";
import { getHeaders } from "../../../../utils/HeaderHelper";
import dayjs from "dayjs";
import { setSortOrder } from "../../../../shared/tables/TableHelper";
import SearchIcon from "@mui/icons-material/Search";

interface AssignActionForm {
  action_id: number | undefined;
  start_date: Date | undefined;
}

const AssignProviderActionModal = ({
  patientId,
  open,
  onAddAction,
  onCloseModal,
  publishedActions,
}) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);
  const [filteredActions, setFilteredActions] = useState<any>(publishedActions);
  const [assignActionForm, setAssignActionForm] = useState<AssignActionForm>({
    action_id: undefined,
    start_date: new Date(),
  });

  const images = React.useContext(ImagesContext);

  const [searchKey, setSearchKey] = React.useState<string>(undefined);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "title",
    direction: "ascending",
  });

  const getSortedAndSearchedList = () => {
    let filteredList = [...publishedActions];
    if (!!searchKey) {
      setAssignActionForm((prevState) => ({
        ...prevState,
        action_id: undefined,
      }));
      filteredList = publishedActions?.filter((action) => {
        const searchLower = searchKey.toLowerCase();
        return action.title.toLowerCase().includes(searchLower);
      });
    }
    filteredList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "title") {
      filteredList.sort((a, b) =>
        a.title?.toLowerCase() > b.title?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      filteredList.reverse();
    }
    return filteredList;
  };

  React.useEffect(() => {
    if (publishedActions) {
      const actionList = getSortedAndSearchedList();
      setFilteredActions(actionList);
    }
  }, [sortObject, searchKey, publishedActions]);

  const getSortIcon = (column) => {
    return sortObject.field == column ? (
      <span className="sortIndicator">
        {sortObject.direction == "ascending" ? (
          <img
            src={images.sort_ascending_src}
            width="10"
            className="sort-icon"
            alt="Sort Asc"
          />
        ) : (
          <img
            src={images.sort_descending_src}
            width="10"
            className="sort-icon"
            alt="Sort Desc"
          />
        )}
      </span>
    ) : (
      <span className="sortIndicator">
        <img
          src={images.sort_plain_src}
          width="10"
          className="sort-icon"
          alt="Sort Asc"
        />
      </span>
    );
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setAssignActionForm((prevState) => ({
        ...prevState,
        start_date: date,
      }));
    }
  };

  const handleActionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedActionId = parseInt(event.target.value, 10);
    setAssignActionForm((prevState) => ({
      ...prevState,
      action_id: selectedActionId,
    }));
  };

  const validateAssignActionForm = () => {
    return !!assignActionForm.action_id && !!assignActionForm.start_date;
  };

  const handleCloseModal = () => {
    resetAssignActionForm();
    onCloseModal();
  };

  const handleAssignAction = async () => {
    try {
      if (validateAssignActionForm()) {
        const response = await fetch(
          `/patients/${patientId}/assigned_provider_actions`,
          {
            method: "POST",
            headers: getHeaders(authenticationSetting.csrfToken),
            body: JSON.stringify({
              assigned_provider_action: assignActionForm,
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
          flashContext.setMessage({
            text: result.message,
            type: "success",
          });
          onAddAction();
        } else {
          flashContext.setMessage({
            text: result?.message ?? "Something went wrong",
            type: "error",
          });
        }
      } else {
        flashContext.setMessage({
          text: "Please select an action and a start date",
          type: "error",
        });
      }
    } catch (err) {
      flashContext.setMessage({
        text: "Something went wrong!",
        type: "error",
      });
    }
  };

  const resetAssignActionForm = () => {
    setAssignActionForm({
      action_id: undefined,
      start_date: new Date(),
    });
  };

  return (
    <GeneralModal
      open={open}
      title={"Select Action"}
      successCallback={handleAssignAction}
      closeCallback={handleCloseModal}
      fullWidth={true}
      width="900px"
    >
      <>
        <Grid
          container
          style={{ padding: "24px" }}
          alignItems={"center"}
          spacing={4}
        >
          <Grid
            item
            xs={12}
            md={5}
            style={{
              position: "relative",
              marginLeft: "0px !important",
            }}
          >
            <FormControl sx={{ width: "100%" }} variant="outlined">
              <OutlinedInput
                id="outlined-adornment-weight"
                placeholder="Search Actions"
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
                style={{ backgroundColor: "#EFE9E7", border: "none" }}
                value={searchKey}
                onChange={(event) => {
                  setSearchKey(event.target.value);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={7} className="subdued-text">
            {"Can't find the action you're looking for? Create one in the"}{" "}
            <a href="/action-builder-list">Action Builder</a>
          </Grid>
        </Grid>
        <TableContainer
          className="template-container"
          sx={{ maxHeight: "50vh" }}
        >
          <Table className="no-border-table">
            <TableHead sx={{ borderBottom: "1.5px solid black" }}>
              <TableRow>
                <TableCell width={"1%"} />
                <TableCell
                  className="bold-font-face nowrap-header"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSortOrder(
                      "title",
                      sortObject.direction == "ascending"
                        ? "descending"
                        : "ascending",
                      setSortObject
                    );
                  }}
                  sx={{ pl: "0" }}
                >
                  <strong>Title</strong>
                  {getSortIcon("title")}
                </TableCell>
                <TableCell className="nowrap-header bolder-text">
                  Subtext
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredActions?.map((action) => (
                <TableRow key={action?.id}>
                  <TableCell
                    width={"1%"}
                    align="right"
                    sx={{ pr: 0, pl: "24px" }}
                  >
                    <Radio
                      checked={assignActionForm.action_id == action.id}
                      value={action.id}
                      onChange={handleActionChange}
                    />
                  </TableCell>
                  <TableCell sx={{ pl: "0" }}>{action.title}</TableCell>
                  <TableCell>{action.subject}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack
          direction={"row"}
          width={"100%"}
          justifyContent={"center"}
          mt={4}
          mb={"-20px"}
        >
          <Stack>
            <InputLabel>Assign an Action Start Date</InputLabel>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                inputVariant="outlined"
                onChange={handleDateChange}
                value={assignActionForm.start_date}
                autoOk
                style={{ width: "300px" }}
              />
            </MuiPickersUtilsProvider>
          </Stack>
        </Stack>
      </>
    </GeneralModal>
  );
};

export default AssignProviderActionModal;

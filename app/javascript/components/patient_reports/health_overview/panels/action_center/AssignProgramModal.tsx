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

interface AssignProgramForm {
  program_id: number | undefined;
  start_date: Date | undefined;
}

const AssignProgramModal = ({
  patientId,
  open,
  onAddProgram,
  onCloseModal,
  publishedPrograms,
}) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);
  const [filteredPrograms, setFilteredPrograms] =
    useState<any>(publishedPrograms);
  const [assignProgramForm, setAssignProgramForm] = useState<AssignProgramForm>(
    {
      program_id: undefined,
      start_date: new Date(),
    }
  );

  const images = React.useContext(ImagesContext);

  const [searchKey, setSearchKey] = React.useState<string>(undefined);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "title",
    direction: "ascending",
  });

  const getSortedAndSearchedList = () => {
    let filteredList = [...publishedPrograms];
    if (!!searchKey) {
      setAssignProgramForm((prevState) => ({
        ...prevState,
        program_id: undefined,
      }));
      filteredList = publishedPrograms?.filter((program) => {
        const searchLower = searchKey.toLowerCase();

        return (
          program?.title?.toLowerCase().includes(searchLower) ||
          program?.subtext?.toLowerCase().includes(searchLower)
        );
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
    if (publishedPrograms) {
      const programList = getSortedAndSearchedList();
      setFilteredPrograms(programList);
    }
  }, [sortObject, searchKey, publishedPrograms]);

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
      setAssignProgramForm((prevState) => ({
        ...prevState,
        start_date: date,
      }));
    }
  };

  const handleProgramChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedProgramId = parseInt(event.target.value, 10);
    setAssignProgramForm((prevState) => ({
      ...prevState,
      program_id: selectedProgramId,
    }));
  };

  const validateAssignProgramForm = () => {
    return !!assignProgramForm.program_id && !!assignProgramForm.start_date;
  };

  const handleCloseModal = () => {
    resetAssignProgramForm();
    onCloseModal();
  };

  const handleAssignProgram = async () => {
    try {
      if (validateAssignProgramForm()) {
        const response = await fetch(
          `/patients/${patientId}/assigned_programs`,
          {
            method: "POST",
            headers: getHeaders(authenticationSetting.csrfToken),
            body: JSON.stringify({
              assigned_program: assignProgramForm,
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
          flashContext.setMessage({
            text: result.message,
            type: "success",
          });

          resetAssignProgramForm();
          onAddProgram();
        } else {
          flashContext.setMessage({
            text: result?.message ?? "Something went wrong",
            type: "error",
          });
        }
      } else {
        flashContext.setMessage({
          text: "Please select a program and a start date",
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

  const resetAssignProgramForm = () => {
    setAssignProgramForm({
      program_id: undefined,
      start_date: new Date(),
    });
  };

  return (
    <GeneralModal
      open={open}
      title={"Select Program"}
      successCallback={handleAssignProgram}
      closeCallback={handleCloseModal}
      fullWidth={true}
      width="900px"
    >
      <>
        <Grid container style={{ padding: "24px" }}>
          <Grid
            item
            xs={6}
            style={{
              position: "relative",
              marginLeft: "0px !important",
            }}
          >
            <FormControl sx={{ mt: 1, width: "100%" }} variant="outlined">
              <OutlinedInput
                id="outlined-adornment-weight"
                placeholder="Search Programs"
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
                <TableCell
                  className="nowrap-header bold-font-face"
                  width={"40%"}
                >
                  <strong>Subtext</strong>
                </TableCell>
                <TableCell className="nowrap-header bold-font-face">
                  <strong>Published Date</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPrograms?.map((program) => (
                <TableRow key={program?.id}>
                  <TableCell
                    width={"1%"}
                    align="right"
                    sx={{ pr: 0, pl: "24px" }}
                  >
                    <Radio
                      checked={assignProgramForm.program_id == program.id}
                      value={program.id}
                      onChange={handleProgramChange}
                    />
                  </TableCell>
                  <TableCell sx={{ pl: "0" }}>{program.title}</TableCell>
                  <TableCell>{program.subtext}</TableCell>
                  <TableCell>
                    {dayjs(program.published_at).format("MM/DD/YYYY")}
                  </TableCell>
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
            <InputLabel>Assign a Program Start Date</InputLabel>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                inputVariant="outlined"
                onChange={handleDateChange}
                value={assignProgramForm.start_date}
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

export default AssignProgramModal;

import {
  TableRow,
  TableCell,
  Button,
  Table,
  TableHead,
  TableBody,
  Grid,
  Chip,
  Typography,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import * as React from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ActionRow from "./ActionRow";
import dayjs from "dayjs";
import {
  AuthenticationContext,
  FlashContext,
  ImagesContext,
} from "../../../../Context";
import { setSortOrder } from "../../../../shared/tables/TableHelper";
import { getHeaders } from "../../../../utils/HeaderHelper";
import { snakeCaseToTitleCase } from "../../../../utils/CaseFormatHelper";
import GeneralModal from "../../../../modals/GeneralModal";
import CustomChip from "../../../../shared/CustomChip";

export const getChipColor = (status) => {
  switch (status) {
    case "active":
      return "success";
    case "completed":
      return "error";
    default:
      return "warning";
  }
};

const ProgramRow = ({
  patientId,
  assignedProgram,
  onProgramComplete,
  expandedInitially = false,
}) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const flashContext = React.useContext(FlashContext);
  const [expanded, setExpanded] = useState(expandedInitially);
  const [actions, setActions] = useState(assignedProgram?.actions);
  const [notes, setNotes] = useState("");
  const [openCompleteProgramModal, setOpenCompleteProgramModal] =
    useState(false);

  React.useEffect(() => {
    setExpanded(expandedInitially);
  }, [expandedInitially]);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const handleCompleteProgram = async () => {
    try {
      const response = await fetch(
        `/patients/${patientId}/assigned_programs/${assignedProgram.id}/complete_program`,
        {
          method: "PUT",
          headers: getHeaders(authenticationSetting.csrfToken),
          body: JSON.stringify({
            notes: notes,
          }),
        }
      );
      const result = await response.json();
      setOpenCompleteProgramModal(false);
      flashContext.setMessage({
        text: result.message,
        type: result.success == false ? "error" : "success",
      });
      onProgramComplete();
    } catch (error) {
      console.error(error);
      flashContext.setMessage({
        text: "Something went wrong.",
        type: "error",
      });
    }
  };

  const images = React.useContext(ImagesContext);
  const [sortObject, setSortObject] = React.useState<any>({
    field: "category",
    direction: "ascending",
  });

  const getSortedAndSearchedList = () => {
    let filteredList = [...assignedProgram?.actions];
    filteredList.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field == "title") {
      filteredList.sort((a, b) =>
        a.title?.toLowerCase() > b.title?.toLowerCase() ? 1 : -1
      );
    } else if (sortObject.field == "category") {
      filteredList.sort((a, b) =>
        a.category?.toLowerCase() > b.category?.toLowerCase() ? 1 : -1
      );
    } else if (sortObject.field == "subject") {
      filteredList.sort((a, b) =>
        a.subject?.toLowerCase() > b.subject?.toLowerCase() ? 1 : -1
      );
    }

    if (sortObject.direction == "descending") {
      filteredList.reverse();
    }
    return filteredList;
  };

  React.useEffect(() => {
    if (assignedProgram?.actions) {
      const actionsList = getSortedAndSearchedList();
      setActions(actionsList);
    }
  }, [sortObject]);

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

  return (
    <>
      <Grid container>
        <Grid item xs={12} onClick={handleChange}>
          <Grid container>
            <Grid container direction="row" className="admin-header">
              <Grid
                item
                xs={12}
                className="box-header"
                px={5}
                py={3}
                mx={2}
                mt={2}
                borderRadius={"4px"}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  width={"100%"}
                  spacing={5}
                  alignItems={"center"}
                >
                  <Stack direction={"column"} spacing={1}>
                    <strong
                      className="bolder-text"
                      style={{
                        fontSize: "18px",
                        textTransform: "capitalize",
                        color: "#4A4442",
                        fontFamily: "QuicksandBold",
                        letterSpacing: "1px",
                      }}
                    >
                      {assignedProgram?.program.title} &nbsp;&nbsp;
                      <CustomChip
                        label={snakeCaseToTitleCase(assignedProgram?.status)}
                        type={getChipColor(assignedProgram?.status)}
                        sx={{ px: 2 }}
                      />
                    </strong>
                    <div className="subdued-text">
                      {assignedProgram?.program.subtext}{" "}
                      <span style={{ margin: "7px" }}>•</span>
                      {`${
                        assignedProgram?.status === "active"
                          ? "Start Date: "
                          : "Program Timeline: "
                      } ${dayjs(assignedProgram.start_date).format(
                        "MM/DD/YYYY"
                      )}`}
                    </div>
                  </Stack>
                  <Stack direction={"row"} spacing={3} alignItems={"center"}>
                    {assignedProgram?.status === "active" && (
                      <Button
                        className="confirm-btn"
                        sx={{ minWidth: "170px", height: "40px" }}
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenCompleteProgramModal(true);
                        }}
                      >
                        Complete Program
                      </Button>
                    )}
                    {expanded ? (
                      <ArrowDropUpIcon sx={{ fontSize: "2em" }} />
                    ) : (
                      <ArrowDropDownIcon sx={{ fontSize: "2em" }} />
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {expanded && (
          <Grid
            item
            xs={12}
            bgcolor={"white"}
            boxShadow={"0 2px 8px rgba(0, 0, 0, 0.4)"}
            pl={2}
            py={1}
            mx={2}
            mb={1}
          >
            <Table className="no-border-table">
              <TableHead>
                <TableRow>
                  <TableCell
                    className="bold-font-face nowrap-header"
                    style={{
                      paddingLeft: "24px",
                      width: "8%",
                      verticalAlign: "baseline",
                    }}
                    onClick={() => {
                      setSortOrder(
                        "category",
                        sortObject.direction == "ascending"
                          ? "descending"
                          : "ascending",
                        setSortObject
                      );
                    }}
                  >
                    Category
                    {getSortIcon("category")}
                  </TableCell>
                  <TableCell
                    className="bold-font-face nowrap-header"
                    style={{ width: "3%", verticalAlign: "baseline" }}
                  >
                    Icon
                  </TableCell>
                  <TableCell
                    className="bold-font-face nowrap-header"
                    style={{ verticalAlign: "baseline", width: "25%" }}
                    onClick={() => {
                      setSortOrder(
                        "title",
                        sortObject.direction == "ascending"
                          ? "descending"
                          : "ascending",
                        setSortObject
                      );
                    }}
                  >
                    Action Title
                    {getSortIcon("title")}
                  </TableCell>
                  <TableCell
                    className="bold-font-face nowrap-header"
                    style={{ verticalAlign: "baseline", width: "33%" }}
                  >
                    Subtext
                  </TableCell>
                  <TableCell
                    className="bold-font-face nowrap-header"
                    style={{ verticalAlign: "baseline", width: "12%" }}
                  >
                    Action Type
                  </TableCell>
                  <TableCell style={{ width: "150px" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actions?.map((action) => (
                  <ActionRow
                    patientId={patientId}
                    action={action}
                    actionSteps={assignedProgram?.action_steps}
                    key={action.id}
                  />
                ))}
              </TableBody>
            </Table>
          </Grid>
        )}
      </Grid>
      <GeneralModal
        title={"Complete Program?"}
        confirmButtonText="Complete Program"
        open={openCompleteProgramModal}
        successCallback={handleCompleteProgram}
        closeCallback={() => {
          setOpenCompleteProgramModal(false);
          setNotes("");
        }}
        width="500px"
      >
        <Stack gap={2} mt={2}>
          <Typography>
            You are about to end this program and all of their associated
            actions for this patient. Would you like to add any additional notes
            on the completion?
          </Typography>
          <TextField
            label="Additional Notes"
            placeholder="Enter Additional Notes"
            value={notes}
            className="textInput"
            required
            multiline
            maxRows={20}
            minRows={5}
            variant="filled"
            onChange={(event) => {
              setNotes(event.target.value);
            }}
            InputLabelProps={{
              required: false,
            }}
          />
        </Stack>
      </GeneralModal>
    </>
  );
};

export default ProgramRow;

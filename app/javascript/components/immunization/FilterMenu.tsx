import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Popover,
	Radio,
} from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import * as React from "react";
import CheckboxList from "../common/CheckboxList";

interface Props {
  imTypes: [];
  patientLists: [];
  anchorEl: any;
  setAnchorEl: Function;
  tagListLength: number;
  checkedItems: any;
  setCheckedItems: Function;
  checkedPatientList: any;
  setCheckedPatientList: Function;
}

const FilterMenu: React.FC<Props> = ({
  imTypes,
  patientLists,
  anchorEl,
  setAnchorEl,
  tagListLength,
  checkedItems,
  setCheckedItems,
  checkedPatientList,
  setCheckedPatientList,
}) => {
  const [imTypesExpanded, setImTypesExpanded] = React.useState(true);
  const [patientListExpanded, setPatientListExpanded] = React.useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const accordionHeight = "20px";

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <div className="popover-filter-container">
        <p className="header">Patient Filters</p>
        <p className="tag-number">{tagListLength} existing immunization tags</p>
        <Accordion
          expanded={imTypesExpanded}
          onChange={() => setImTypesExpanded(!imTypesExpanded)}
          sx={{
            boxShadow: "none",
            border: "none",
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={null}
            sx={{
              padding: 0,
              minHeight: accordionHeight,
              "&.MuiAccordionSummary-root": {
                minHeight: accordionHeight,
              },
              "&.MuiAccordionSummary-gutters": {
                padding: 0,
                minHeight: accordionHeight,
              },
              "&.Mui-expanded": {
                minHeight: accordionHeight,
              },
              "& .MuiAccordionSummary-content": {
                margin: 0,
                alignItems: "center",
                minHeight: accordionHeight,
              },
              "& .MuiAccordionSummary-contentGutters": {
                margin: 0,
                minHeight: accordionHeight,
              },
              "& .MuiAccordionSummary-content.Mui-expanded": {
                margin: 0,
                minHeight: accordionHeight,
                alignItems: "center",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                p: "0 20px 0 12px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transform: imTypesExpanded
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <ArrowDropDownIcon />
              </Box>
              <p className="collapse-list-header">Immunization Type</p>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: 0,
              backgroundColor: "#F8F8F8",
              p: "20px 20px 12px 16px",
            }}
          >
            <CheckboxList
              items={imTypes.map((type) => ({ id: type, label: type }))}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
              labelField="label"
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={patientListExpanded}
          onChange={() => setPatientListExpanded(!patientListExpanded)}
          sx={{
            boxShadow: "none",
            border: "none",
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={null}
            sx={{
              padding: 0,
              minHeight: accordionHeight,
              "&.MuiAccordionSummary-root": {
                minHeight: accordionHeight,
              },
              "&.MuiAccordionSummary-gutters": {
                padding: 0,
                minHeight: accordionHeight,
              },
              "&.Mui-expanded": {
                minHeight: accordionHeight,
              },
              "& .MuiAccordionSummary-content": {
                margin: 0,
                alignItems: "center",
                minHeight: accordionHeight,
              },
              "& .MuiAccordionSummary-contentGutters": {
                margin: 0,
                minHeight: accordionHeight,
              },
              "& .MuiAccordionSummary-content.Mui-expanded": {
                margin: 0,
                minHeight: accordionHeight,
                alignItems: "center",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                p: "0 20px 0 12px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transform: patientListExpanded
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <ArrowDropDownIcon />
              </Box>
              <p className="collapse-list-header">Patient List</p>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: 0,
              backgroundColor: "#F8F8F8",
              p: "20px 20px 12px 10px",
            }}
          >
            {patientLists.map((list, index) => {
              const handleSelection = (list) => {
                if (checkedPatientList === list) {
                  setCheckedPatientList("");
                } else {
                  setCheckedPatientList(list);
                }
              };

              return (
                <div className="multiple-checkbox" key={index}>
                  <div className="checkbox-row-containter no-margin-bottom">
                    <Radio
                      checked={checkedPatientList === list}
                      onClick={() => handleSelection(list)}
                      value={list}
                      name="radio-buttons"
                      inputProps={{ "aria-label": list }}
                      style={{
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                      sx={{
                        color: "#A29D9B",
                        "& .MuiSvgIcon-root": {
                          fontSize: "12px",
                        },
                      }}
                    />
                    <p
                      className="option-text"
                      onClick={() => handleSelection(list)}
                      style={{ cursor: "pointer" }}
                    >
                      {list}
                    </p>
                  </div>
                </div>
              );
            })}
          </AccordionDetails>
        </Accordion>
      </div>
    </Popover>
  );
};

export default FilterMenu;

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
  startDate?: any;
  endDate?: any;
  actionTypes: any;
  providerLists: any;
  categories: any;
  anchorEl: any;
  setAnchorEl: Function;
  checkedAction: any;
  setCheckedAction: Function;
  checkedProviders: any;
  setCheckedProviders: Function;
  checkedCategories: any;
  setCheckedCategories: Function;
}

const FilterMenu: React.FC<Props> = ({
  startDate,
  endDate,
  actionTypes,
  providerLists,
  categories,
  anchorEl,
  setAnchorEl,
  checkedAction,
  setCheckedAction,
  checkedProviders,
  setCheckedProviders,
  checkedCategories,
  setCheckedCategories,
}) => {
  const [actionTypeExpanded, setActionTypesExpanded] = React.useState(true);
  const [providersExpanded, setProvidersExpanded] = React.useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = React.useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const accordionHeight = "20px";
  const formatDate = (date) => {
    if (date && date.split('-').length == 3) {
      return `${date.split('-')[1]}/${date.split('-')[2]}`;  
    }
    return ''
  }
  const clearAllFilters = () => {
    setCheckedAction("All Actions");
    setCheckedProviders([]);
    setCheckedCategories([]);
  };

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
      <div className="popover-filter-container ">
        <div className="header-wrapper">
          <div className="header">Filters</div>
          {(checkedAction !== null ||
            checkedProviders.length > 0 ||
            checkedCategories.length > 0) && (
            <button onClick={clearAllFilters} className="clear-all">
              <svg
                width="9"
                height="9"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  y="7.99902"
                  width="8"
                  height="8"
                  rx="1"
                  transform="rotate(-90 0 7.99902)"
                  fill="#FF890A"
                />
                <path
                  d="M2.13699 1.66585L1.66699 2.13585L3.53033 3.99919L1.66699 5.86252L2.13699 6.33252L4.00033 4.46919L5.86366 6.33252L6.33366 5.86252L4.47033 3.99919L6.33366 2.13585L5.86366 1.66585L4.00033 3.52919L2.13699 1.66585Z"
                  fill="white"
                />
              </svg>
              <span>Clear All</span>
            </button>
          )}
        </div>
        <p className="tag-number">{formatDate(startDate)} - {formatDate(endDate)}</p>
        <Accordion
          expanded={actionTypeExpanded}
          onChange={() => setActionTypesExpanded(!actionTypeExpanded)}
          sx={{
            boxShadow: "none",
            border: "none",
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionDetails
            sx={{
              padding: 0,
              backgroundColor: "#F8F8F8",
              p: "10px 20px 12px 10px",
            }}
          >
            {actionTypes.map((list, index) => {
              const handleSelection = (list) => {
                if (checkedAction === list.title) {
                  setCheckedAction("All Actions");
                } else {
                  setCheckedAction(list.title);
                }
              };

              return (
                <div className="multiple-checkbox" key={index}>
                  <div className="checkbox-row-containter no-margin-bottom">
                    <Radio
                      checked={checkedAction === list.title}
                      onClick={() => handleSelection(list)}
                      value={list.title}
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
                    <div
                      className="option-text"
                      onClick={() => handleSelection(list)}
                      style={{ cursor: "pointer" }}
                    >
                      {list.title}
                      <span className="tool-badge">{list.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </AccordionDetails>
        </Accordion>
        {checkedAction === "My Actions" ||
        checkedAction === "Unassigned Actions" ? (
          <></>
        ) : (
          <Accordion
            expanded={providersExpanded}
            onChange={() => setProvidersExpanded(!providersExpanded)}
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
                  marginBottom: "10px",
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
                    transform: providersExpanded
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s ease-in-out",
                  }}
                >
                  <ArrowDropDownIcon />
                </Box>
                <p className="collapse-list-header">Providers</p>
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
                items={providerLists.map((type) => ({
                  id: type.title,
                  label: (
                    <div>
                      {type.title}
                      <span className="tool-badge">{type.count}</span>
                    </div>
                  ),
                }))}
                checkedItems={checkedProviders}
                setCheckedItems={setCheckedProviders}
                labelField="label"
              />
            </AccordionDetails>
          </Accordion>
        )}
        <Accordion
          expanded={categoriesExpanded}
          onChange={() => setCategoriesExpanded(!categoriesExpanded)}
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
                marginBottom: "10px",
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
                  transform: categoriesExpanded
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <ArrowDropDownIcon />
              </Box>
              <p className="collapse-list-header">Advanced Categories</p>
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
              items={categories.map((type) => ({
                id: type.title,
                label: (
                  <div>
                    {type.title}
                    <span className="tool-badge">{type.count}</span>
                  </div>
                ),
              }))}
              checkedItems={checkedCategories}
              setCheckedItems={setCheckedCategories}
              labelField="label"
            />
          </AccordionDetails>
        </Accordion>
      </div>
    </Popover>
  );
};

export default FilterMenu;

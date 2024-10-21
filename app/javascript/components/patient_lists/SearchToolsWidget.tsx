/* eslint-disable prettier/prettier */
import * as React from "react";
import {
	Grid,
	TextField,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
} from "@mui/material";
import { getYodaDateToday } from "../utils/DateHelper";
import { getHeaders } from "../utils/HeaderHelper";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckboxList from "../common/CheckboxList";

interface Props {
  csrfToken: string;
  setSearchPatients: any;
  user_id: string;
  patientListId: string;
  setCheckedList: any;
  setOnList: any;
  setPendingAdd: any;
  setPendingRemoval: any;
  checkedList: Function;
  setParamsPresent: Function;
	setLoading: Function;
}

const SearchToolsWidget: React.FC<Props> = (props: any) => {
  const [programsExpanded, setProgramsExpanded] = React.useState(false);
  const [diagnosisCodesExpanded, setDiagnosisCodesExpanded] =
    React.useState(false);
  const [insuranceTypesExpanded, setInsuranceTypesExpanded] =
    React.useState(false);
  const [ltcFacilitiesExpanded, setLtcFacilitiesExpanded] =
    React.useState(false);
  const [cgmExpanded, setCGMExpanded] = React.useState(false);

  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [dateOfBirth, setDateOfBirth] = React.useState<string>("");

  const [checkedPrograms, setCheckedPrograms] = React.useState<string[]>([]);
  const [checkedDiagnosisCodes, setCheckedDiagnosisCodes] = React.useState<
    string[]
  >([]);
  const [checkedInsuranceTypes, setCheckedInsuranceTypes] = React.useState<
    string[]
  >([]);
  const [checkedLtcFacilities, setCheckedLtcFacilities] = React.useState<
    string[]
  >([]);

  // Add state for CGM checkbox (true/false)
  const [checkedCGM, setCheckedCGM] = React.useState<boolean>(false);

  const [programs, setPrograms] = React.useState<[]>([]);
  const [diagnosisCodes, setDiagnosisCodes] = React.useState<[]>([]);
  const [insuranceTypes, setInsuranceTypes] = React.useState<[]>([]);
  const [ltcFacilities, setLtcFacilities] = React.useState<[]>([]);

  const tagListLength = 51;
  const accordionHeight = "20px";

  const accordions = [
    {
      label: "Programs",
      expanded: programsExpanded,
      setExpanded: setProgramsExpanded,
      tag: programs.length,
      items: programs,
      checkedItems: checkedPrograms,
      setCheckedItems: setCheckedPrograms,
      labelField: "title",
    },
    {
      label: "Diagnosis Codes",
      expanded: diagnosisCodesExpanded,
      setExpanded: setDiagnosisCodesExpanded,
      tag: diagnosisCodes.length,
      items: diagnosisCodes,
      checkedItems: checkedDiagnosisCodes,
      setCheckedItems: setCheckedDiagnosisCodes,
      labelField: "diagnosis_code_value",
    },
    {
      label: "Insurance Types",
      expanded: insuranceTypesExpanded,
      setExpanded: setInsuranceTypesExpanded,
      tag: insuranceTypes.length,
      items: insuranceTypes,
      checkedItems: checkedInsuranceTypes,
      setCheckedItems: setCheckedInsuranceTypes,
      labelField: "insurance_type",
    },
    {
      label: "LTC Facilities",
      expanded: ltcFacilitiesExpanded,
      setExpanded: setLtcFacilitiesExpanded,
      tag: ltcFacilities.length,
      items: ltcFacilities,
      checkedItems: checkedLtcFacilities,
      setCheckedItems: setCheckedLtcFacilities,
      labelField: "name",
    },
    {
      label: "CGM",
      expanded: cgmExpanded,
      setExpanded: setCGMExpanded,
      tag: 0,
    },
  ];
  const hasMounted = React.useRef(false);

  // Fetch filters
  React.useEffect(() => {
    initialFetch(true);
  }, []);

  const initialFetch = (firstCall=false) => {
    var params = '';
    if (props.patientListId){
      params = `patient_list=${props.patientListId}`;
    }
    else {
      params = `filters_only=true`;
    }
		props.setLoading(true);

    fetch(`/data_fetching/patient_index?${params}`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((data) => {
				props.setLoading(false);
        setPrograms(data.programs);
        setDiagnosisCodes(data.diagnosis_codes);
        setInsuranceTypes(data.insurance_types);
        setLtcFacilities(data.ltc_facilities);
        if (data.patients.length > 0){
          if (firstCall) {
            props.setSearchPatients(data.patients);
            console.log("firstCall")
            props.setCheckedList(data.patients.filter((p) => p.on_list));
            props.setOnList(data.patients.filter((p) => p.on_list));
          } else if (props.patientListId) {
            // Update list_status when in edit mode
            console.log("if props.patientListId")
            props.setSearchPatients(
              data.patients.map((patient) => {
                const isChecked = props.checkedList.some((checked) => checked.id === patient.id);
                if(!isChecked){
                  console.log("not isChecked")
                }
                if (patient.list_status == "Not on List" && isChecked) {
                  return { ...patient, list_status: "Pending Add" };
                } else if (patient.list_status == "On List" && !isChecked) {
                  console.log("changing to Pending Removal")
                  return { ...patient, list_status: "Pending Removal" };
                } else {
                  return patient; // No changes
                }
              })
            );
          } 
          // else {
          //   props.setSearchPatients(data.patients);
          // }
        }
      })
      .catch((error) => {
				props.setLoading(false);
        console.log(error);
      });
  }

  const shouldFetchPatients = () => {
    return (
      (firstName && firstName.length >= 2) ||
      (lastName && lastName.length >= 2) ||
      dateOfBirth ||
      checkedPrograms.length > 0 ||
      checkedDiagnosisCodes.length > 0 ||
      checkedInsuranceTypes.length > 0 ||
      checkedLtcFacilities.length > 0 ||
      checkedCGM
    );
  };

  const clearAllFilters = () => {
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setCheckedPrograms([]);
    setCheckedDiagnosisCodes([]);
    setCheckedInsuranceTypes([]);
    setCheckedLtcFacilities([]);
    setCheckedCGM(false);
  };

  const getPatients = () => {
    const params = new URLSearchParams();

    if (firstName && firstName.length > 1)
      params.append("first_name", firstName);
    if (lastName && lastName.length > 1) params.append("last_name", lastName);
    if (dateOfBirth) params.append("date_of_birth", dateOfBirth);

    if (checkedPrograms.length > 0) {
      checkedPrograms.forEach((programId) =>
        params.append("programs[]", programId)
      );
    }

    if (checkedDiagnosisCodes.length > 0) {
      checkedDiagnosisCodes.forEach((codeId) =>
        params.append("diagnosis_codes[]", codeId)
      );
    }

    if (checkedInsuranceTypes.length > 0) {
      checkedInsuranceTypes.forEach((insuranceId) =>
        params.append("insurance_types[]", insuranceId)
      );
    }

    if (checkedLtcFacilities.length > 0) {
      checkedLtcFacilities.forEach((facilityId) =>
        params.append("ltc_facilities[]", facilityId)
      );
    }

    // Add CGM to the query parameters
    params.append("is_cgm", checkedCGM.toString());
    
    if (!params.toString()) {
      return // stop if params is empty
    }

    if (props.patientListId) { //edit mode
      params.append("ref_patient_list", props.patientListId);
    }
		props.setLoading(true);

    fetch(`/data_fetching/patient_index?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(props.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
				props.setLoading(false);

        if (result.error) {
          console.log("Error fetching patients:", result.error);
        } else {
          console.log("Setting patient 2")
          props.setSearchPatients(result.patients || null);
        }
      })
      .catch((error) => {
				props.setLoading(false);

        console.log("Fetch error:", error);
      });
  };

  React.useEffect(() => {
    if (shouldFetchPatients()) {
      getPatients();
    } else if (hasMounted.current) {
      console.log("Setting patient 3")
      initialFetch(false);
    }
    props.setParamsPresent(shouldFetchPatients());
    hasMounted.current = true;
  }, [
    firstName,
    lastName,
    dateOfBirth,
    checkedPrograms,
    checkedDiagnosisCodes,
    checkedInsuranceTypes,
    checkedLtcFacilities,
    checkedCGM,
  ]);

  return (
    <>
      <Grid item xs={12}>
        <Grid container>
          <Grid
            container
            justifyContent="space-between"
            className="widget-container"
          >
            <Grid item xs={12} className="widget-header">
              <h3>Search Tools</h3>
            </Grid>
          </Grid>
          <div className="divider"></div>
          <Grid container>
            <Grid item xs={12} className="widget-body">
              <div className="filter-container">
                <div className="filter-header">
                  <div className="header-wrapper">
                    <div className="header">Patient Filters</div>
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
                  </div>
                  <div className="tag-number">
                    {tagListLength} existing patient tags
                  </div>
                </div>

                <div className="filter-body">
                  <Grid item xs={12} className="field-container">
                    <TextField
                      id="first_name"
                      className="textInput plainLabel"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      variant="filled"
                      size="small"
                      label="First Name"
                      InputProps={{ disableUnderline: true }}
                    />
                  </Grid>
                  <Grid item xs={12} className="field-container">
                    <TextField
                      id="last_name"
                      className="textInput plainLabel"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      variant="filled"
                      size="small"
                      label="Last Name"
                      InputProps={{ disableUnderline: true }}
                    />
                  </Grid>
                  <Grid item xs={12} className="field-container">
                    <TextField
                      id="date"
                      label="Date of birth"
                      value={dateOfBirth}
                      className="textInput plainLabel"
                      type="date"
                      variant="filled"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ disableUnderline: true }}
                      inputProps={{ max: `${getYodaDateToday()}` }}
                      onChange={(event) => setDateOfBirth(event.target.value)}
                    />
                  </Grid>
                </div>
                <div className="tool-list">
                  {accordions.map(
                    (
                      {
                        label,
                        expanded,
                        setExpanded,
                        tag,
                        items,
                        checkedItems,
                        setCheckedItems,
                        labelField,
                      },
                      index
                    ) => (
                      <Accordion
                        key={index}
                        expanded={expanded}
                        onChange={() => setExpanded(!expanded)}
                        sx={{
                          boxShadow: "none",
                          border: "none",
                          "&:before": { display: "none" },
                          "&. Mui-expanded": { margin: 0 },
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
                            "&.Mui-expanded": { minHeight: accordionHeight },
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
                                transform: expanded
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "transform 0.2s ease-in-out",
                              }}
                            >
                              <ArrowDropDownIcon />
                            </Box>
                            <p className="collapse-list-header">{label}</p>
                            {label !== "CGM" ? (
                              <div className="tool-badge">{tag}</div>
                            ) : (
                              <div></div>
                            )}
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{
                            padding: 0,
                            backgroundColor: "#F8F8F8",
                            p: "20px 20px 12px 16px",
                          }}
                        >
                          {label === "CGM" ? (
                            <div className="multiple-checkbox">
                              <div className="checkbox-row-container">
                                <label className="option-text">
                                  <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      setCheckedCGM(e.target.checked)
                                    }
                                    checked={checkedCGM}
                                    className="checkbox"
                                  />
                                  CGM Enable
                                </label>
                              </div>
                            </div>
                          ) : (
                            <CheckboxList
                              items={items}
                              checkedItems={checkedItems}
                              setCheckedItems={setCheckedItems}
                              labelField={labelField}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                    )
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SearchToolsWidget;
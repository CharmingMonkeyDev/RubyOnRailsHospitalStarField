import * as React from "react";
import { Grid, Link, Stack } from "@mui/material";
import { AuthenticationContext, FlashContext, ImagesContext } from "../../../../../Context";
import { getHeaders } from "../../../../../utils/HeaderHelper";
import { checkPrivileges } from "../../../../../utils/PrivilegesHelper";
import { PrivilegesContext } from "../../../../../PrivilegesContext";
import UnsavedChangesModal from "../../../../../modals/UnsavedChangesModal";
import InsuranceDetails from "./InsuranceDetails";
import InsuranceEdit from "./InsuranceEdit";
import InsuranceOverviewHeader from "./InsuranceOverviewHeader";

interface Props {
  patient: any;
  showChat: boolean;
  setShowChat: Function;
}

const InsuranceInfo: React.FC<Props> = (props) => {
  const images = React.useContext(ImagesContext);
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);
  const userPrivileges = React.useContext<any>(PrivilegesContext);
  const [showEditForm, setShowEditForm] = React.useState<boolean>(false);
  const [unsavedChanges, setUnsavedChanges] = React.useState<boolean>(false);
  const [patientInsurance, setPatientInsurance] = React.useState<any>(null);
  const [secondaryPatientInsurance, setSecondaryPatientInsurance] =
    React.useState<any>(null);
  const [insuranceTypeOptions, setInsuranceTypeOptions] = React.useState<any>(
    []
  );
  const [isAddingMode, setIsAddingMode] = React.useState<boolean>(false);
  const [primaryFormvalues, setPrimaryFormvalues] = React.useState<any>(null);
  const [secondaryFormValues, setSecondaryFormValues] = React.useState<any>(null);
  const flashContext = React.useContext(FlashContext);

  React.useEffect(() => {
    if (props.patient?.id && !showEditForm) {
      getPatientInsurance();
    }
  }, [props.patient?.id, showEditForm]);

  const getPatientInsurance = () => {
    fetch(`/data_fetching/patient_insurances/${props.patient?.id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (!result.success) {
          console.log(result.message);
        } else {
          setPatientInsurance(result.resource?.patient_insurance);
          setInsuranceTypeOptions(result.resource?.insurance_types);
          setSecondaryPatientInsurance(
            result.resource?.secondary_patient_insurance
          );
          setSecondaryFormValues(null)
          // console.log("result", result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleShowForm = () => {
    event.preventDefault();
    setShowEditForm(true);
  };

  const handleAddAction = () => {
    setIsAddingMode(true);
    handleShowForm();
  };

  const handleUpdate = () => {
    if (!validForm(primaryFormvalues)) 
    {
      return // validation errors 
    }
    if (!(secondaryFormValues ? validForm(secondaryFormValues) : true)){
      return // validation errors 
    }

    if (primaryFormvalues) {
      updateInsurance(primaryFormvalues, patientInsurance)
    }
    if (secondaryFormValues) {
      updateInsurance(secondaryFormValues, secondaryPatientInsurance)
    }
  };

  const updateInsurance = (formValues, insurance) => {
      fetch(`/patient_insurances`, {
        method: "POST",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          patient_id: props.patient?.id,
          patient_insurance_id: insurance?.id,
          patient_insurance: {
            ...formValues
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (!result.success) {
            console.log(result.message);
          } else {
            flashContext.setMessage({ text: result.message, type: "success" });
            setIsAddingMode(false);
            setShowEditForm(false);
          }
        })
        .catch((error) => {
          flashContext.setMessage({ text: error, type: "error" });
          console.log(error);
        });
  }

  const validForm = (formValues) => {
    let errorFields = [];
    if (formValues.insurance_type?.length < 1) {
      errorFields.push("Insurance Type");
    }
    if (formValues.insured_id?.length < 1) {
      errorFields.push("Insured's ID #");
    }
    if (formValues.plan_name?.length < 1) {
      errorFields.push("Plan Name or Program");
    }
    if (formValues.relationship?.length < 1) {
      errorFields.push("Relationship");
    }
    if (formValues.last_name?.length < 1) {
      errorFields.push("Insured's Last Name");
    }
  
    if (formValues.first_name?.length < 1) {
      errorFields.push("Insured's First Name");
    }
    if (formValues.address?.length < 1) {
      errorFields.push("Address");
    }
    if (formValues.city?.length < 1) {
      errorFields.push("City");
    }
    if (formValues.state?.length < 1) {
      errorFields.push("State");
    }
    if (formValues.county?.length < 1) {
      errorFields.push("County");
    }
  
    if (formValues.zip?.length < 1) {
      errorFields.push("Zip");
    }
    if (formValues.phone_number?.length < 1) {
      errorFields.push("Phone Number");
    }
  
    if (errorFields.length > 0) {
      let message = `${errorFields.join(", ")} required on ${formValues.is_secondary ? 'secondary' : 'primary'} insurance.`;
      flashContext.setMessage({ text: message, type: "error" });
      return false;
    } else {
      return true;
    }
  };

  const handleDeletion = (isSecondaryInsurance) => {
    if (secondaryPatientInsurance) {
      fetch(`/patient_insurances/${secondaryPatientInsurance?.id}`, {
        method: "DELETE",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          patient_id: props.patient?.id,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (!result.success) {
            flashContext.setMessage({ text: result.message, type: "error" });
          } else {
            getPatientInsurance();
            flashContext.setMessage({ text: result.message, type: "success" });
          }
        })
        .catch((error) => {
          flashContext.setMessage({ text: error, type: "error" });
          console.log(error);
        });
    }
  };

  const renderAddButton = () => {
    let buttonTitle = "";
    if (!showEditForm) {
      if (patientInsurance && secondaryPatientInsurance) {
        return <></>;
      } else if (!patientInsurance) {
        buttonTitle = "Add Insurance Information";
      } else if (!secondaryPatientInsurance) {
        buttonTitle = "Add Secondary Insurance Information";
      }

      return (
        <Link className="action-link row" onClick={handleAddAction}>
          <img
            src={images.add_icon}
            alt="Add Insurance"
            className="action-icon-image"
            style={{ width: 31.466, maxHeight: 32 }}
          />
          <span className="app-user-text disable-pointer">{buttonTitle}</span>
        </Link>
      );
    }
    return <></>;
  };

  const renderEditButton = () => {
    if (checkPrivileges(userPrivileges, "Edit Patient")) {
      if (showEditForm) {
        return (
          <Link className="save-btn" onClick={handleUpdate}>
            Save
          </Link>
        );
      } else {
        return (
          <Link
            className="action-link add-encounter"
            onClick={() => handleShowForm()}
            sx={{ ml: 3, mr: 3 }}
          >
            <img
              src={images.pencil_grey}
              alt="Edit Patient"
              className="action-icon-image"
              style={{ width: 31.466, maxHeight: 32, marginLeft: 32 }}
            />
          </Link>
        );
      }
    }

    return <></>;
  };

  const renderDetails = (insurance, isSecondaryInsurance) => {
    if (!patientInsurance) {
      return (
        <p className="no-result-text">
          This patient does not have insurance information setup yet. You can
          set it up{" "}
          <span className="underline_text" onClick={handleShowForm}>
            here!
          </span>
        </p>
      );
    }

    return (
      <>
        <InsuranceOverviewHeader 
          patient={props.patient} 
          patientInsurance={insurance} 
          secondaryPatientInsurance={secondaryPatientInsurance} 
          isSecondaryInsurance={isSecondaryInsurance} 
          isAddingMode={isAddingMode} 
          showEditForm={showEditForm} 
          handleDeletion={handleDeletion} 
          showChat={props.showChat} 
          setShowChat={props.setShowChat} 
          />
        <InsuranceDetails patient_insurance={insurance} />
      </>
    );
  };

  const renderInsuranceEdit = (
    patientInsurance: any,
    isSecondaryInsurance: boolean
  ) => {
    const containerClassName = !isSecondaryInsurance
      ? "general-patient-info-container"
      : "general-patient-info-container padding-top-0";
    return (
      <>
        <Grid container className={containerClassName}>
          <Grid item xs={12} className="info-container">
            {patientInsurance &&
              <InsuranceOverviewHeader 
                patient={props.patient} 
                patientInsurance={patientInsurance} 
                secondaryPatientInsurance={secondaryPatientInsurance} 
                isSecondaryInsurance={isSecondaryInsurance} 
                isAddingMode={isAddingMode} 
                showEditForm={showEditForm} 
                handleDeletion={handleDeletion} 
                showChat={props.showChat} 
                setShowChat={props.setShowChat} 
              />
            }
            <InsuranceEdit
              csrfToken={authenticationSetting.csrfToken}
              patient={props.patient}
              patientInsurance={patientInsurance}
              insuranceTypeOptions={insuranceTypeOptions}
              unsavedChanges={unsavedChanges}
              setUnsavedChanges={setUnsavedChanges}
              onUpdate={() => {
                setIsAddingMode(false);
                setShowEditForm(false);
                setUnsavedChanges(false);
              }}
              isSecondaryInsurance={isSecondaryInsurance}
              setPrimaryFormvalues={setPrimaryFormvalues}
              setSecondaryFormValues={setSecondaryFormValues}
              onDelete={() => getPatientInsurance()}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  const renderContent = () => {
    if (showEditForm) {
      return (
        <>
          {renderInsuranceEdit(patientInsurance, false)}
          {((isAddingMode && patientInsurance && !secondaryPatientInsurance) ||
            secondaryPatientInsurance) &&
            renderInsuranceEdit(secondaryPatientInsurance, true)}
        </>
      );
    }
    return (
      <>
        <Grid container className="general-patient-info-container">
          <Grid item xs={12} className="info-container">
            {renderDetails(patientInsurance, false)}
          </Grid>
        </Grid>
        {secondaryPatientInsurance && (
          <Grid
            container
            className="general-patient-info-container padding-top-0"
          >
            <Grid item xs={12} className="info-container">
              {renderDetails(secondaryPatientInsurance, true)}
            </Grid>
          </Grid>
        )}
      </>
    );
  };

  return (
    <Grid container className="panel-container" borderRadius={"4px"}>
      <Grid item xs={12}>
        <Grid container className="panel-show-container">
          <Grid container className="panel-information-container">
            <Grid container direction="row" className="admin-header">
              <Grid item xs={12} className="box-header">
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  paddingX={3}
                  paddingY={1}
                  alignItems={"center"}
                  display={"flex"}
                >
                  <Grid item>
                    <p className="panel-header">Insurance Information</p>
                  </Grid>
                  <div className="row">
                    {renderAddButton()}
                    {renderEditButton()}
                  </div>
                </Stack>
              </Grid>
            </Grid>
            {renderContent()}
          </Grid>
        </Grid>
      </Grid>
      <UnsavedChangesModal unsavedChanges={unsavedChanges} />
    </Grid>
  );
};

export default InsuranceInfo;
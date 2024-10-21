import * as React from "react";
import { Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import { useChat } from "../../../hooks/useChat";
import PatientInfo from "./general_info/patient_info/PatientInfo";
import InsuranceInfo from "./general_info/insurance_info/InsuranceInfo";
import { getHeaders } from "../../../utils/HeaderHelper";
import { AuthenticationContext } from "../../../Context";
import CustomerAssociationHistory from "./general_info/CustomerAssociationHistory";
import LtcFacilityInfo from "./general_info/ltc_facility_info/LtcFacilityInfo";
import DiagnosisInfo from "./general_info/diagnosis_tag_manager/DiagnosisInfo";

interface Props {}

const GeneralInfo: React.FC<Props> = (props: any) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [showChat, setShowChat] = React.useState<boolean>(false);
  const [showPatientEditForm, setShowPatientEditForm] =
    React.useState<boolean>(false);
  const [patient, setPatient] = React.useState<any>(null);
  const { id: patientId } = useParams();

  useChat({ showChat, setShowChat });

  React.useEffect(() => {
    if (!showPatientEditForm) {
      getUserInfo();
    }
  }, [props.patientId, showPatientEditForm]);

  const getUserInfo = () => {
    fetch(`/data_fetching/edit_my_info/${patientId}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          setPatient(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Stack gap={0}>
      <PatientInfo
        patient={patient}
        showChat={showChat}
        setShowChat={setShowChat}
        showPatientEditForm={showPatientEditForm}
        setShowPatientEditForm={setShowPatientEditForm}
      />
      <InsuranceInfo
        patient={patient}
        showChat={showChat}
        setShowChat={setShowChat}
      />
      <CustomerAssociationHistory patient={patient} />
      <LtcFacilityInfo patient={patient} />
      <DiagnosisInfo patient={patient} />
    </Stack>
  );
};

export default GeneralInfo;

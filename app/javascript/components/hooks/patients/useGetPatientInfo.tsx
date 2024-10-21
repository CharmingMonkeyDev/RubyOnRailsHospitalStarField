import { useEffect, useState } from "react";
import { getHeaders } from "../../utils/HeaderHelper";

export const useGetPatientInfo = (patientId: string, csrfToken: string) => {
  const [patient, setPatient] = useState<any>(null);

  const getPatientInfo = () => {
    fetch(`/reports/reports_patient_information/${patientId}`, {
      method: "GET",
      headers: getHeaders(csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setPatient(result?.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPatientInfo();
  }, [patientId]);

  return patient;
};

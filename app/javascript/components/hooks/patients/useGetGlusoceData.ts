import { useEffect, useState } from "react";
import { getHeaders } from "../../utils/HeaderHelper";

export const useGetGlucoseData = (
  patientId: string,
  selectedDateRange: any,
  csrfToken: string
) => {
  const [glucoseExposure, setGlucoseExposure] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [glucoseVariability, setGlucoseVariability] = useState<any>(null);
  const [dateLabel, setDateLabel] = useState<string>("");
  const [dateLabelDaily, setDateLabelDaily] = useState<string>("");
  const [dateLabelBiWeekly, setDateLabelBiWeekly] = useState<string>("");

  const getDailyGlucose = () => {
    fetch(
      `/reports/cgm_reports_glucose_exposure/${patientId}?start_date=${selectedDateRange?.start_date}&end_date=${selectedDateRange?.end_date}`,
      {
        method: "GET",
        headers: getHeaders(csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setGlucoseExposure(result?.resource);
          setDateLabel(result?.resource?.date_label);
          setDateLabelDaily(result?.resource?.date_label_daily);
          setDateLabelBiWeekly(result?.resource?.date_label_biweekly);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDailyGlucoseRanges = () => {
    fetch(
      `/reports/cgm_reports_glucose_ranges/${patientId}?start_date=${selectedDateRange?.start_date}&end_date=${selectedDateRange?.end_date}`,
      {
        method: "GET",
        headers: getHeaders(csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          console.log(result?.resource);
          setGraphData(result?.resource?.graph_data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getGlucoseVariability = () => {
    fetch(
      `/reports/cgm_reports_glucose_variability/${patientId}?start_date=${selectedDateRange?.start_date}&end_date=${selectedDateRange?.end_date}`,
      {
        method: "GET",
        headers: getHeaders(csrfToken),
      }
    )
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          console.log(result);
          setGlucoseVariability(result?.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDailyGlucose();
    getDailyGlucoseRanges();
    getGlucoseVariability();
  }, [
    patientId,
    selectedDateRange?.start_date,
    selectedDateRange?.end_date,
    csrfToken,
  ]);

  return {
    glucoseExposure,
    graphData,
    glucoseVariability,
    dateLabel,
    dateLabelDaily,
    dateLabelBiWeekly,
  };
};

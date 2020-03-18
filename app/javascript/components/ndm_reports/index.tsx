import * as React from "react";

// settings
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";
import ImportSection from "./ImportSection";
import PreviouslyUploadedReports from "./PreviouslyUploadedReports";

interface Props {}

const NdmReports: React.FC<Props> = (props: any) => {
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [ndmReports, setNdmReports] = React.useState<any>([]);

  React.useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    fetch(`/ndm-reports`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        setNdmReports(result.resource.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="main-content-outer">
      <ImportSection onImport={fetchReports} />
      <PreviouslyUploadedReports
        ndm_reports={ndmReports}
        onArchive={fetchReports}
      />
    </div>
  );
};

export default NdmReports;

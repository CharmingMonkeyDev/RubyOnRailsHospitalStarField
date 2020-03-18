import * as React from "react";
import { Grid, Link } from "@mui/material";

// settings
import { AuthenticationContext } from "../Context";
import { getHeaders } from "../utils/HeaderHelper";
import { checkPrivileges } from "../utils/PrivilegesHelper";
import { PrivilegesContext } from "../PrivilegesContext";

interface Props {}

const AdminFunctions: React.FC<Props> = (props: any) => {
  //  auth context
  const authenticationSetting = React.useContext(AuthenticationContext);
  const userPrivileges = React.useContext(PrivilegesContext);

  const [featureFlags, setFeatureFlags] = React.useState<any>("");

  React.useEffect(() => {
    getFeatureFlags();
  }, []);

  const getFeatureFlags = () => {
    fetch(`/feature_flags`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setFeatureFlags(result?.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="adminFunctions">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="container"
      >
        <Grid
          container
          item
          xs={12}
          sm={6}
          lg={4}
          xl={3}
          className="userAdminInformation"
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={12}>
            <h3 style={{ textAlign: "center", marginBottom: 30 }}>Settings</h3>
            {featureFlags?.FEATURE_ACTION_BUILDER_ON == "true" && (
              <Link href="/action-builder-list" className="menuLink">
                Action Builder
              </Link>
            )}
            {featureFlags?.FEATURE_ACTION_SETTINGS_ON == "true" && (
              <Link href="/action-settings" className="menuLink">
                Action Queue Settings
              </Link>
            )}
            {featureFlags?.FEATURE_PROGRAM_BUILDER_ON == "true" && (
              <Link href="/program-builder" className="menuLink">
                Program Builder
              </Link>
            )}
            {featureFlags?.FEATURE_BULK_UPLOAD_ON == "true" && (
              <Link href="/patient-upload" className="menuLink">
                Bulk Data Upload
              </Link>
            )}
            <Link href="/new-note-template" className="menuLink">
              Encounter Template Builder
            </Link>
            {checkPrivileges(userPrivileges, "Access NDM Reporting") && (
              <Link href="/ndm-report" className="menuLink">
                NDM Reporting
              </Link>
            )}
            {checkPrivileges(userPrivileges, "Build Questionnaire") && (
              <Link href="/questionnaires-list" className="menuLink">
                Questionnaire Builder
              </Link>
            )}
            {checkPrivileges(userPrivileges, "Access Reporting") && (
              <Link href="/reports" className="menuLink">
                Reports
              </Link>
            )}
            {checkPrivileges(userPrivileges, "Access Living Facility Builder") && (
              <Link href="/facilities" className="menuLink">
                Living Facility Builder
              </Link>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminFunctions;
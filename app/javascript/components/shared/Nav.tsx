// library imports
import * as React from "react";
import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useNavStyles } from "../styles/useNavStyles";

// setting imports
import { PrivilegesContext } from "../PrivilegesContext";
import { checkPrivileges } from "../utils/PrivilegesHelper";

// app setting imports
import { AuthenticationContext, NewPatientModalContext } from "../Context";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  role: string;
}

const Nav: React.FC<Props> = (props: any) => {
  // app contexts
  const modalSetting = React.useContext(NewPatientModalContext);
  const authenticationSetting = React.useContext(AuthenticationContext);
  const userPrivileges = React.useContext(PrivilegesContext);

  // states for settings
  const { classes } = useNavStyles();
  const [selected, setSelected] = React.useState<any>("");
  const [assets, setAssets] = React.useState<any>({});

  React.useEffect(() => {
    if (window.location.pathname == "/" || window.location.pathname == "") {
      setSelected("actionQueue");
    } else if (window.location.pathname == "/patients") {
      setSelected("patientList");
    } else if (window.location.pathname == "/patient-lists") {
      setSelected("patientLists");
    } else if (window.location.pathname.includes("/new-patient-list")) {
      setSelected("patientLists");
    } else if (window.location.pathname == "/user-administration") {
      setSelected("providerList");
    } else if (window.location.pathname == "/resource-catalog") {
      setSelected("resource");
    } else if (window.location.pathname == "/customer-list") {
      setSelected("customerList");
    } else if (window.location.pathname == "/admin-functions") {
      setSelected("adminFunctions");
    } else if (window.location.pathname == "/preferences") {
      setSelected("preferences");
    } else if (window.location.pathname == "/immunization-list") {
      setSelected("immunizations");
    }

    getAssets();
  }, []);

  const getAssets = () => {
    const headers = getHeaders(authenticationSetting.csrfToken);
    // debugger
    fetch(`/data_fetching/navs/assets`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setAssets(result.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNewPatientModalOpen = () => {
    modalSetting.setNewPatientModalOpen(true);
  };

  return (
    <div className="nav-container">
      <div className="nav-link only-for-space"></div>

      {props?.role == "patient" ? (
        <>
          <Link
            href={props.role == "patient" ? "/?menu=false" : "/"}
            className="nav-link"
          >
            {location.pathname == "/" ? (
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/home_icon_with_label_active.png"
                className={classes.navIcon2}
                alt="Home Icon"
              />
            ) : (
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/home_icon_with_label_inactive.png"
                className={classes.navIcon2}
                alt="Home Icon"
              />
            )}
          </Link>

          <Link href="/sync-device" className="nav-link">
            {location.pathname == "/sync-device" ? (
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/my_device_icon_active.png"
                className={classes.navIcon2}
                alt="Sync Device Incon"
              />
            ) : (
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/my_device_icon_inactive.png"
                className={classes.navIcon2}
                alt="Sync Device Incon"
              />
            )}
          </Link>

          <Link href="/my-info" className="nav-link">
            {location.pathname == "/my-info" ? (
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/my_info_icon_active.png"
                className={classes.navIcon2}
                alt="My Info Icon"
              />
            ) : (
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/my_info_icon_inactive.png"
                className={classes.navIcon2}
                alt="My Info Icon"
              />
            )}
          </Link>
          <Link href="/preferences" className="nav-link">
            {location.pathname == "/preferences" ? (
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/preferences_icon_active.svg"
                className={classes.navIcon2}
                alt="Preferences Icon"
              />
            ) : (
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/preferences_icon_inactive.svg"
                className={classes.navIcon2}
                alt="Preferences Icon"
              />
            )}
          </Link>
          <Link href="/contact-us" className="nav-link">
            {location.pathname == "/contact-us" ? (
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/contact_us_icon_active.png"
                className={classes.navIcon2}
                alt="Contact Us Icon"
              />
            ) : (
              <img
                src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/contact_us_icon_inactive.png"
                className={classes.navIcon2}
                alt="Contact Us Icon"
              />
            )}
          </Link>
        </>
      ) : (
        <>
          <Link
            href={props.role == "patient" ? "/?menu=false" : "/"}
            className={`nav-link ${
              selected == "actionQueue" ? "navSelected" : ""
            }`}
          >
            <img
              src={assets.nav_queue_icon}
              alt="QueueIcon"
              className={"down-10px pad-10px"}
              id="actionQueue"
              onClick={() => setSelected("actionQueue")}
            />
          </Link>
          <RouterLink
            to="/patients"
            className={`nav-link ${
              selected == "patientList" ? "navSelected" : ""
            }`}
          >
            <img
              src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/nav_patients_icon.png"
              alt="PatientsIcon"
              className={"down-10px pad-10px"}
              id="patientList"
              onClick={() => setSelected("patientList")}
            />
          </RouterLink>
          <RouterLink
            to="/patient-lists"
            className={`nav-link ${
              selected == "patientLists" ? "navSelected" : ""
            }`}
          >
            <img
              src={assets.nav_patient_lists_icon}
              alt="PatientListsIcon"
              className={"down-10px pad-10px"}
              id="patientLists"
              onClick={() => setSelected("patientLists")}
            />
          </RouterLink>
          <RouterLink
            to="/user-administration"
            className={`nav-link ${
              selected == "providerList" ? "navSelected" : ""
            }`}
          >
            <img
              src={assets.providers_icon_with_label_inactive}
              alt="PatientsIcon"
              className={"down-10px pad-10px"}
              id="providerList"
              onClick={() => setSelected("providerList")}
            />
          </RouterLink>
          <Link
            href="https://hie.ndhin.com/concerto/Login.htm"
            target="_blank"
            className="nav-link"
          >
            <img
              src={assets.nav_hie_icon}
              alt="ChatIcon"
              className="down-10px pad-10px"
            />
          </Link>
          {checkPrivileges(userPrivileges, "Invite New Patient") && (
            <Link
              onClick={handleNewPatientModalOpen}
              className={`nav-link ${
                selected == "addPatient" ? "navSelected" : ""
              }`}
            >
              <img
                src={assets.nav_add_patient_icon}
                alt="Add Patient"
                className={"down-10px pad-10px"}
                id="addPatient"
              />
            </Link>
          )}
          {checkPrivileges(userPrivileges, "Access Resource Catalog") && (
            <RouterLink
              to="/resource-catalog"
              className={`nav-link ${
                selected == "resource" ? "navSelected" : ""
              }`}
            >
              <img
                src={assets.nav_catalog_icon}
                alt="ResourceCatalogIcon"
                className={"down-10px pad-10px"}
                id="resource"
                onClick={() => setSelected("resource")}
              />
            </RouterLink>
          )}
          <RouterLink
            to="/immunization-list"
            className={`nav-link ${
              selected == "immunizations" ? "navSelected" : ""
            }`}
          >
            <img
              src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/vaccinationIcon.svg"
              alt="ResourceCatalogIcon"
              className={"down-10px pad-10px"}
              id="resource"
              onClick={() => setSelected("immunizations")}
            />
          </RouterLink>
          {checkPrivileges(userPrivileges, "View Customers") && (
            <RouterLink
              to="/customer-list"
              className={`nav-link ${
                selected == "customerList" ? "navSelected" : ""
              }`}
            >
              <img
                src={assets.nav_customers_icon}
                alt="CustomersIcon"
                className={"down-10px pad-10px"}
                id="customerList"
                onClick={() => setSelected("customerList")}
              />
            </RouterLink>
          )}
          <RouterLink
            to="/admin-functions"
            className={`nav-link ${
              selected == "adminFunctions" ? "navSelected" : ""
            }`}
          >
            <img
              src={assets.nav_settings_icon}
              alt="SettingsIcons"
              className={"down-10px pad-10px"}
              id="adminFunctions"
              onClick={() => setSelected("adminFunctions")}
            />
          </RouterLink>
          <div className="ending-padding"></div>
        </>
      )}
    </div>
  );
};

export default Nav;
// library imports
import * as React from "react";
import { Link, Container, TextField, MenuItem } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

// icons imports
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import EmailIcon from "@mui/icons-material/Email";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SettingsIcon from "@mui/icons-material/Settings";

// style and other app setting imports
import { useHeaderStyles } from "../styles/useHeaderStyles";
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

interface Props {
  small_logo_src: string;
  logo_src: string;
  user_id: number;
  patient_id: number;
  csrfToken: any;
  customers: any;
  selected_customer: any;
  sync_device: string;
  user: object;
}

const Header: React.FC<Props> = (props: any) => {
  //  context import
  const authenticationSetting = React.useContext(AuthenticationContext);

  // other states and styles
  const { classes } = useHeaderStyles();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [user, setUser] = React.useState<any>({});
  const [customer, setCustomer] = React.useState<any>(
    props.selected_customer?.customer_id
  );
  const disableSelection = props.customers?.length > 1 ? false : true;

  React.useEffect(() => {
    fetch(`/data_fetching/users/basic_user_info/${props.user_id}`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setUser(result?.resource);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.user_id]);

  const currentDate = () => {
    var weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthName = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var today = new Date();

    return (
      weekday[today.getDay()] +
      ", " +
      monthName[today.getMonth()] +
      " " +
      today.getDate() +
      ", " +
      today.getFullYear()
    );
  };

  const updateCustomer = (new_customer_id) => {
    fetch(`/customer_selections/${props.selected_customer.id}`, {
      method: "PATCH",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        new_customer_id: new_customer_id,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (typeof result.error !== "undefined") {
          console.log(result.error);
        } else {
          if (window.location.pathname == "/care-plan-management") {
            window.location.href = window.location.pathname;
          } else {
            window.location.reload();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Container maxWidth={false}>
      <div className={classes.desktop}>
        <div className={classes.header}>
          <div className={classes.welcomeText}>
            <div className={classes.welcomeLeft}>
              <img
                className={classes.logo}
                src={props.small_logo_src}
                alt="Project Starfield"
                style={{ width: 45, marginTop: 4 }}
              />
            </div>
            <div className={classes.welcomeRight}>
              {user?.name} <br />
              <span className={classes.welcomeSmall}>{currentDate()}</span>
            </div>
            {user?.role != "patient" && (
              <div className="">
                <form action="">
                  <TextField
                    id="customer_id"
                    name="customer[customer_id]"
                    size="small"
                    className={`customer-selector`}
                    value={customer}
                    disabled={disableSelection}
                    variant="outlined"
                    onChange={(event) => {
                      updateCustomer(event.target.value);
                    }}
                    select
                  >
                    {props.customers.map((customer, index) => (
                      <MenuItem key={index} value={customer.id}>
                        {customer.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </form>
              </div>
            )}
          </div>
          <ProfileMenu user={user}></ProfileMenu>
        </div>
      </div>

      <div className={classes.mobile}>
        <div className={classes.mobileHeader}>
          <div className={classes.mobileMenuLink}>
            {!showMobileMenu && (
              <span
                className={classes.mobileNavLink}
                onClick={(event) => {
                  event.preventDefault();
                  setShowMobileMenu(true);
                }}
              >
                <MenuIcon className={classes.mobileNavIconBlack} />
              </span>
            )}
            {showMobileMenu && (
              <span
                className={classes.mobileNavLink}
                onClick={(event) => {
                  event.preventDefault();
                  setShowMobileMenu(false);
                }}
              >
                <CloseIcon className={classes.mobileNavIconBlack} />
              </span>
            )}
          </div>
          <div className={classes.mobileLogo}>
            <img
              className={classes.mobileLogoImage}
              src={props.logo_src}
              style={{ width: 32, marginTop: 5 }}
              alt="Project Starfield"
            />
          </div>
          <div className={classes.mobileHomeLink}>
            <Link
              href={user?.role == "patient" ? "/?menu=false" : "/"}
              className={classes.mobileNavLink}
            >
              <HomeIcon
                className={classes.mobileNavIcon}
                style={{ color: user?.role == "patient" ? "#f78204" : "" }}
              />
            </Link>
          </div>
        </div>
        {showMobileMenu && (
          <div className={classes.mobileNavigation}>
            {user?.role !== "patient" && (
              <>
                <RouterLink
                  to="/patients"
                  className={classes.mobileNavigationLink}
                  onClick={(event) => {
                    setShowMobileMenu(false);
                  }}
                >
                  Patients
                </RouterLink>
              </>
            )}
            {user?.role == "pharmacist" && (
              <>
                <RouterLink
                  to="/add-a-patient"
                  className={classes.mobileNavigationLink}
                  onClick={(event) => {
                    setShowMobileMenu(false);
                  }}
                >
                  Invite a Patient
                </RouterLink>
                <Link
                  href="https://hie.ndhin.com/concerto/Login.htm"
                  target="_blank"
                  className={classes.mobileNavigationLink}
                >
                  Orion Health Login
                </Link>
              </>
            )}
            {user?.role != "patient" && props.patient_id && (
              <>
                <RouterLink
                  to={`/data-rpm/${props.patient_id}`}
                  className={classes.mobileNavigationLink}
                  onClick={(event) => {
                    setShowMobileMenu(false);
                  }}
                >
                  RPM
                </RouterLink>
                <RouterLink
                  to={`/care-plan-management`}
                  className={classes.mobileNavigationLink}
                  onClick={(event) => {
                    setShowMobileMenu(false);
                  }}
                >
                  Care Plan Management
                </RouterLink>
                <RouterLink
                  to={`/resource-catelog`}
                  className={classes.mobileNavigationLink}
                  onClick={(event) => {
                    setShowMobileMenu(false);
                  }}
                >
                  Resource Catalog
                </RouterLink>
              </>
            )}
            {user?.role == "patient" && (
              <>
                <RouterLink
                  to="/sync-device"
                  className={classes.mobileNavigationLink}
                  onClick={(event) => {
                    setShowMobileMenu(false);
                  }}
                >
                  <img
                    src={props.sync_device}
                    style={{
                      float: "left",
                      marginTop: 0,
                      marginRight: 10,
                      width: 22,
                    }}
                  />
                  <span style={{ float: "left" }}>Sync My Device</span>
                </RouterLink>
                <RouterLink
                  to="/my-info"
                  className={classes.mobileNavigationLink}
                  onClick={(event) => {
                    setShowMobileMenu(false);
                  }}
                >
                  <PersonIcon
                    style={{ float: "left", marginTop: 0, marginRight: 10 }}
                  />
                  <span style={{ float: "left" }}>My Info</span>
                </RouterLink>
                <RouterLink
                  to="/preferences"
                  className={classes.mobileNavigationLink}
                  onClick={(event) => {
                    setShowMobileMenu(false);
                  }}
                >
                  <SettingsIcon
                    style={{ float: "left", marginTop: 0, marginRight: 10 }}
                  />
                  <span style={{ float: "left" }}>Preferences</span>
                </RouterLink>
                <RouterLink
                  to="/contact-us"
                  className={classes.mobileNavigationLink}
                  onClick={(event) => {
                    setShowMobileMenu(false);
                  }}
                >
                  <EmailIcon
                    style={{ float: "left", marginTop: 0, marginRight: 10 }}
                  />{" "}
                  <span style={{ float: "left" }}>Contact Us</span>
                </RouterLink>

                <RouterLink
                  to="/terms"
                  className={classes.mobileNavigationLink}
                  onClick={(event) => {
                    setShowMobileMenu(false);
                  }}
                >
                  <LibraryBooksIcon
                    style={{ float: "left", marginTop: 0, marginRight: 10 }}
                  />{" "}
                  <span style={{ float: "left" }}>Terms & Conditions</span>
                </RouterLink>
              </>
            )}
            <a
              className={classes.mobileNavigationLink}
              rel="nofollow"
              data-method="delete"
              href="/users/sign_out"
            >
              <ExitToAppIcon
                style={{ float: "left", marginTop: 0, marginRight: 10 }}
              />{" "}
              <span style={{ float: "left" }}>Log Out</span>
            </a>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Header;

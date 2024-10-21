import * as React from "react";
import { Grid, Link } from "@mui/material";

// helpers
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

// import component
import EditPermission from "./EditPermission";

interface Props {
  csrfToken: string;
  customerId: number;
  setEditInfo: any;
  setCustomerInfo: any;
  pencil_grey: string;
}

const CustomerList: React.FC<Props> = (props: any) => {
  //  context import
  const authenticationSetting = React.useContext(AuthenticationContext);

  const [customer, setCustomer] = React.useState<any>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [showPrivilege, setShowPrivilege] = React.useState<boolean>(false);

  const getCustomerObj = () => {
    if (props.customerId) {
      fetch(`/data_fetching/customers/${props.customerId}`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      })
        .then((result) => result.json())
        .then((result) => {
          if (typeof result.error !== "undefined") {
            console.log(result.error);
          } else {
            setCustomer(result.customer);
            setShowPrivilege(result.is_admin);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  React.useEffect(() => {
    getCustomerObj();
  }, [props.customerId]);

  const setEditInfo = () => {
    event.preventDefault();
    props.setEditInfo(true);
    props.setCustomerInfo(false);
  };

  const handleShowPermission = () => {
    setOpen(true);
  };
  return (
    <div className="show-edit-customer">
      <EditPermission
        customerId={props.customerId}
        open={open}
        setOpen={setOpen}
        customerName={customer?.name}
      />
      <div className="userAdminInformation">
        <Grid container direction="row" className="adminHeader">
          <Grid item xs={12} md={6}>
            <h3>Customer Information</h3>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            container
            direction="row"
            alignItems="center"
          >
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              {}
              <span>
                {showPrivilege && (
                  <Link
                    className="actionIcon"
                    href="#"
                    onClick={handleShowPermission}
                  >
                    <img
                      src="https://starfield-static-assets.s3.us-east-2.amazonaws.com/privileges.png"
                      alt="View Priviliges"
                      className="priv-icon action-icon-image"
                      style={{ width: "35px", maxHeight: "30px" }}
                    />
                    <p>Privileges</p>
                  </Link>
                )}
              </span>
              <span>
                <Link className="actionIcon" href="#" onClick={setEditInfo}>
                  <img
                    src={props.pencil_grey}
                    width="35"
                    alt="Edit Provider"
                    style={{ width: "25px", maxHeight: "25px" }}
                  />
                  <p>Edit Customer</p>
                </Link>
              </span>
            </Grid>
          </Grid>
        </Grid>
        <div className="tableContainer">
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid item xs={6}>
              <div className="customerInfo">
                <div className="customerInfoLabel">Name*</div>
                <div className="customerInfoValue">{customer?.name}</div>
              </div>
              <div className="customerInfo">
                <div className="customerInfoLabel">Address*</div>
                <div className="customerInfoValue">{customer?.address}</div>
              </div>
              <div className="customerInfo">
                <div className="customerInfoLabel">City*</div>
                <div className="customerInfoValue">{customer?.city}</div>
              </div>
              <div className="customerInfo">
                <div className="customerInfoLabel">State*</div>
                <div className="customerInfoValue">{customer?.state}</div>
              </div>
              <div className="customerInfo">
                <div className="customerInfoLabel">Zip*</div>
                <div className="customerInfoValue">{customer?.zip}</div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="customerInfo">
                <div className="customerInfoLabel">County</div>
                <div className="customerInfoValue">
                  {customer?.county ? customer.county : "N/A"}
                </div>
              </div>
              <div className="customerInfo">
                <div className="customerInfoLabel">Phone number*</div>
                <div className="customerInfoValue">
                  {customer?.phone_number ? customer.phone_number : "N/A"}
                </div>
              </div>
              <div className="customerInfo">
                <div className="customerInfoLabel">Federal Tax ID #</div>
                <div className="customerInfoValue">
                  {customer?.federal_tax_id ? customer?.federal_tax_id : "N/A"}
                </div>
              </div>
              <div className="customerInfo">
                <div className="customerInfoLabel">Facility NPI</div>
                <div className="customerInfoValue">
                  {customer?.facility_npi ? customer?.facility_npi : "N/A"}
                </div>
              </div>
              <div className="customerInfo">
                <div className="customerInfoLabel">Place of Service Code</div>
                <div className="customerInfoValue">
                  {customer?.place_of_service_code
                    ? customer?.place_of_service_code
                    : "N/A"}
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid item xs={12}>
              <div className="customerInfo">
                <div className="customerInfoLabel">Notes</div>
                <div className="customerInfoValue">
                  {customer?.notes ? customer.notes : "N/A"}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;

// libs import
import * as React from "react";
import { Grid } from "@mui/material";
import { Switch, Route } from "react-router-dom";

// helpers
import { checkPrivileges } from "../utils/PrivilegesHelper";

// comps
import ActionQueue from "../action_queue/ActionQueue";
import DataRPM from "../patients/DataRpm";
import CustomerList from "../customers/CustomerList";
import ResourceCatalog from "../resourceItems/ResourceCatalog";
import AdminFunctions from "../users/AdminFunctions";
import PatientUpload from "../users/PatientUpload";
import PatientIndex from "../users/PatientIndex";
import ProviderEdit from "../users/ProviderEdit";
import CoreTeamIndex from "../admin/core_team/CoreTeamIndex";
import Terms from "../legal/Terms";
import PatientReportIndex from "../patient_reports/PatientReportIndex";
import NewNoteTemplate from "../notes_template/NewNoteTemplate";
import EditNoteTemplate from "../notes_template/EditNoteTemplate";
// import Immunization from "../immunization/OldImmunization";
import Immunization from "../immunization/Immunization";
import NewQuestionnaire from "../questionnaires/NewQuestionnaire";
import Questionnaires from "../questionnaires/Questionnaires";

// report routes
import ReportIndex from "../reports/ReportIndex";
import AdtDischargeReport from "../reports/AdtDischargeReport";
import ProviderActionReport from "../reports/ProviderActionReport";
import ImmunizationForecastReport from "../reports/ImmunizationForecastReport";
import VaxAggregateReport from "../reports/VaxAggregateReport";
import EncounterDetailReport from "../reports/EncounterDetailReport";
import BasicPatientDemographicReport from "../reports/BasicPatientDemographicReport";
import NdmReports from "../ndm_reports";
import NdmReportDetail from "../ndm_reports/show";
import ActionIndex from "../actions";
import NewProviderAction from "../actions/NewProviderAction";
import NewProgramBuilder from "../program_builder/NewProgramBuilder";
import ProgramBuilder from "../program_builder";
import NotFound from "../shared/NotFound";
import ActionSettings from "../actions/Settings";
import PatientLists from "../patient_lists/PatientLists";
import PatientListCreate from "../patient_lists/PatientListCreate" 
import PatientListShow from "../users/PatientListShow";
import LtcBuilder from "../long_term_care_facilities/LtcBuilder";

export const ProviderRoutes = (props, user, classes, userPrivileges) => {
  const noAccessContent = (
    <div className={classes.content}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        style={{ marginLeft: "120px" }}
      >
        <h3>Sorry, you do not have access to this page.</h3>
      </Grid>
    </div>
  );

  return (
    <Switch>
      <Route exact path="/">
        {user == null ? (
          "Loading..."
        ) : (
          <div className={classes.content}>
            <ActionQueue
              csrfToken={props.csrfToken}
              user_id={props.user_id}
              action_queue_assign_icon={props.action_queue_assign_icon}
              action_queue_unassign_icon={props.action_queue_unassign_icon}
              sort_ascending_src={props.sort_ascending_src}
              sort_descending_src={props.sort_descending_src}
              sort_plain_src={props.sort_plain_src}
            />
          </div>
        )}
      </Route>
      <Route exact path="/terms">
        <div className={classes.content}>
          <Terms />
        </div>
      </Route>
      <Route exact path="/user-administration">
        <div className={classes.content}>
          <CoreTeamIndex
            csrfToken={props.csrfToken}
            menu_track_src={props.menu_track_src}
            user_id={props.user_id}
            sort_plain_src={props.sort_plain_src}
            sort_ascending_src={props.sort_ascending_src}
            sort_descending_src={props.sort_descending_src}
            chat_icon_with_orange_line={props.chat_icon_with_orange_line}
            the_wall_icon_grey={props.the_wall_icon_grey}
            pencil_grey={props.pencil_grey}
            button_src={props.button_src}
          />
        </div>
      </Route>
      <Route exact path="/edit-note-template/:template_id">
        <div className={classes.content}>
          <EditNoteTemplate />
        </div>
      </Route>
      <Route exact path="/admin-functions">
        <div className={classes.content}>
          <AdminFunctions />
        </div>
      </Route>
      <Route exact path="/patients">
        <div className={classes.content}>
          <PatientIndex
            csrfToken={props.csrfToken}
            menu_track_src={props.menu_track_src}
            sort_plain_src={props.sort_plain_src}
            sort_ascending_src={props.sort_ascending_src}
            sort_descending_src={props.sort_descending_src}
            chat_icon_with_orange_line={props.chat_icon_with_orange_line}
            the_wall_icon_grey={props.the_wall_icon_grey}
            pencil_grey={props.pencil_grey}
            patient_reports_icon={props.patient_reports_icon}
          />
        </div>
      </Route>
      <Route exact path="/patient-lists">
        <div className={classes.content}>
          <PatientLists
            csrfToken={props.csrfToken}
            menu_track_src={props.menu_track_src}
            sort_ascending_src={props.sort_ascending_src}
            sort_descending_src={props.sort_descending_src}
            sort_plain_src={props.sort_plain_src}
          />
        </div>
      </Route>
      <Route exact path="/new-patient-list/:id?">
        <div className={classes.content}>
          <PatientListCreate
            csrfToken={props.csrfToken}
            user_id={props.user_id}
            menu_track_src={props.menu_track_src}
            sort_ascending_src={props.sort_ascending_src}
            sort_descending_src={props.sort_descending_src}
            sort_plain_src={props.sort_plain_src}
          />
        </div>
      </Route>
      <Route exact path="/patient-lists/:id">
        <div className={classes.content}>
          <PatientListShow />
        </div>
      </Route>
      <Route exact path="/customer-list">
        {checkPrivileges(userPrivileges, "View Customers") ? (
          <div className={classes.content}>
            <CustomerList
              csrfToken={props.csrfToken}
              menu_track_src={props.menu_track_src}
              user_id={props.user_id}
              sort_ascending_src={props.sort_ascending_src}
              sort_descending_src={props.sort_descending_src}
              sort_plain_src={props.sort_plain_src}
              pencil_grey={props.pencil_grey}
            />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/data-rpm/:id">
        <div className={classes.content}>
          <DataRPM
            csrfToken={props.csrfToken}
            menu_track_src={props.menu_track_src}
            button_src={props.button_src}
          />
        </div>
      </Route>
      <Route exact path="/resource-catalog">
        {checkPrivileges(userPrivileges, "Access Resource Catalog") ? (
          <div className={classes.content}>
            <ResourceCatalog
              csrfToken={props.csrfToken}
              user_id={props.user_id}
              menu_track_src={props.menu_track_src}
              menu_minus_circle={props.menu_minus_circle}
            />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route path="/patient_reports/:id">
        <div className={classes.content}>
          <PatientReportIndex
            csrfToken={props.csrfToken}
            menu_track_src={props.menu_track_src}
          />
        </div>
      </Route>
      <Route exact path="/profile-edit">
        <ProviderEdit
          user_id={props.user_id}
          selectedCustomer={props.selected_customer}
          customers={props.customers}
        />
      </Route>
      <Route exact path="/patient-upload">
        <div className={classes.content}>
          <PatientUpload csrfToken={props.csrfToken} />
        </div>
      </Route>
      <Route exact path="/new-note-template">
        <div className={classes.content}>
          <NewNoteTemplate />
        </div>
      </Route>
      <Route exact path="/reports">
        {checkPrivileges(userPrivileges, "Access Reporting") ? (
          <div className={classes.content}>
            <ReportIndex />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/provider-action-report">
        {checkPrivileges(userPrivileges, "Access Reporting") ? (
          <div className={classes.content}>
            <ProviderActionReport customers={props.customers} />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/adt-discharge-report">
        {checkPrivileges(userPrivileges, "Access Reporting") ? (
          <div className={classes.content}>
            <AdtDischargeReport />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/immunizaiton-forecast-report">
        {checkPrivileges(userPrivileges, "Access Reporting") ? (
          <div className={classes.content}>
            <ImmunizationForecastReport />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/vax-aggregate-report">
        {checkPrivileges(userPrivileges, "Access Reporting") ? (
          <div className={classes.content}>
            <VaxAggregateReport />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/encounter-detail-report">
        {checkPrivileges(userPrivileges, "Access Reporting") ? (
          <div className={classes.content}>
            <EncounterDetailReport />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/patient-demographic-report">
        {checkPrivileges(userPrivileges, "Access Reporting") ? (
          <div className={classes.content}>
            <BasicPatientDemographicReport />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/immunization-list">
        <div className={classes.content}>
          <Immunization />
        </div>
      </Route>
      <Route exact path="/new-questionnaire/:id?">
        {checkPrivileges(userPrivileges, "Build Questionnaire") ? (
          <div className={classes.content}>
            <NewQuestionnaire />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/questionnaires-list">
        {checkPrivileges(userPrivileges, "Build Questionnaire") ? (
          <div className={classes.content}>
            <Questionnaires />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/ndm-report/:id">
        {checkPrivileges(userPrivileges, "Access NDM Reporting") ? (
          <NdmReportDetail />
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/ndm-report">
        {/* Uncomment the following if privilege is required to access the ndm feature */}
        {checkPrivileges(userPrivileges, "Access NDM Reporting") ? (
          <div className={classes.content}>
            <NdmReports />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route exact path="/action-builder-list">
        {/* {checkPrivileges(userPrivileges, "Build Questionnaire") ? ( */}
        <div className={classes.content}>
          <ActionIndex
            sort_ascending_src={props.sort_ascending_src}
            sort_descending_src={props.sort_descending_src}
            sort_plain_src={props.sort_plain_src}
          />
        </div>
        {/* ) : ( */}
        {/* noAccessContent */}
        {/* )} */}
      </Route>
      <Route exact path="/action-settings">
        <div className={classes.content}>
          <ActionSettings />
        </div>
      </Route>
      <Route exact path="/program-builder">
        <div className={classes.content}>
          <ProgramBuilder
            sort_ascending_src={props.sort_ascending_src}
            sort_descending_src={props.sort_descending_src}
            sort_plain_src={props.sort_plain_src}
          />
        </div>
      </Route>
      <Route exact path="/new-provider-action/:id?">
        <div className={classes.content}>
          <NewProviderAction />
        </div>
      </Route>
      <Route exact path="/new-program/:id?">
        <div className={classes.content}>
          <NewProgramBuilder />
        </div>
      </Route>
      <Route exact path="/new-action-builder/:id?">
        {/* {checkPrivileges(userPrivileges, "Build Questionnaire") ? ( */}
        {/* <div className={classes.content}>
          <NewActionIndex />
        </div> */}
        {/* ) : ( */}
        {/* noAccessContent */}
        {/* )} */}
      </Route>
      <Route exact path="/facilities">
        {checkPrivileges(userPrivileges, "Access Living Facility Builder") ? (
          <div className={classes.content}>
            <LtcBuilder />
          </div>
        ) : (
          noAccessContent
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
};
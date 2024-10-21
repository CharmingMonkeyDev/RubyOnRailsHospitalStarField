import { Grid, Link } from "@mui/material";
import React from "react";
import { ActionSourceFilterType } from "./ActionQueue";

interface Props {
  selectedActionSource: ActionSourceFilterType;
  setSelectedActionSource: (source: ActionSourceFilterType) => void;
  sourceSummary: any;
}

const ActionFilters: React.FC<Props> = (props) => {
  const { selectedActionSource, setSelectedActionSource, sourceSummary } =
    props;

  const FilterSource: React.FC<any> = ({
    actionSource,
    count,
    overdue,
    title,
  }) => {
    return (
      <div
        onClick={() => setSelectedActionSource(actionSource)}
        className={`${
          actionSource == selectedActionSource ? "selected-filter " : " "
        } source-filter`}
      >
        <p>{title}</p>
        <span className={` ${overdue ? "overdue-filter" : ""}`}>{count}</span>
      </div>
    );
  };

  return (
    <Grid item xs={12} className="actionQueueSourceFilterContainer">
      <div className="actionQueueHeader">
        <p className="title">Action Queue</p>
      </div>
      <div
        className="divider-orange"
        style={{ margin: "0px", width: "100%" }}
      ></div>
      <div className="actionQueueSourceFilter">
        <FilterSource
          actionSource="all"
          count={sourceSummary?.summary.count}
          overdue={sourceSummary?.summary.overdue}
          title="All Actions"
        />
        <FilterSource
          actionSource="adt_discharge"
          count={sourceSummary?.adt_discharge.count}
          overdue={sourceSummary?.adt_discharge.overdue}
          title="ADT Notifications"
        />
        <FilterSource
          actionSource="care_plan"
          count={sourceSummary?.care_plan.count}
          overdue={sourceSummary?.care_plan.overdue}
          title="Provider Actions"
        />
        <FilterSource
          actionSource="questionnaire_submission"
          count={sourceSummary?.questionnaire_submission.count}
          overdue={sourceSummary?.questionnaire_submission.overdue}
          title="Questionnaire Submission"
        />
        <Link className={`source-filter`} href="/immunization-list">
          <p>Immunization Alerts Next 30 days</p>
          <span>{sourceSummary?.immunization.count}</span>
        </Link>
      </div>
    </Grid>
  );
};

export default ActionFilters;

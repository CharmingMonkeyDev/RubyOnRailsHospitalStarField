import { Grid } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { ImagesContext, AuthenticationContext } from "../Context";
import ActionCard from "./ActionCard";
import { getHeaders } from "../utils/HeaderHelper";

interface Props {
  basicInfo: any;
}
interface ActionStats {
  unassigned_actions: string;
  provider_actions: string;
  adt_alerts: string;
  questionnaire_submissions: string;
  overdue_actions: string;
}

const ActionHeader: React.FC<Props> = (props) => {
  const images = React.useContext(ImagesContext);
  const authenticationSetting = React.useContext(AuthenticationContext);
  const [actionStats, setActionStats] = useState<ActionStats>();

  useEffect(() => {
    fetchActionStats();
  }, []);

  const fetchActionStats = async () => {
    const response = await fetch(`/data_fetching/action_stats`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    });
    if (response.status === 404) {
      window.location.href = "/not-found";
      return;
    }
    const result = await response.json();
    if (result.success == false) {
      alert(result.error);
    } else {
      setActionStats(result.resource);
    }
  };

  return (
    <Stack direction={"row"} display={"flex"} gap={1}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className="container"
        style={{
          padding: 10,
          textAlign: "center",
          backgroundColor: "#FE890B",
          borderRadius: "5px",
          color: "white",
          marginTop: "0",
        }}
        position={"relative"}
      >
        <img
          src={images.starfield_logo_gif_src}
          alt="Starfield logo"
          style={{
            position: "absolute",
            left: "0",
            height: "100%",
            borderRadius: "5px 0px 0px 5px",
          }}
        />
        <Grid item xs={12} ml={"100px"}>
          <h1 style={{ lineHeight: 0.5 }}>Welcome to Starfield!</h1>
          <p style={{ lineHeight: 0.5, fontSize: "0.8em" }}>
            {props.basicInfo?.selected_customer_name} - {props.basicInfo?.name}
          </p>
        </Grid>
      </Grid>
      <ActionCard
        cardTitle={"Unassigned"}
        actionNumber={actionStats?.unassigned_actions}
      />
      <ActionCard
        cardTitle={"Provider"}
        actionNumber={actionStats?.provider_actions}
      />
      <ActionCard
        cardTitle={"ADT Alerts"}
        actionNumber={actionStats?.adt_alerts}
      />
      <ActionCard
        cardTitle={"Questionnaire Submissions"}
        actionNumber={actionStats?.questionnaire_submissions}
        smallTitle={true}
      />
      <ActionCard
        cardTitle={"Overdue"}
        actionNumber={actionStats?.overdue_actions}
        actionColor="red"
      />
    </Stack>
  );
};

export default ActionHeader;

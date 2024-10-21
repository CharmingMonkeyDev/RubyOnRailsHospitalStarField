/* eslint-disable prettier/prettier */
import * as React from "react";
import { Grid, TextField } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { AuthenticationContext } from "../../Context";
import { getHeaders } from "../../utils/HeaderHelper";
import { Link as RouterLink } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

// components import
import PatientChatShow from "./PatientChatShow";
import PatientBreadcrumbs from "../../paritals/patient_breadcrumbs";

interface Props {}

const useStyles = makeStyles(() => ({
  container: {
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: 500,
    marginTop: 80,
    "@media (max-width: 600px)": {
      width: "100%",
      marginTop: 70,
    },
  },
  indicatorContainer: {
    width: "100%",
    textAlign: "center",
    "@media (max-width: 600px)": {
      position: "absolute",
      bottom: 20,
    },
  },
  indicator: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    backgroundColor: "#efe9e7",
    display: "inline-block",
    marginRight: 6,
    marginLeft: 6,
    marginTop: 25,
  },
}));

const PatientChatIndex: React.FC<Props> = (props: any) => {
  // users id
  const authSettings = React.useContext(AuthenticationContext);
  const csrfToken = authSettings.csrfToken;

  // styles
  const classes = useStyles();

  //component state
  const [channels, setChannels] = React.useState<any>([]);
  const [finalChannels, setFinalChannels] = React.useState<any>([]);
  const [channelId, setChannelId] = React.useState<string>("");
  const [searchKey, setSearchKey] = React.useState<string>("");

  React.useEffect(() => {
    getChatLists();
  }, []);

  React.useEffect(() => {
    applyFilter();
  }, [searchKey, channels]);

  const getChatLists = () => {
    fetch(`/data_fetching/chats`, {
      method: "GET",
      headers: getHeaders(csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.message);
        } else {
          setChannels(result?.resource?.channel_with_colleagues);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const applyFilter = () => {
    if (searchKey != "") {
      let channelsWithMatchingName = channels?.filter(
        (channel) =>
          channel.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
      );
      setFinalChannels(channelsWithMatchingName);
    } else {
      setFinalChannels(channels);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (window.location.href = "/my-care-plan"),
    onSwipedRight: () => (window.location.href = "/?menu=false"),
  });

  return (
    <Grid className={classes.container} {...swipeHandlers}>
      {channelId ? (
        <PatientChatShow channel_id={channelId} setChannelId={setChannelId} />
      ) : (
        <>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            className="patient-page-heading"
          >
            <Grid item xs={2} className="center-text">
              <RouterLink
                to="/?menu=false"
                className="patient-back-botton"
                style={{ color: "#4A4442" }}
              >
                &lt;
              </RouterLink>
            </Grid>
            <Grid
              item
              xs={8}
              className="patient-page-title"
              style={{
                textAlign: "center",
              }}
            >
              <span>Chat</span>
            </Grid>
          </Grid>

          <Grid container className="patient-chat-search">
            <Grid item xs={12} className="patient-chat-search__box">
              <TextField
                id="search"
                label="Search Conversations"
                value={searchKey}
                onChange={(event) => {
                  setSearchKey(event.target.value);
                }}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>

          <div className="patient-chat space-for-breadcrum">
            {finalChannels.map((channel) => {
              return (
                <div key={channel.id} className="patient-chat-item">
                  <Grid container onClick={() => setChannelId(channel.id)}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={10}>
                      {channel.name}{channel?.unread_count > 0 ? <span className="chat-red-dot-small" /> : null} 
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      className="patient-back-botton"
                      style={{ color: "#4A4442" }}
                    >
                      &gt;
                    </Grid>
                  </Grid>
                </div>
              );
            })}
          </div>
        </>
      )}
      <PatientBreadcrumbs page={"chat"} />
    </Grid>
  );
};

export default PatientChatIndex;

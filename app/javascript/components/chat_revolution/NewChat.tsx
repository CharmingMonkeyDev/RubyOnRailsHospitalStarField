/* eslint-disable prettier/prettier */

// library import
import * as React from "react";
import { Grid, TextField, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  userList: any;
  saveMethod: any;
  setShowAddUserForm: any;
  userType: any;
}

const NewChat: React.FC<Props> = (props: any) => {
  // states
  const [searchKey, setSearchKey] = React.useState<string>("");
  const [finalUserList, setFinalUserList] = React.useState<any>([]);

  React.useEffect(() => {
    applyFilter();
  }, [searchKey, props.userList]);

  const handleCloseForm = () => {
    props.setShowAddUserForm(false);
  };

  const applyFilter = () => {
    if (searchKey != "") {
      let userWithMatchingName = props.userList.filter(
        (user) =>
          user.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
      );
      setFinalUserList(userWithMatchingName);
    } else {
      setFinalUserList(props.userList);
    }
  };

  return (
    <>
      <Grid container className="chat-window-header">
        <Grid item xs={11}>
          New {props.userType} Message
        </Grid>
        <Grid item xs={1}>
          <Link onClick={handleCloseForm} className="close-link">
            <CloseIcon />
          </Link>
        </Grid>
      </Grid>

      <Grid container className="search-seperator">
        <Grid item xs={12} className="search-container">
          <TextField
            id="search"
            label={`Search ${props.userType}`}
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
      <div className="chat-list-2">
        {finalUserList.map((user) => {
          return (
            <div
              key={user.id}
              className="single-chat-elem"
              onClick={() => props.saveMethod(user.id)}
            >
              <Grid container className="single-chat-container">
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                  {user.name}
                </Grid>
                <Grid item xs={1}></Grid>
              </Grid>
            </div>
          );
        })}
        <div className="ending-space"></div>
      </div>
    </>
  );
};

export default NewChat;

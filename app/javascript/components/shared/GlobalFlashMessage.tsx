/* eslint-disable prettier/prettier */
import * as React from "react";
import { Snackbar } from "@mui/material";
import { Alert } from '@mui/material';
import { FlashContext } from "../Context";
import { useLocation, useHistory } from 'react-router-dom';

interface Props {}

const GlobalFlashMessage: React.FC<Props> = (props: any) => {
  // states
  const flashContext = React.useContext(FlashContext);
  const location = useLocation();
  const history = useHistory();

  // Check for state after redirect
  React.useEffect(() => {
    if (location.state?.flashMessage) {
      flashContext.setMessage({
        text: location.state.flashMessage,
        type: "success",
      });
    }
  }, [location, history]);

  return (
    <>
      {flashContext.message?.text?.length > 0 && (
        <Snackbar
          open={flashContext.message?.text?.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            flashContext.setMessage({ text: "", type: "error" });
          }}
        >
          <Alert severity={flashContext.message?.type}>
            {flashContext.message?.text}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default GlobalFlashMessage;

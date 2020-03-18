import * as React from "react";
import { Snackbar } from "@mui/material";
import { Alert } from '@mui/material';

interface Props {
  flashMessage: any;
}

const FlashMessage: React.FC<Props> = (props: any) => {
  // states
  const [flashMessageObj, setFlashMessageObj] = React.useState<any>({
    message: "",
    type: "error",
  });

  React.useEffect(() => {
    setFlashMessageObj({
      message: props.flashMessage?.message,
      type: props.flashMessage?.type,
    });
  }, [props.flashMessage]);

  return (
    <>
      {flashMessageObj.message.length > 0 && (
        <Snackbar
          open={flashMessageObj.message.length > 0}
          autoHideDuration={6000}
          onClose={() => {
            setFlashMessageObj({ message: "", type: "error" });
          }}
        >
          <Alert severity={flashMessageObj.type}>
            {flashMessageObj.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default FlashMessage;

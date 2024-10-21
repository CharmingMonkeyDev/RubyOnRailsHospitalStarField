import React, { FC, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import SignaturePad from "react-signature-canvas";

// component
import FlashMessage from "../../shared/FlashMessage";

interface Props {
  question: any;
  index: number;
  setSignatureImg: any;
  formId: number;
}

const SignatureCaptureSub: FC<Props> = (props: any) => {
  const sigCanvas = React.useRef(null);
  const [dataUrl, setDataUrl] = React.useState(null);

  // error message
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  // handlers
  const clear = () => {
    sigCanvas.current.clear();
  };

  const save = () => {
    const imgUrl = sigCanvas.current.toDataURL();
    setDataUrl(imgUrl);
    props.setSignatureImg(imgUrl);
    setFlashMessage({
      message: "Signature saved",
      type: "success",
    });
  };

  const saveButton = useRef(null);
  const autoSave = () => {
    if (saveButton.current) {
      saveButton.current.click();
    }
  };

  useEffect(() => {
    clear();
  }, [props.formId]);

  return (
    <Grid container>
      <FlashMessage flashMessage={flashMessage} />
      <Grid item xs={12} className="q-submission-title">
        {props.question.title}
      </Grid>
      <Grid item xs={12}>
        <p>
          By providing your hand-written signature in the box provided, you
          agree this is the legal equivalent of signing a physical document
          using permanent ink.
        </p>
      </Grid>
      <Grid
        item
        xs={12}
        style={{ border: "1px solid black", position: "relative" }}
      >
        <SignaturePad
          penColor="black"
          ref={sigCanvas}
          canvasProps={{
            width: 425,
            height: 250,
            border: "2px solid black",
          }}
          onEnd={autoSave}
        />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button className="default-btn" onClick={clear}>
            Clear
          </button>
          <button ref={saveButton} className="default-btn signature-save" onClick={save}>
            Save
          </button>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignatureCaptureSub;

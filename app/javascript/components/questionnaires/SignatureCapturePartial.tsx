import * as React from "react";
import { Grid } from "@mui/material";
import SignaturePad from "react-signature-canvas";

interface Props {
  published: boolean;
}

const SignatureCapturePartial: React.FC<Props> = (props: any) => {
  const sigCanvas = React.useRef(null);
  const [dataUrl, setDataUrl] = React.useState(null);
  const clear = () => {
    sigCanvas.current.clear();
  };

  const save = () => {
    setDataUrl(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
  };

  return (
    <Grid container>
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
            width: 585,
            height: 300,
            border: "2px solid black",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            className="default-btn"
            onClick={clear}
            disabled={props.published}
          >
            Clear
          </button>
          <button className="default-btn signature-save" onClick={save} disabled>
            Save
          </button>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignatureCapturePartial;

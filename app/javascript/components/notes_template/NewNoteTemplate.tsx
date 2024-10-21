/* eslint-disable prettier/prettier */
// library imports
import * as React from "react";
import { Grid } from "@mui/material";

// components imports
import NoteTemplateForm from "./NoteTemplateForm";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

interface Props {}

const NewNoteTemplate: React.FC<Props> = (props: any) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);

  const [name, setName] = React.useState<string>("");
  const [blocks, setBlocks] = React.useState<any>([
    { id: "", order: 1, note: "" },
  ]);
  const [disableSave, setDisableSave] = React.useState<boolean>(false);

  const handleTemplateSave = () => {
    setDisableSave(true);
    fetch(`/notes_templates`, {
      method: "POST",
      headers: getHeaders(authenticationSetting.csrfToken),
      body: JSON.stringify({
        notes_template: {
          name: name,
          notes_template_blocks: blocks,
        },
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          console.log(result.error);
        } else {
          if (result?.resource) {
            window.location.href = `/edit-note-template/${result?.resource}`;
          } else {
            alert("Something is wrong and template cannot be saved");
            setDisableSave(false);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBlockRemoval = (block) => {
    let restOfBlocks = blocks.filter((b) => b.order != block.order);
    restOfBlocks.sort((a, b) => (a.order > b.order ? 1 : -1));
    setBlocks(restOfBlocks);
  };

  return (
    <div className="patient-index-container">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="container"
      >
        <Grid item xs={12} md={12}>
          <div className="userAdminInformation note-form-container">
            <NoteTemplateForm
              name={name}
              setName={setName}
              blocks={blocks}
              setBlocks={setBlocks}
              handleBlockRemoval={handleBlockRemoval}
              handleTemplateSave={handleTemplateSave}
              disableSave={disableSave}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default NewNoteTemplate;

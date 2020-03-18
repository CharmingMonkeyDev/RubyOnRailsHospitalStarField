/* eslint-disable prettier/prettier */
// library imports
import * as React from "react";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";

// components imports
import NoteTemplateForm from "./NoteTemplateForm";
import FlashMessage from "../shared/FlashMessage";

// helpers imports
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

interface Props {}

const EditNoteTemplate: React.FC<Props> = (props: any) => {
  // authenticationContext and chat context and other contexts
  const authenticationSetting = React.useContext(AuthenticationContext);

  // error handling
  const [flashMessage, setFlashMessage] = React.useState<any>({
    message: "",
    type: "error",
  });

  // templateId
  const { template_id } = useParams();

  const [name, setName] = React.useState<string>("");
  const [blocks, setBlocks] = React.useState<any>([]);
  const [removedBlockIds, setRemovedBlockIds] = React.useState<any>([]);
  const [disableSave, setDisableSave] = React.useState<boolean>(false);

  const handleTemplateSave = () => {
    if (template_id) {
      setDisableSave(true);
      fetch(`/notes_templates/${template_id}`, {
        method: "PATCH",
        headers: getHeaders(authenticationSetting.csrfToken),
        body: JSON.stringify({
          notes_template: {
            name: name,
            notes_template_blocks: blocks,
            removed_block_ids: removedBlockIds,
          },
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            console.log(result.error);
          } else {
            getTemplateInfo();
            setFlashMessage({
              message: "Successfully updated",
              type: "success",
            });
          }
          setDisableSave(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  React.useEffect(() => {
    getTemplateInfo();
  }, []);

  const getTemplateInfo = async () => {
    // console.log("getting info")
    if (template_id) {
      const response = await fetch(`/notes_templates/${template_id}/edit`, {
        method: "GET",
        headers: getHeaders(authenticationSetting.csrfToken),
      });
      if (response.status === 404) {
        window.location.href = "/not-found";
        return;
      }
      const result = await response.json();
      if (result.success == false) {
        console.log("hello", result.error);
      } else {
        setName(result?.resource?.name);
        setBlocks(result?.resource?.blocks);
      }
    }
  };

  const handleBlockRemoval = (block) => {
    let restOfBlocks = blocks.filter((b) => b.order != block.order);
    restOfBlocks.sort((a, b) => (a.order > b.order ? 1 : -1));
    setBlocks(restOfBlocks);

    if (block.id) {
      setRemovedBlockIds([...removedBlockIds, block.id]);
    }
  };

  return (
    <div className="patient-index-container">
      <FlashMessage flashMessage={flashMessage} />
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

export default EditNoteTemplate;

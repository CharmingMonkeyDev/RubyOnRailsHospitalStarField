/* eslint-disable prettier/prettier */
// library imports
import * as React from "react";
import { Grid, Link, TextField, Modal, InputLabel } from "@mui/material";
import ReactQuill from "react-quill";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// components imports
import NoteTemplateList from "./NoteTemplateList";
import GeneralModal from "../modals/GeneralModal";

interface Props {
  name: String;
  setName: any;
  blocks: any;
  setBlocks: any;
  handleBlockRemoval: any;
  handleTemplateSave: any;
  disableSave: boolean;
}

const NoteTemplateForm: React.FC<Props> = (props: any) => {
  const [showTemplateModal, setShowTemplateModal] =
    React.useState<boolean>(false);

  const onEditorStateChange = (data, block) => {
    block.note = data;
    const restOfBlocks = props.blocks.filter((b) => b.order != block.order);
    props.setBlocks(orderedBLocks([...restOfBlocks, block]));
  };

  const handleBlockAddition = () => {
    const highestOrder = Math.max(...props.blocks.map((block) => block.order));
    props.setBlocks(
      orderedBLocks([
        ...props.blocks,
        { id: "", order: highestOrder + 1, note: "" },
      ])
    );
  };

  const orderedBLocks = (newBlocks) => {
    return newBlocks.sort((a, b) => (a.order > b.order ? 1 : -1));
  };

  const closeModal = () => {
    setShowTemplateModal(false);
  };

  return (
    <Grid container className="wrapper">
      <Grid container item xs={12} justifyContent="space-between">
        <Grid item xs={6} className="header-container">
          <h3>Template Builder</h3>
        </Grid>
        <Grid item xs={6} className="btn-container">
          <Link className="menuLink" onClick={() => setShowTemplateModal(true)}>
            Current Templates
          </Link>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <p className="sub-header">
          Enter your template information below. To create inputs with multiple
          template blocks, use the &apos;add a template block&apos; button below
        </p>
      </Grid>
      <Grid item xs={12}>
        <InputLabel htmlFor="first_name" className="field-label">
          Template Name
        </InputLabel>
      </Grid>
      <Grid item xs={12} className="field-container">
        <TextField
          id="first_name"
          size="small"
          value={props.name}
          className="the-field"
          required
          variant="outlined"
          onChange={(event) => {
            props.setName(event.target.value);
          }}
        />
      </Grid>
      {props.blocks?.map((block, index) => {
        return (
          <Grid key={index} container item xs={12}>
            <Grid item xs={12}>
              <InputLabel className="field-label">
                Template Block #{index + 1}
                {index != 0 && (
                  <Link>
                    <DeleteIcon
                      style={{
                        fontSize: 24,
                        color: "#c1b7b3",
                        display: "inline-block",
                        cursor: "pointer",
                        marginLeft: 10,
                        position: "relative",
                        bottom: -4,
                      }}
                      onClick={() => {
                        props.handleBlockRemoval(block);
                      }}
                    />
                  </Link>
                )}
              </InputLabel>
            </Grid>
            <Grid item xs={12}>
              <ReactQuill
                theme="snow"
                value={block.note}
                onChange={(value) => onEditorStateChange(value, block)}
                modules={{
                  clipboard: {
                    matchVisual: false,
                  },
                }}
              />
            </Grid>
          </Grid>
        );
      })}
      <Grid container item xs={12}>
        <Link
          className="action-link"
          style={{ cursor: "pointer" }}
          onClick={handleBlockAddition}
        >
          <AddIcon className="plus-icon" />{" "}
          <span className="app-user-text">Add Template Block</span>
        </Link>
      </Grid>
      <Grid container item xs={12} justifyContent="center">
        <Grid item xs={3} className="save-btn-container">
          {props.disableSave ? (
            <Link
              style={{
                cursor: "pointer",
                display: "inline-block",
                textAlign: "center",
              }}
              className="menuLink"
            >
              Saving......
            </Link>
          ) : (
            <Link
              style={{
                cursor: "pointer",
                display: "inline-block",
                textAlign: "center",
              }}
              onClick={props.handleTemplateSave}
              className="menuLink"
            >
              Save
            </Link>
          )}
        </Grid>
      </Grid>
      <GeneralModal
        open={showTemplateModal}
        title={"Current Templates"}
        successCallback={undefined}
        closeCallback={closeModal}
        showContinueIcon={false}
        cancelButtonText="Back"
        width="600px"
        containerClassName="template-container"
      >
        <Grid item xs={12}>
          <NoteTemplateList />
        </Grid>
      </GeneralModal>
    </Grid>
  );
};

export default NoteTemplateForm;

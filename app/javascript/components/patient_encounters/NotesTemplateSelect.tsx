// Library Imports
import * as React from "react";
import {
  Modal,
  Grid,
  Link,
  Button,
  Card,
  CardContent,
} from "@mui/material";

// header import
import { getHeaders } from "../utils/HeaderHelper";

// app setting imports
import { AuthenticationContext } from "../Context";
import GeneralModal from "../modals/GeneralModal";

interface Props {
  templateModalOpen: boolean;
  setTemplateModalOpen: any;
  setTemplate: any;
}

const NotesTemplateSelect: React.FC<Props> = (props: any) => {
  const [templates, setTemplates] = React.useState<any>([]);
  const [selectedId, setSelectedId] = React.useState<string>("");
  const authenticationSetting = React.useContext(AuthenticationContext);

  const getTemplates = () => {
    fetch(`/data_fetching/notes_templates`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (!result.success) {
          console.log(result.error);
        } else {
          setTemplates(result.resource.notes_templates);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectTemplate = (id) => {
    setSelectedId(id);
  };

  const applyTemplate = () => {
    let template = templates.filter((template) => {
      return template.id == selectedId;
    })[0];
    // Fill in notes with the given block values
    props.setTemplate(template);
    props.setTemplateModalOpen(false);
  };

  React.useEffect(() => {
    getTemplates();
  }, []);
  return (
    <GeneralModal
      open={props.templateModalOpen}
      title={"Choose a Template"}
      successCallback={() => applyTemplate()}
      closeCallback={() => props.setTemplateModalOpen(false)}
      containerClassName="template-select-container template-container"
      width="600px"
    >
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        style={{ paddingTop: 20 }}
      >
        {templates.map((template) => {
          return (
            <Grid key={template.id} item xs={6} className="centerButton">
              <a
                onClick={() => {
                  selectTemplate(template.id);
                }}
                id={`template-${template.id}`}
                className={selectedId == template.id ? "active" : ""}
              >
                <Card style={{ margin: "10px" }} className="template-card">
                  <CardContent style={{ paddingBottom: "10px" }}>
                    {template.name}
                  </CardContent>
                </Card>
              </a>
            </Grid>
          );
        })}
      </Grid>
    </GeneralModal>
  );
};

export default NotesTemplateSelect;

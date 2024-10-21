import * as React from "react";
import { Grid, Button } from "@mui/material";
import IdleCheckModal from "../modals/IdleCheck";
import CategoryIcons from "../CategoryIcons";

const checkIcon = require("../../images/check.svg");

interface Props {
  csrfToken: string;
  categories: CategoryProps[];
  logo_src: string;
  button_src: string;
  token: string;
  uuid: string;
}

interface QuestionnaireProps {
  id: number;
  name: string;
}

type QuestionnaireItemProps = {
  alt: string;
  text: string;
  onClick?: () => void;
  selected?: boolean;
}

function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

type CategoryProps = {
  id: number;
  icon: string;
  display_name: string;
  db_name: string;
  questionnaires: QuestionnaireProps[];
}

type CategoryQuestionnaireProps = {
  category: CategoryProps;
  selectedQuestionnares: number[];
  onClick?: (id) => void;
}

const SelectQuestionnaires: React.FC<Props> = (props: any) => {
  const categories: CategoryProps[] = props.categories;
  const [selectedQuestionnares, setSelectedQuestionnares] = React.useState([] as number[]);
  // const categories: CategoryProps[] = Array.from(chunks(props.categories, 2));

  const handleCategoryClick = (questionnaireId: number) => {
    if (selectedQuestionnares.includes(questionnaireId)) {
      setSelectedQuestionnares(selectedQuestionnares.filter((item) => item !== questionnaireId));
    } else {
      setSelectedQuestionnares([...selectedQuestionnares, questionnaireId]);
    }
  }

  const onContinueClick = () => {
    window.location.href = `/guided_questionnaires/${props.qrId}/submissions/?token=${props.token}&selected_questionnaires=` + selectedQuestionnares.join(",");
  }

  const onBackClick = () => {
    window.location.href = `/guided_questionnaires/${props.qrId}?token=${props.token}&selected_categories=` + categories.map( (cate) => cate.id ).join(",");
  }

  const handleTimerExpire = () => {
    sessionStorage.clear();
    window.location.href = "/expired_qr?id=" + props.qrId;
  }

  return (
    <div style={{ minHeight: "86vh" }}>
      <div className="guided-questionnaire-container">
        {<IdleCheckModal onExpire={handleTimerExpire} />}
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            container
            direction="row"
            className="guided-questionnaire-container-inner"
          >
            <div className="guided-questionnaire-header-container">
              <div className="guided-questionnaire-logo-title-container">
                <img
                  src={props.logo_src}
                  alt="Project Starfield"
                  className="guided-questionnaire-logo"
                />
              </div>
              <div
                style={{
                  textAlign: "center",
                  paddingTop: 24,
                  paddingBottom: 24
                }}
              >
                <p
                  style={{
                    font: "20px QuicksandMedium",
                    fontWeight: "bold",
                    color: "#1e1e1e"
                  }}
                >
                  What can we help you with today?
                </p>
              </div>
            </div>
            <div className="guided-questionnaire-divider"></div>
            <div className="guided-questionnaire-content-container">
              <div className="guided-questionnaire-content-description-container">
                <p className="guided-questionnaire-content-description-text">
                  Select ALL questionnaires you
                </p>
                <p className="guided-questionnaire-content-description-text">
                  would like to fill out
                </p>
              </div>
              <div style={{paddingTop: 8}}>
                {
                  categories.map((category, index) => {
                    return (
                      <CategoryQuestionnaire key={index} category={category} onClick={handleCategoryClick} selectedQuestionnares={selectedQuestionnares} />
                    )
                  })
                }
                <div className="guided-questionnaire-show-categories-row-container" style={{justifyContent: "center"}}>
                  <Button variant="text" className="guided-questionnaire-category-back-btn" onClick={onBackClick}>
                    Back to categories
                  </Button>
                  <Button 
                    variant="contained" 
                    className="guided-questionnaire-category-continue-btn default-btn" 
                    disabled={selectedQuestionnares.length == 0}
                    onClick={onContinueClick}>
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
};

const CategoryQuestionnaire: React.FC<CategoryQuestionnaireProps> = (props: any) => {
  const {category, selectedQuestionnares} = props;
  const questionnaires: QuestionnaireProps[][] = Array.from(chunks(props.category.displayable_questionnaires, 2));

  return (
    <div className="guided-questionnaire-show-categories-row-container">
      <div className="guided-questionnaire-show-categories-category">
        {/* <img
          src={category.icon}
          alt={category.db_name}
          className="guided-questionnaire-category-item-icon"
        /> */}
        <CategoryIcons name={category.icon} fill="#A29D9B" className="guided-questionnaire-category-item-icon"/>

        <p className="guided-questionnaire-category-item-p">{category.display_name} Questionnaries</p>
      </div>
      {
        questionnaires.map((sliced_questionnaire, index) => {
          return (
            <div key={index} className="guided-questionnaire-category-row-container">
              {
                sliced_questionnaire.map((questionnaire) => {
                  return (
                    <QuestionnaireItem
                      key={questionnaire.id}
                      alt={questionnaire.name}
                      text={questionnaire.name}
                      onClick={() => props.onClick(questionnaire.id)}
                      selected={selectedQuestionnares.includes(questionnaire.id)}
                    />
                  )
                })
              }
               { sliced_questionnaire.length === 1 && <div className="guided-questionnaire-category-item" style={{visibility: "hidden"}}></div> }
            </div>
          )
        })
      }
    </div>
  )
}

const QuestionnaireItem: React.FC<QuestionnaireItemProps> = (props: any) => {
  const itemClassName = props.selected ? "guided-questionnaire-category-item selected" : "guided-questionnaire-category-item";

  return (
    <div className={itemClassName} onClick={props.onClick}>
      <div style={{textAlign: "center"}}>
        <div className="guided-questionnaire-category-item-text">
          {props.selected && <img src={checkIcon} style={{width: 24, height: 24}}/> }
          <span>{props.text}</span>
        </div>
      </div>
    </div>
  );
}

export default SelectQuestionnaires;
import * as React from "react";
import { Grid, Button } from "@mui/material";
import IdleCheckModal from "../modals/IdleCheck";
import CategoryIcons from "../CategoryIcons";
// import SVG from 'react-inlinesvg';

const checkIcon = require("../../images/check.svg");

interface Props {
  csrfToken: string;
  categories: CategoryProps[];
  logo_src: string;
  button_src: string;
  userName: string;
  userBirthDate: string;
  userMrnNumber: string;
  token: string;
  qrId: string;
}

interface CategoryItemProps {
  icon: string;
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
}


const CategoryItem: React.FC<CategoryItemProps> = (props: any) => {
  const itemClassName = props.selected ? "guided-questionnaire-category-item selected" : "guided-questionnaire-category-item";
  var color = props.selected ? "#FFFFFF" : "#A29D9B";

  return (
    <div className={itemClassName} onClick={props.onClick}>
      <div style={{textAlign: "center"}}>
        {/* <img
          src={props.icon}
          alt={props.alt}
          className="guided-questionnaire-category-item-icon"
        /> */}
        <CategoryIcons name={props.icon} fill={color} className="guided-questionnaire-category-item-icon"/>
        {/* <SVG
          src="https://cdn.svgporn.com/logos/react.svg"
          width={128}
          height="auto"
          title="React"
        /> */}
        <div className="guided-questionnaire-category-item-text">
          {props.selected && <img src={checkIcon} style={{width: 24, height: 24}}/> }
          <span>{props.text}</span>
        </div>
      </div>
    </div>
  );
}

const CategorySelect: React.FC<Props> = (props: any) => {
  const [selectedCategories, setSelectedCategories] = React.useState(props.selected_categories || [] as number[]);
  const categories: CategoryProps[][] = Array.from(chunks(props.categories, 2));

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  }

  const onContinueClick = () => {
    window.location.href = window.location.pathname + `/select_questionnaires?token=${props.token}&selected_categories=` + selectedCategories.join(",");
  }

  const handleTimerExpire = () => {
    sessionStorage.clear();
    window.location.href = "/expired_qr?id=" + props.qrId;
  }

  const oddCategories = !((props.categories.length % 2) === 0);
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
                  Welcome, {props.userName}!
                </p>
                <p
                  style={{
                    font: "20px QuicksandMedium",
                    fontWeight: "bold",
                    color: "#a29d9c"
                  }}
                >
                  {props.userBirthDate} | {props.userMrnNumber}
                </p>
              </div>
            </div>
            <div className="guided-questionnaire-divider"></div>
            <div className="guided-questionnaire-content-container">
              <div className="guided-questionnaire-content-description-container">
                <p className="guided-questionnaire-content-description-text">
                  How can we help you today?
                </p>
                <p className="guided-questionnaire-content-description-text">
                  Select ALL categories that relate to your visit.
                </p>
              </div>
              <div style={{paddingTop: 8, paddingLeft: 8, paddingRight: 8}}>
                {
                  categories.map((sliced_categories, index) => {
                    return (
                      <div key={index} className="guided-questionnaire-category-row-container">
                        {
                          sliced_categories.map((category, i) => {
                            return (
                              <CategoryItem
                                key={i}
                                icon={category.icon}
                                alt={category.db_name}
                                text={category.display_name}
                                onClick={() => handleCategoryClick(category.id)}
                                selected={selectedCategories.includes(category.id)}
                              />
                            )
                          })
                        }
                        { (oddCategories && index === categories.length - 1) && (
                            <div style={{width: '50%'}}>  </div>
                          )
                        }
                      </div>
                    )
                  })
                }
                <div className="guided-questionnaire-category-row-container" style={{justifyContent: "center"}}>
                  <Button 
                    variant="contained" 
                    className="guided-questionnaire-category-continue-btn default-btn" 
                    disabled={selectedCategories.length === 0}
                    onClick={onContinueClick}
                  >
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

export default CategorySelect;
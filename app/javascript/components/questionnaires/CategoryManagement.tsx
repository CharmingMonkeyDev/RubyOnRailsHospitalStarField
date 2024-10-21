import React, { FC, useEffect, useState } from "react";
import { Grid, Link } from "@mui/material";
import CategoryModal from "../modals/CategoryModal";
import ArchiveCategory from "../modals/ArchiveCategory";
import CreateIcon from "@mui/icons-material/Create";
import ArchiveIcon from "@mui/icons-material/Archive";
import AddIcon from "@mui/icons-material/Add";

// authorization
import { getHeaders } from "../utils/HeaderHelper";
import { AuthenticationContext } from "../Context";

interface Props {
  setCategoryOptions: any;
  renderingKey: number;
  setRenderingKey: any;
  onCategoryChange: Function;
}

const CategoryManagement: FC<Props> = (props: any) => {
  // authcontext
  const authenticationSetting = React.useContext(AuthenticationContext);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<any>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [archiveCatId, setArchiveCatId] = useState<string>("");

  //   inital data fetching
  useEffect(() => {
    getCategories();
  }, [props.renderingKey]);

  const getCategories = () => {
    fetch(`/questionnaire_categories`, {
      method: "GET",
      headers: getHeaders(authenticationSetting.csrfToken),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success == false) {
          alert(result.error);
        } else {
          if (result?.resource) {
            console.log(result);

            setCategories(result.resource);
          } else {
            alert("Something is wrong, cannot fetch categories");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleEditModalOpen = (catId) => {
    setSelectedCatId(catId);
  };

  useEffect(() => {
    if (selectedCatId) {
      setModalOpen(true);
    }
  }, [selectedCatId]);

  const handleArchiveCat = (catId) => {
    setArchiveCatId(catId);
    if (catId) {
      setArchiveModalOpen(true);
    }
  };

  return (
    <Grid
      container
      style={{
        padding: "10px",
        background: "#EFE9E7",
        marginTop: "15px",
        marginRight: "15px",
        borderRadius: "5px",
      }}
    >
      <Grid
        item
        xs={6}
        style={{
          color: "black",
          fontWeight: 700,
        }}
      >
        Custom Categories
      </Grid>
      <Grid
        item
        xs={6}
        style={{
          textAlign: "right",
        }}
      >
        <Link className="action-link add-encounter" onClick={showModal}>
          <AddIcon className="plus-icon plus-icon-with-ring" />
          <span
            className="app-user-text"
            style={{ color: "black", marginLeft: 10 }}
          >
            Add Category
          </span>
        </Link>
      </Grid>
      <Grid item xs={12}>
        {categories.map((cat) => {
          return (
            <Grid container key={cat.id}>
              <Grid item xs={10}>
                <p style={{ color: "black" }}>{cat.display_name}</p>
              </Grid>
              <Grid
                item
                xs={1}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Link onClick={() => handleEditModalOpen(cat.id)}>
                  <CreateIcon style={{ color: "grey" }} />
                </Link>
              </Grid>
              <Grid
                item
                xs={1}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Link onClick={() => handleArchiveCat(cat.id)}>
                  <ArchiveIcon style={{ color: "grey" }} />
                </Link>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <CategoryModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedCatId={selectedCatId}
        setRenderingKey={props.setRenderingKey}
        onCategoryChange={props.onCategoryChange}
      />
      <ArchiveCategory
        modalOpen={archiveModalOpen}
        setModalOpen={setArchiveModalOpen}
        selectedCatId={archiveCatId}
        setRenderingKey={props.setRenderingKey}
        onCategoryChange={props.onCategoryChange}
      />
    </Grid>
  );
};

export default CategoryManagement;

import React, { FC, useEffect, useState } from "react";
import { Grid, Link } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import ArchiveIcon from "@mui/icons-material/Archive";
import AddIcon from "@mui/icons-material/Add";

// authorization
import CategoryModal from "./CategoryModal";
import ArchiveCategory from "./ArchiveCategory";

interface Props {
  categories: any;
  renderingKey: number;
  setRenderingKey: any;
}

const CategoryManagement: FC<Props> = (props: any) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState<boolean>(false);
  const categories = props.categories;
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [selectedCatname, setSelectedCatname] = useState<string>("");
  const [archiveCatId, setArchiveCatId] = useState<string>("");

  //   inital data fetching
  useEffect(() => {
    // getCategories();
  }, [props.renderingKey]);

  const showModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleEditModalOpen = (catId) => {
    setSelectedCatId(catId);
    setSelectedCatname(categories.find((x) => x.id == catId)?.name);
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
            <Grid container key={cat.id} justifyContent="space-between">
              <Grid item>
                <p style={{ color: "black" }}>{cat.name}</p>
              </Grid>
              <Grid
                item
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <Link onClick={() => handleEditModalOpen(cat.id)}>
                  <CreateIcon style={{ color: "grey" }} />
                </Link>
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
        closeModal={() => {
          showModal();
          setSelectedCatId(null);
        }}
        selectedCatId={selectedCatId}
        setRenderingKey={props.setRenderingKey}
        categoryName={selectedCatname}
      />
      <ArchiveCategory
        modalOpen={archiveModalOpen}
        setModalOpen={setArchiveModalOpen}
        selectedCatId={archiveCatId}
        setRenderingKey={props.setRenderingKey}
      />
    </Grid>
  );
};

export default CategoryManagement;

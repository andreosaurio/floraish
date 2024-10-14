import React from "react";
import { Pagination } from "@mui/material";

const Paginate = ({ pages, page, isAdmin = false, searchTerm = "" }) => {
  const handleChange = (event, value) => {
    window.location.href = !isAdmin
      ? searchTerm
        ? `/search/${searchTerm}/page/${value}`
        : `/page/${value}`
      : `/admin/allproducts/${value}`;
  };

  return (
    pages > 1 && (
      <Pagination
        count={pages}
        page={page}
        variant="outlined"
        color="primary"
        onChange={handleChange}
        sx={{ margin: "20px 0" }} 
      />
    )
  );
};

export default Paginate;

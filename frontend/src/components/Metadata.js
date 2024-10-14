import React from "react";
import { Helmet } from "react-helmet-async";

const Metadata = ({ title, description, searchTerms }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="searchTerm" content={searchTerms} />
    </Helmet>
  );
};

Metadata.defaultProps = {
  title: "Floraish - Tu Tienda de Plantas Online",
  description:
    "Descubre una amplia variedad de plantas para embellecer tu hogar. Calidad y frescura garantizadas.",
  searchTerms:
    "plantas, comprar plantas, plantas online, decoración de interiores, jardinería, cuidados de plantas",
};

export default Metadata;

import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find, simpleData, stats, productsByReview, shareProduct, importFromShopify, exportToExcel, catalouge, findOne, update, _delete, search, findByPrice, findNRandom, findNTrending, findNSelling, findNRandomInCategory, productImport, bulkUpdate, bulkUpload } from "../controllers/product.js";
import { validateCreateBody, importFromShopify as _importFromShopify, validateUpdateBody, filterValidator, productBulkUpdate } from "../middlewares/product.js";
import upload from './../../../services/fileUploader.js'
const permissions = [
  {
    api: "products",
    endpoint: "/api/products",
    method: "POST",
    handler: "Create Product",
  },
  {
    api: "products",
    endpoint: "/api/products",
    method: "GET",
    handler: "List Products",
  },
  {
    api: "products",
    endpoint: "/api/products/create-pdf/:id",
    method: "GET",
    handler: "Create PDF for Product",
  },
  {
    api: "products",
    endpoint: "/api/products/:id",
    method: "GET",
    handler: "Find Product",
  },
  {
    api: "products",
    endpoint: "/api/products/:id",
    method: "PUT",
    handler: "Update Product",
  },
  {
    api: "products",
    endpoint: "/api/products/:id",
    method: "DELETE",
    handler: "Delete Product",
  },
  {
    api: "products",
    endpoint: "/api/search/products",
    method: "GET",
    handler: "Search Products",
  },
  {
    api: "products",
    endpoint: "/api/products/filter/price",
    method: "GET",
    handler: "Filter Products by Price",
  },
  {
    api: "products",
    endpoint: "/api/products/:n/random",
    method: "GET",
    handler: "Find N Random Products",
  },
  {
    api: "products",
    endpoint: "/api/products/:n/random/category/:id",
    method: "GET",
    handler: "Find N Random Products in Category",
  },
  {
    api: "products",
    endpoint: "/api/products/:n/trending",
    method: "GET",
    handler: "Find Trending Products",
  },
  {
    api: "products",
    endpoint: "/api/products/:n/trending",
    method: "GET",
    handler: "Find Top Selling Products",
  },
  {
    api: "products",
    endpoint: "/api/products/export",
    method: "POST",
    handler: "Export Products",
  },
  {
    api: "products",
    endpoint: "/api/products/simple-data",
    method: "GET",
    handler: "Get product's id and name",
  },
  {
    api: "products",
    endpoint: "/api/products/import/shopify",
    method: "POST",
    handler: "Import Product From Shopify",
  },
  {
    api: "products",
    endpoint: "/api/products/import/reseller",
    method: "POST",
    handler: "Import Product For Reseller",
  },
];

export default (app) => {
  router.post("/products", [RBAC, validateCreateBody], create);
  router.get("/products", find);
  router.get("/products/simple-data", simpleData);
  router.get("/products/stats", stats);
  router.get("/products/reviews-list", productsByReview);
  router.post("/products/bulkupload", upload.single("/products/file"), bulkUpload);
  router.post("/products/:id/share", shareProduct);
  router.post("/products/import/shopify", [RBAC, _importFromShopify], importFromShopify);
  router.post("/products/import/reseller", [RBAC,], productImport);
  router.post("/products/export", [RBAC], exportToExcel);
  router.get("/products/create-pdf/:id", catalouge);
  router.get("/products/:id", findOne);
  router.put("/products/bulkupdate", [productBulkUpdate], bulkUpdate);
  router.put("/products/:id", [RBAC, validateUpdateBody], update);
  router.delete("/products/:id", [RBAC], _delete);
  router.get("/search/products", [], search);
  router.get("/products/filter/price", [filterValidator], findByPrice);
  router.get("/products/:n/random", findNRandom);
  router.get("/products/:n/trending", findNTrending);
  router.get("/products/:n/selling", findNSelling);
  router.get("/products/:n/random/category/:id", findNRandomInCategory);
  app.use("/api", router);
};

const _permissions = permissions;
export { _permissions as permissions };

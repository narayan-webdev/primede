import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find, findOne, update, _delete, getProducts, searchInCategory } from "../controllers/category_type.js";
import { validateCreateRequest, validateUpdateRequest } from "../middlewares/category_type.js";

const permissions = [
  {
    api: "category-type",
    endpoint: "/api/category-types",
    method: "POST",
    handler: "Create category",
  },
  {
    api: "category-type",
    endpoint: "/api/category-types",
    method: "GET",
    handler: "List categories",
  },
  {
    api: "category-type",
    endpoint: "/api/category-types/:id",
    method: "GET",
    handler: "List Single category",
  },
  {
    api: "category-type",
    endpoint: "/api/category-types/:id",
    method: "PUT",
    handler: "Update category",
  },
  {
    api: "category-type",
    endpoint: "/api/category-types/:id",
    method: "DELETE",
    handler: "Delete category",
  },
  {
    api: "category-type",
    endpoint: "/api/category-types/:id/products",
    method: "GET",
    handler: "List Category's products",
  },
  {
    api: "category-type",
    endpoint: "/api/category-types/:id/products/search",
    method: "GET",
    handler: "Search Category's products",
  },
];

export default (app) => {
  router.post("/", [validateCreateRequest], create);
  router.get("/", find);
  router.get("/:id", findOne);
  router.put("/:id", [validateUpdateRequest], update);
  router.delete("/:id", _delete);
  // router.get("/:id/products", getProducts);
  // router.get("/:id/products/search", [search], searchInCategory);
  app.use("/api/category-types", router);
};
const _permissions = permissions;
export { _permissions as permissions };
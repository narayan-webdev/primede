import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { search } from "../../../middlewares/queryValidator.js";
import { create, find, findOne, update, _delete, getProducts, searchInCategory } from "../controllers/category.js";
import { validateCreateRequest, validateUpdateRequest } from "../middlewares/category.js";

const permissions = [
  {
    api: "category",
    endpoint: "/api/categories",
    method: "POST",
    handler: "Create category",
  },
  {
    api: "category",
    endpoint: "/api/categories",
    method: "GET",
    handler: "List categories",
  },
  {
    api: "category",
    endpoint: "/api/categories/:id",
    method: "GET",
    handler: "List Single category",
  },
  {
    api: "category",
    endpoint: "/api/categories/:id",
    method: "PUT",
    handler: "Update category",
  },
  {
    api: "category",
    endpoint: "/api/categories/:id",
    method: "DELETE",
    handler: "Delete category",
  },
  {
    api: "category",
    endpoint: "/api/categories/:id/products",
    method: "GET",
    handler: "List Category's products",
  },
  {
    api: "category",
    endpoint: "/api/categories/:id/products/search",
    method: "GET",
    handler: "Search Category's products",
  },
];

export default (app) => {
  router.post("/", [RBAC, validateCreateRequest], create);
  router.get("/", find);
  router.get("/:id", findOne);
  router.put("/:id", [RBAC, validateUpdateRequest], update);
  router.delete("/:id", [RBAC], _delete);
  router.get("/:id/products", getProducts);
  router.get("/:id/products/search", [search], searchInCategory);
  app.use("/api/categories", router);
};
const _permissions = permissions;
export { _permissions as permissions };
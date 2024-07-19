import { Router } from "express";
const router = Router();
import StoreRBAC from "../../../middlewares/StoreRBAC.js";
import { create, update, find, findOne, _delete, findProducts } from "../controllers/sub_category.js";
import { validateCreateRequest, validateUpdateRequest } from "../middlewares/sub_category.js";

const permissions = [
  {
    api: "sub-categories",
    endpoint: "/api/sub-categories",
    method: "POST",
    handler: "Create Sub-Category",
  },
  {
    api: "sub-categories",
    endpoint: "/api/sub-categories/:id",
    method: "PUT",
    handler: "Update Sub-Category",
  },
  {
    api: "sub-categories",
    endpoint: "/api/sub-categories",
    method: "GET",
    handler: "Get Sub-Categories",
  },
  {
    api: "sub-categories",
    endpoint: "/api/sub-categories/:id",
    method: "GET",
    handler: "Get Sub-Category by ID",
  },
  {
    api: "sub-categories",
    endpoint: "/api/sub-categories/:id",
    method: "DELETE",
    handler: "Remove Sub-Category",
  },
];

export default (app) => {
  router.post("/", [StoreRBAC, validateCreateRequest], create);
  router.put("/:id", [StoreRBAC, validateUpdateRequest], update);
  router.get("/", [], find);
  router.get("/:id/products", [], findProducts);
  router.get("/:id", [], findOne);
  router.delete("/:id", [StoreRBAC], _delete);

  app.use("/api/sub-categories", router);
};

const _permissions = permissions;
export { _permissions as permissions };

import { Router } from "express";
const router = Router();
import { create, update, find, findOne, _delete, getProductsByCollection, searchProductsInCollection } from "../controllers/collection.js";
import { validateCreateCollection, validateUpdateCollection } from "../middlewares/collection.js";
import RABC from "../../../middlewares/RBAC.js";
import { search } from "../../../middlewares/queryValidator.js";


const permissions = [
  {
    api: "collection",
    endpoint: "/api/collections",
    method: "POST",
    handler: "Create collection",
  },
  {
    api: "collection",
    endpoint: "/api/collections",
    method: "GET",
    handler: "List collections",
  },
  {
    api: "collection",
    endpoint: "/api/collections/:id",
    method: "GET",
    handler: "List Single collection",
  },
  {
    api: "collection",
    endpoint: "/api/collections/:id",
    method: "PUT",
    handler: "Update collection",
  },
  {
    api: "collection",
    endpoint: "/api/collections/:id",
    method: "DELETE",
    handler: "Delete collection",
  },
  {
    api: "collection",
    endpoint: "/api/collections/:id/products",
    method: "GET",
    handler: "List collection's products",
  },
  {
    api: "collection",
    endpoint: "/api/collections/:id/products/search",
    method: "GET",
    handler: "Search collection's products",
  },
];


router.post("/", [RABC, validateCreateCollection], create);
router.put("/:id", [RABC, validateUpdateCollection], update);
router.get("/", find);
router.get("/:id", findOne);
router.delete("/:id", [RABC,], _delete);
router.get("/:id/products", getProductsByCollection);
router.get("/:id/products/search", [search], searchProductsInCollection);

export default (app) => {
  app.use("/api/collections", router);
};

const _permissions = permissions;
export { _permissions as permissions };

import { Router } from "express";
const router = Router();
import StoreRBAC from "../../../middlewares/StoreRBAC.js";
import { create, find, findOne, update, _delete } from "../controllers/ship_rocket_orderitem.js";
import { validateCreateOrderItem, validateUpdateOrderItem } from "../middlewares/ship_rocket_orderitem.js";

const permissions = [
  {
    api: "ship-rocket-order-items",
    endpoint: "/api/ship-rocket-order-items",
    method: "POST",
    handler: "Create Ship Rocket Order Item",
  },
  {
    api: "ship-rocket-order-items",
    endpoint: "/api/ship-rocket-order-items",
    method: "GET",
    handler: "List Ship Rocket Order Items",
  },
  {
    api: "ship-rocket-order-items",
    endpoint: "/api/ship-rocket-order-items/:id",
    method: "GET",
    handler: "Get Ship Rocket Order Item by ID",
  },
  {
    api: "ship-rocket-order-items",
    endpoint: "/api/ship-rocket-order-items/:id",
    method: "PUT",
    handler: "Update Ship Rocket Order Item",
  },
  {
    api: "ship-rocket-order-items",
    endpoint: "/api/ship-rocket-order-items/:id",
    method: "DELETE",
    handler: "Delete Ship Rocket Order Item",
  },
];

export default (app) => {
  router.post("/", [StoreRBAC], validateCreateOrderItem, create);
  router.get("/", [StoreRBAC], find);
  router.get("/:id", [StoreRBAC], findOne);
  router.put("/:id", [StoreRBAC], validateUpdateOrderItem, update);
  router.delete("/:id", [StoreRBAC], _delete);

  app.use("/api/ship-rocket-order-items", router);
};

const _permissions = permissions;
export { _permissions as permissions };

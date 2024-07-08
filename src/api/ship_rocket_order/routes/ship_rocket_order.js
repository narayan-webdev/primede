import { Router } from "express";
const router = Router();
import StoreRBAC from "../../../middlewares/StoreRBAC.js";
import { create, _delete as destroy, find, findOne, productReturn, update, webhook, pickupAddresses } from "../controllers/ship_rocket_order.js";
import { validateShipRocketOrder, validateShipRocketReturn } from "../middlewares/ship_rocket_order.js";

const permissions = [
  {
    api: "ship-rocket-orders",
    endpoint: "/api/ship-rocket-orders",
    method: "POST",
    handler: "Create Ship Rocket Order",
  },
  {
    api: "ship-rocket-orders",
    endpoint: "/api/ship-rocket-orders/return",
    method: "POST",
    handler: "Create Ship Rocket Return",
  },
  {
    api: "ship-rocket-orders",
    endpoint: "/api/ship-rocket-orders/webhook",
    method: "POST",
    handler: "Ship Rocket Webhook",
  },
  {
    api: "ship-rocket-orders",
    endpoint: "/api/ship-rocket-orders",
    method: "GET",
    handler: "List Ship Rocket Orders",
  },
  {
    api: "ship-rocket-orders",
    endpoint: "/api/ship-rocket-orders/:id",
    method: "GET",
    handler: "Get Ship Rocket Order by ID",
  },
  {
    api: "ship-rocket-orders",
    endpoint: "/api/ship-rocket-orders/:id",
    method: "PUT",
    handler: "Update Ship Rocket Order",
  },
  {
    api: "ship-rocket-orders",
    endpoint: "/api/ship-rocket-orders/:id",
    method: "DELETE",
    handler: "Delete Ship Rocket Order",
  },
  {
    api: "ship-rocket-orders",
    endpoint: "/api/ship-rocket-orders/address",
    method: "GET",
    handler: "Ship Rocket Pickup addresses",
  },
];

export default (app) => {
  router.post("/", [StoreRBAC], validateShipRocketOrder, create);
  router.post("/return", [StoreRBAC], validateShipRocketReturn, productReturn);
  router.post("/webhook", [StoreRBAC], pickupAddresses);
  router.get("/address", pickupAddresses);
  router.get("/", [StoreRBAC], find);
  router.get("/:id", [StoreRBAC], findOne);
  router.put("/:id", [StoreRBAC], validateShipRocketOrder, update);
  router.delete("/:id", [StoreRBAC], destroy);

  app.use("/api/ship-rocket-orders", router);
};

const _permissions = permissions;
export { _permissions as permissions };

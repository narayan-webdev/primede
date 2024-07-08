import { Router } from "express";
const router = Router();
import { create, find, findOne, update, _delete } from "../controllers/order_status_tracker.js";
import { validateRequest } from "../middlewares/order_status_tracker.js";
import RBAC from "../../../middlewares/RBAC.js";

const permissions = [
  {
    api: "order-status-trackers",
    endpoint: "/api/order-status-trackers",
    method: "POST",
    handler: "Create Order Status Tracker",
  },
  {
    api: "order-status-trackers",
    endpoint: "/api/order-status-trackers",
    method: "GET",
    handler: "List Order Status Trackers",
  },
  {
    api: "order-status-trackers",
    endpoint: "/api/order-status-trackers/:id",
    method: "GET",
    handler: "Find Order Status Tracker",
  },
  {
    api: "order-status-trackers",
    endpoint: "/api/order-status-trackers/:id",
    method: "PUT",
    handler: "Update Order Status Tracker",
  },
  {
    api: "order-status-trackers",
    endpoint: "/api/order-status-trackers/:id",
    method: "DELETE",
    handler: "Delete Order Status Tracker",
  },
];

export default (app) => {
  router.post("/", [RBAC], validateRequest, create);
  router.get("/", find);
  router.get("/:id", findOne);
  router.put("/:id", [RBAC], validateRequest, update);
  router.delete("/:id", [RBAC], _delete);
  app.use("/api/order-status-trackers", router);
};

const _permissions = permissions;
export { _permissions as permissions };

import { Router } from "express";
const router = Router();
import { create, find, findOne, update, _delete } from "../controllers/notification.js";
import { validateRequest } from "../middlewares/notification.js";
import RBAC from "../../../middlewares/RBAC.js";

const permissions = [
  {
    api: "notifications",
    endpoint: "/api/notifications",
    method: "POST",
    handler: "Create Notification",
  },
  {
    api: "notifications",
    endpoint: "/api/notifications",
    method: "GET",
    handler: "List Notifications",
  },
  {
    api: "notifications",
    endpoint: "/api/notifications/:id",
    method: "GET",
    handler: "Find Notification",
  },
  {
    api: "notifications",
    endpoint: "/api/notifications/:id",
    method: "PUT",
    handler: "Update Notification",
  },
  {
    api: "notifications",
    endpoint: "/api/notifications/:id",
    method: "DELETE",
    handler: "Delete Notification",
  },
];

export default (app) => {
  router.post("/",[RBAC], validateRequest, create);
  router.get("/",[RBAC], find);
  router.get("/:id",[RBAC], findOne);
  router.put("/:id",[RBAC], validateRequest, update);
  router.delete("/:id",[RBAC], _delete);
  app.use("/api/notifications", router);
};

const _permissions = permissions;
export { _permissions as permissions };

import { Router } from "express";
const router = Router();
import { create, find, update, _delete } from "../controllers/activity_log.js";
import { validateActivityLog } from "../middlewares/activity_log.js";
import RBAC from "../../../middlewares/RBAC.js";

const permissions = [
  {
    api: "activity-logs",
    endpoint: "/api/activity-logs",
    method: "POST",
    handler: "Create Activity Log",
  },
  {
    api: "activity-logs",
    endpoint: "/api/activity-logs",
    method: "GET",
    handler: "List Activity Logs",
  },
  {
    api: "activity-logs",
    endpoint: "/api/activity-logs/:id",
    method: "PUT",
    handler: "Update Activity Log",
  },
  {
    api: "activity-logs",
    endpoint: "/api/activity-logs/:id",
    method: "DELETE",
    handler: "Delete Activity Log",
  },
];

export default (app) => {
  router.post("/", [RBAC], validateActivityLog, create);
  router.get("/", [RBAC], find);
  router.put("/:id", [RBAC], validateActivityLog, update);
  // router.get("/:id", activityLogController.findOne);
  router.delete("/:id", [RBAC], _delete);
  app.use("/api/activity-logs", router);
};
const _permissions = permissions;
export { _permissions as permissions };

import { Router } from "express";
const router = Router();
import { create, find, findOne, update, _delete } from "../controllers/group.js";
import { validateRequest } from "../middlewares/group.js";
import RABC from "../../../middlewares/RBAC.js";

const permissions = [
  {
    api: "groups",
    endpoint: "/api/groups",
    method: "POST",
    handler: "Create Group",
  },
  {
    api: "groups",
    endpoint: "/api/groups",
    method: "GET",
    handler: "List Groups",
  },
  {
    api: "groups",
    endpoint: "/api/groups/:id",
    method: "GET",
    handler: "Find Group",
  },
  {
    api: "groups",
    endpoint: "/api/groups/:id",
    method: "PUT",
    handler: "Update Group",
  },
  {
    api: "groups",
    endpoint: "/api/groups/:id",
    method: "DELETE",
    handler: "Delete Group",
  },
];

export default (app) => {
  router.post("/",[RABC], validateRequest, create);
  router.get("/",[RABC], find);
  router.get("/:id",[RABC], findOne);
  router.put("/:id",[RABC], validateRequest, update);
  router.delete("/:id",[RABC], _delete);
  app.use("/api/groups", router);
};

const _permissions = permissions;
export { _permissions as permissions };

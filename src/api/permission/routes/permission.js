import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find, staffPermission, findOne, update, _delete, generateLists } from "../controllers/permission.js";
import { validateRequest } from "../middlewares/permission.js";

const permissions = [
  {
    api: "permissions",
    endpoint: "/api/permissions",
    method: "POST",
    handler: "Create Permission",
  },
  {
    api: "permissions",
    endpoint: "/api/permissions",
    method: "GET",
    handler: "List Permissions",
  },
  {
    api: "permissions",
    endpoint: "/api/permissions/:id",
    method: "GET",
    handler: "Find Permission",
  },
  {
    api: "permissions",
    endpoint: "/api/permissions/:id",
    method: "PUT",
    handler: "Update Permission",
  },
  {
    api: "permissions",
    endpoint: "/api/permissions/:id",
    method: "DELETE",
    handler: "Delete Permission",
  },
  {
    api: "permissions",
    endpoint: "/api/permissions/bulk/generate",
    method: "GET",
    handler: "Generate Permission Lists",
  },
  {
    api: "permissions",
    endpoint: "/api/permissions/staff",
    method: "GET",
    handler: "Generate Staff Permission Lists",
  },
];

export default (app) => {
  router.post("/", [validateRequest], create);
  router.get("/", [], find);
  router.get("/staff", [], staffPermission);
  router.get("/:id", [], findOne);
  router.put("/:id", [RBAC], update);
  router.delete("/:id", [RBAC], _delete);
  router.get("/bulk/generate", [RBAC], generateLists);
  app.use("/api/permissions", router);
};

const _permissions = permissions;
export { _permissions as permissions };

import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find, findOne, update, _delete } from "../controllers/role.js";
import { validateCreateBody, validateUpdateBody } from "../middlewares/role.js";

const permissions = [
  {
    api: "roles",
    endpoint: "/api/roles",
    method: "POST",
    handler: "Create Role",
  },
  {
    api: "roles",
    endpoint: "/api/roles",
    method: "GET",
    handler: "List Roles",
  },
  {
    api: "roles",
    endpoint: "/api/roles/:id",
    method: "GET",
    handler: "Find Role",
  },
  {
    api: "roles",
    endpoint: "/api/roles/:id",
    method: "PUT",
    handler: "Update Role",
  },
  {
    api: "roles",
    endpoint: "/api/roles/:id",
    method: "DELETE",
    handler: "Delete Role",
  },
];

export default (app) => {
  router.post("/", [RBAC, validateCreateBody], create);
  router.get("/", find);
  router.get("/:id", [RBAC], findOne);
  router.put("/:id", [RBAC, validateUpdateBody], update);
  router.delete("/:id", [RBAC], _delete);
  app.use("/api/roles", router);
};

// module.exports.permissions = permissions;

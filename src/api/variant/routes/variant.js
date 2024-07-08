import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find, findOne, update, _delete } from "../controllers/variant.js";
import { updateBody, createBody } from "../middlewares/variant.js";

const permissions = [
  {
    api: "variants",
    endpoint: "/api/variants",
    method: "POST",
    handler: "Create Variant",
  },
  {
    api: "variants",
    endpoint: "/api/variants",
    method: "GET",
    handler: "List Variants",
  },
  {
    api: "variants",
    endpoint: "/api/variants/:id",
    method: "GET",
    handler: "Find One Variant",
  },
  {
    api: "variants",
    endpoint: "/api/variants/:id",
    method: "PUT",
    handler: "Update Variant",
  },
  {
    api: "variants",
    endpoint: "/api/variants/:id",
    method: "DELETE",
    handler: "Delete Variant",
  },
];

export default (app) => {
  router.post("/", createBody, create);
  router.get("/", find);
  router.get("/:id", findOne);
  router.put("/:id", updateBody, update);
  router.delete("/:id", _delete);
  app.use("/api/variants", router);
};

// Exporting the permissions array separately
const _permissions = permissions;
export { _permissions as permissions };

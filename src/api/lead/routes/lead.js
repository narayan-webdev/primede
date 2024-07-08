import { Router } from "express";
const router = Router();
import { create, find, stats, exportLeads, findOne, update, _delete, search } from "../controllers/lead.js";
import { createLeadValidate, updateLeadValidate } from "../middlewares/lead.js";
import RBAC from "../../../middlewares/RBAC.js";
import { search as _search } from "../../../middlewares/queryValidator.js";

const permissions = [
  {
    api: "store-leads",
    endpoint: "/api/leads",
    method: "POST",
    handler: "Create Store Lead",
  },
  {
    api: "store-leads",
    endpoint: "/api/leads",
    method: "GET",
    handler: "List Store Leads",
  },
  {
    api: "store-leads",
    endpoint: "/api/leads/export",
    method: "POST",
    handler: "Export Store Leads To Excel",
  },
  {
    api: "store-leads",
    endpoint: "/api/leads/:id",
    method: "GET",
    handler: "Get Store Lead by ID",
  },
  {
    api: "store-leads",
    endpoint: "/api/leads/:id",
    method: "PUT",
    handler: "Update Store Lead",
  },
  {
    api: "store-leads",
    endpoint: "/api/leads/:id",
    method: "DELETE",
    handler: "Delete Store Lead",
  },
  {
    api: "store-leads",
    endpoint: "/api/leads/search",
    method: "GET",
    handler: "Search Store Leads",
  },
];

export default (app) => {
  router.post("/", [createLeadValidate], create);
  router.get("/", [RBAC], find);
  router.get("/stats", [], stats);
  router.post("/export", exportLeads);
  router.get("/:id", [RBAC], findOne);
  router.put("/:id", [RBAC, updateLeadValidate], update);
  router.delete("/:id", [RBAC], _delete);
  router.get("/search", [RBAC, _search], search);
  app.use("/api/leads", router);
};

const _permissions = permissions;
export { _permissions as permissions };

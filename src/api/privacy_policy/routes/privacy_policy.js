import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find } from "../controllers/privacy_policy.js";
import { validateRequest } from "../middlewares/privacy_policy.js";

const permissions = [
  {
    api: "privacy-policy",
    endpoint: "/api/privacy-policy",
    method: "POST",
    handler: "Create Privacy Policy",
  },
  {
    api: "privacy-policy",
    endpoint: "/api/privacy-policy",
    method: "GET",
    handler: "List Privacy Policies",
  },
];

export default (app) => {
  router.post("/", validateRequest, create);
  router.get("/", find);
  app.use("/api/privacy-policy", router);
};

const _permissions = permissions;
export { _permissions as permissions };

import { Router } from "express";
const router = Router();
import { create, find } from "../controllers/global_brand.js";
import { validateRequest } from "../middlewares/global_brand.js";
import RBAC from "../../../middlewares/RBAC.js";

const permissions = [
  {
    api: "global-brands",
    endpoint: "/api/global-brands",
    method: "POST",
    handler: "Create Global Brand",
  },
  {
    api: "global-brands",
    endpoint: "/api/global-brands",
    method: "GET",
    handler: "List Global Brands",
  },
];

export default (app) => {
  router.post("/", [RBAC, validateRequest], create);
  router.get("/", find);

  app.use("/api/global-brands", router);
};

const _permissions = permissions;
export { _permissions as permissions };

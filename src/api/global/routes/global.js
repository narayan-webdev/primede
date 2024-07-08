import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find } from "../controllers/global.js";
import { validateRequest } from "../middlewares/global.js";

const permissions = [
  {
    api: "globals",
    endpoint: "/api/globals",
    method: "POST",
    handler: "Create  Global",
  },
  {
    api: "globals",
    endpoint: "/api/globals",
    method: "GET",
    handler: "List  Globals",
  },
];

export default (app) => {
  router.post("/", [RBAC, validateRequest], create);
  router.get("/", [validateRequest], find);
  app.use("/api/globals", router);
};

const _permissions = permissions;
export { _permissions as permissions };

import { Router } from "express";
const router = Router();
import { create, find } from "../controllers/setting.js";
import { validateRequest } from "../middlewares/setting.js";

const permissions = [
  {
    api: "store-settings",
    endpoint: "/api/settings",
    method: "POST",
    handler: "Create Store Setting",
  },
  {
    api: "store-settings",
    endpoint: "/api/settings",
    method: "GET",
    handler: "Find Store Settings",
  },
];

export default (app) => {
  router.post("/", validateRequest, create);
  router.get("/", find);
  app.use("/api/settings", router);
};

const _permissions = permissions;
export { _permissions as permissions };

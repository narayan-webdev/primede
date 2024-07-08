import { Router } from "express";
const router = Router();
import { create, update, find, findOne, _delete } from "../controllers/campaign.js";
import RABC from "../../../middlewares/RBAC.js";
import { validateRequest } from "../middlewares/campaign.js";

const permissions = [
  {
    api: "campaigns",
    endpoint: "/api/campaigns",
    method: "POST",
    handler: "Create campaigns",
  },
  {
    api: "campaigns",
    endpoint: "/api/campaigns",
    method: "GET",
    handler: "List campaigns",
  },
  {
    api: "campaigns",
    endpoint: "/api/campaigns/:id",
    method: "GET",
    handler: "List Single campaigns",
  },
  {
    api: "campaigns",
    endpoint: "/api/campaigns/:id",
    method: "POST",
    handler: "Update campaigns",
  },
  {
    api: "campaigns",
    endpoint: "/api/campaigns/:id",
    method: "DELETE",
    handler: "Delete campaigns",
  },
];

export default (app) => {
  // Define routes for the "Campaign" resource
  router.post("/", [RABC, validateRequest], create);
  router.put("/:id", [RABC, validateRequest], update);
  router.get("/", [RABC], find);
  router.get("/:id", [RABC], findOne);
  router.delete("/:id", [RABC], _delete);
  // Use the router in the app
  app.use("/api/campaigns", router);
};
const _permissions = permissions;
export { _permissions as permissions };

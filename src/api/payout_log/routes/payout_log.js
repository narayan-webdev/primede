import { Router } from "express";
const router = Router();
import { create, find, findOne, update, _delete } from "../controllers/payout_log.js";
import { validateRequest } from "../middlewares/payout_log.js";

const permissions = [
  {
    api: "payout-logs",
    endpoint: "/api/payout-logs",
    method: "POST",
    handler: "Create Payout Log",
  },
  {
    api: "payout-logs",
    endpoint: "/api/payout-logs",
    method: "GET",
    handler: "List Payout Logs",
  },
  {
    api: "payout-logs",
    endpoint: "/api/payout-logs/:id",
    method: "GET",
    handler: "Find Payout Log",
  },
  {
    api: "payout-logs",
    endpoint: "/api/payout-logs/:id",
    method: "PUT",
    handler: "Update Payout Log",
  },
  {
    api: "payout-logs",
    endpoint: "/api/payout-logs/:id",
    method: "DELETE",
    handler: "Delete Payout Log",
  },
];

export default (app) => {
  router.post("/", validateRequest, create);
  router.get("/", find);
  router.get("/:id", findOne);
  router.put("/:id", validateRequest, update);
  router.delete("/:id", _delete);
  app.use("/api/payout-logs", router);
};

const _permissions = permissions;
export { _permissions as permissions };

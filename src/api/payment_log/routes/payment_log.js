import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find, findOne, update, _delete } from "../controllers/payment_log.js";

// Define routes for the "Post" resource
const permissions = [
  {
    api: "payment-logs",
    endpoint: "/api/payment-logs",
    method: "POST",
    handler: "Create Payment Log",
  },
  {
    api: "payment-logs",
    endpoint: "/api/payment-logs",
    method: "GET",
    handler: "List All Payment Logs",
  },
  {
    api: "payment-logs",
    endpoint: "/api/payment-logs/:id",
    method: "GET",
    handler: "List Single Payment Logs",
  },
  {
    api: "payment-logs",
    endpoint: "/api/payment-logs/:id",
    method: "PUT",
    handler: "Update Payment Log",
  },
  {
    api: "payment-logs",
    endpoint: "/api/payment-logs/:id",
    method: "DELETE",
    handler: "Delete Payment Log",
  },
];
export default (app) => {
  router.post("/", [RBAC], create);
  router.get("/", [RBAC], find);
  router.get("/:id", [RBAC], findOne);
  router.put("/:id", [RBAC], update);
  router.delete("/:id", [RBAC], _delete);
  app.use("/api/payment-logs", router);
};
const _permissions = permissions;
export { _permissions as permissions };

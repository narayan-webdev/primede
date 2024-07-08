import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find, exportToExcel, findOne } from "../controllers/transaction.js";
import { validateRequest } from "../middlewares/transaction.js";

const permissions = [
  {
    api: "transactions",
    endpoint: "/api/transactions",
    method: "POST",
    handler: "Create Transaction",
  },
  {
    api: "transactions",
    endpoint: "/api/transactions",
    method: "GET",
    handler: "List Transactions",
  },
  {
    api: "transactions",
    endpoint: "/api/transactions/export",
    method: "GET",
    handler: "Export Transactions to excel",
  },
  {
    api: "transactions",
    endpoint: "/api/transactions/:id",
    method: "GET",
    handler: "Find One Transaction",
  },
  // Add more permissions as needed for update and delete operations
];

export default (app) => {
  router.post("/", [RBAC, validateRequest], create);
  router.get("/", [RBAC], find);
  router.get("/export", exportToExcel);
  router.get("/:id", [RBAC], findOne);
  // Uncomment the following lines when you have the corresponding controllers and middleware
  // router.put("/:id", [RBAC, validateRequest], transactionController.update);
  // router.delete("/:id", [RBAC], transactionController.delete);

  // You can pass the permissions array along with the router
  app.use("/api/transactions", router);
};

const _permissions = permissions;
export { _permissions as permissions };

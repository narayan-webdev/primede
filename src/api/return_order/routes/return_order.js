import { Router } from "express";
const router = Router();
import { create, find, findOne, update, _delete } from "../controllers/return_order.js";

const permissions = [
  {
    api: "return-orders",
    endpoint: "/api/return-orders",
    method: "POST",
    handler: "Create Return",
  },
  {
    api: "return-orders",
    endpoint: "/api/return-orders",
    method: "GET",
    handler: "List Return-orders",
  },
  {
    api: "return-orders",
    endpoint: "/api/return-orders/:id",
    method: "GET",
    handler: "Find Return",
  },
  {
    api: "return-orders",
    endpoint: "/api/return-orders/:id",
    method: "PUT",
    handler: "Update Return",
  },
  {
    api: "return-orders",
    endpoint: "/api/return-orders/:id",
    method: "DELETE",
    handler: "Delete Return",
  },
];

export default (app) => {
  router.post("/", create);
  router.get("/", find);
  router.get("/:id", findOne);
  router.put("/:id", update);
  router.delete("/:id", _delete);
  app.use("/api/return-orders", router);
};

const _permissions = permissions;
export { _permissions as permissions };

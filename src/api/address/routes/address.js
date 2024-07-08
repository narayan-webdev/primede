import { Router } from "express";
const router = Router();
import { create, userAddress, search, find, findOne, update, _delete } from "../controllers/address.js";
import { addAddress, updateAddress } from "../middlewares/address.js";
import RBAC from "../../../middlewares/RBAC.js";

const permissions = [
  {
    api: "address",
    endpoint: "/api/address",
    method: "POST",
    handler: "Create Address",
  },
  {
    api: "address",
    endpoint: "/api/address/user-address",
    method: "GET",
    handler: "List User's Address",
  },
  {
    api: "address",
    endpoint: "/api/address/search",
    method: "GET",
    handler: "Search Address",
  },
  {
    api: "address",
    endpoint: "/api/address",
    method: "GET",
    handler: "List All Address",
  },
  {
    api: "address",
    endpoint: "/api/address/:id",
    method: "GET",
    handler: "List Single Address",
  },
  {
    api: "address",
    endpoint: "/api/address/:id",
    method: "PUT",
    handler: "Update Address",
  },
  {
    api: "address",
    endpoint: "/api/address/:id",
    method: "DELETE",
    handler: "Delete Address",
  },
];

export default (app) => {
  router.post("/", [RBAC], addAddress, create);
  router.get("/user-address",[RBAC], userAddress);
  router.get("/search",[RBAC], search);
  router.get("/",[RBAC], find);
  router.get("/:id",[RBAC], findOne);
  router.put("/:id",[RBAC], [RBAC, updateAddress], update);
  router.delete("/:id",[RBAC], _delete);
  app.use("/api/address", router);
};
const _permissions = permissions;
export { _permissions as permissions };

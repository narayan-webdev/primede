import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import token_id_verify from "../middlewares/jwt_id_verify.js";
import { dashboard, create, login, staffListings, search, staffRegister, deleteStaff, findOne, updateStaff, stafflogin, updateAdmin, adminStaffMe, clientDasboard } from "../controllers/admin.js";
import { createBody, updateBody } from "../middlewares/admin.js";
import blockReservedUsernames from "../../../middlewares/blockReservedUsernames.js";

const permissions = [
  {
    api: "admin",
    endpoint: "/api/admin",
    method: "GET",
    handler: "Get List Of Staffs",
  },
  {
    api: "admin",
    endpoint: "/api/admin/dashboard",
    method: "GET",
    handler: "Read Admin Dashboard",
  },
  {
    api: "admin",
    endpoint: "/api/admin/:id",
    method: "GET",
    handler: "List Single Admin or Staff",
  },
  {
    api: "admin",
    endpoint: "/api/admin/register",
    method: "POST",
    handler: "Register Super_Admin",
  },
  {
    api: "admin",
    endpoint: "/api/admin/staff/register",
    method: "POST",
    handler: "Register Staffs",
  },
  {
    api: "admin",
    endpoint: "/api/admin/staff/:id",
    method: "PUT",
    handler: "Update Staff",
  },
  {
    api: "admin",
    endpoint: "/api/admin/:id",
    method: "PUT",
    handler: "Update Admin",
  },
  {
    api: "admin",
    endpoint: "/api/admin/staff/:id",
    method: "DELETE",
    handler: "Delete Staff",
  },
  {
    api: "admin",
    endpoint: "/api/admin/login",
    method: "POST",
    handler: "Login for  Admin",
  },
  {
    api: "admin",
    endpoint: "/api/admin/staff/login",
    method: "POST",
    handler: "Login for Staff",
  },
  {
    api: "admin",
    endpoint: "/api/admin/client/login",
    method: "POST",
    handler: "Login To Client Dashboard",
  },
  {
    api: "admin",
    endpoint: "/api/admin/search",
    method: "GET",
    handler: "Search Staffs",
  },
  {
    api: "admin",
    endpoint: "/api/admin/me",
    method: "GET",
    handler: "Admin and Staff Me API",
  },
];

export default (app) => {
  router.get("/", [RBAC], staffListings);
  router.get("/dashboard", [RBAC], dashboard);
  router.get("/me", [RBAC], adminStaffMe);
  router.get("/search", [RBAC], search);
  router.get("/:id", [RBAC], findOne);
  router.post("/register", [RBAC, createBody, blockReservedUsernames], create);
  router.post("/staff/register", [RBAC, createBody, blockReservedUsernames], staffRegister);
  router.put("/:id", [RBAC, updateBody], updateAdmin);
  router.put("/staff/:id", [RBAC, updateBody], updateStaff);
  router.delete("/staff/:id", [RBAC], deleteStaff);
  router.post("/staff/login", stafflogin);
  router.post("/login", login);
  router.post("/client/login", clientDasboard);
  app.use("/api/admin", router);
};
const _permissions = permissions;
export { _permissions as permissions };

import { Router } from "express";
const router = Router();
import {
  forgetPassword as _forgetPassword, resetPassword as _resetPassword,
  create, update, find, getMe,
  search, fullDetail, dashboard, findOne,
  _delete, adminLogin, setOTP, verifyOTP,
  login, register_FCM, stafflogin, staffRegister,
  staffListings, searchStaff, updateStaff, deleteStaff
} from "../controllers/user.js";
import { createUser, updateUser, FCM_registration, validatelogin, forgetPassword, resetPassword, validateSendOTP, validateVerifyOTP } from "../middlewares/user.js";
import RBCA from "../../../middlewares/RBAC.js";

const permissions = [
  {
    api: "store-users",
    endpoint: "/api/users/forget-password",
    method: "PUT",
    handler: "Forget Password",
  },
  {
    api: "store-users",
    endpoint: "/api/users/reset-password",
    method: "PUT",
    handler: "Reset Password",
  },
  {
    api: "store-users",
    endpoint: "/api/users",
    method: "POST",
    handler: "Create Store User",
  },
  {
    api: "store-users",
    endpoint: "/api/users/:id",
    method: "PUT",
    handler: "Update Store User",
  },
  {
    api: "store-users",
    endpoint: "/api/users",
    method: "GET",
    handler: "List Store Users",
  },
  {
    api: "store-users",
    endpoint: "/api/users/me",
    method: "GET",
    handler: "Get Current Store User",
  },
  {
    api: "store-users",
    endpoint: "/api/users/search",
    method: "GET",
    handler: "Search Store Users",
  },
  {
    api: "store-users",
    endpoint: "/api/users/:id",
    method: "GET",
    handler: "Find One Store User",
  },
  {
    api: "store-users",
    endpoint: "/api/users/:id",
    method: "DELETE",
    handler: "Delete Store User",
  },
  {
    api: "store-users",
    endpoint: "/api/users/login",
    method: "POST",
    handler: "Login",
  },
  {
    api: "store-users",
    endpoint: "/api/users/fcm/register",
    method: "POST",
    handler: "Register FCM",
  },
  {
    api: "store-users",
    endpoint: "/api/users/dashboard",
    method: "GET",
    handler: "Get Store Dashboard",
  },
];

export default (app) => {
  router.put("/forget-password", [forgetPassword], _forgetPassword);
  router.put("/reset-password", [resetPassword], _resetPassword);
  router.get("/dashboard", [], dashboard);
  router.post("/", [createUser], create);
  router.put("/:id", [RBCA, updateUser], update);
  router.get("/", [RBCA], find);
  router.get("/me", getMe);
  router.get("/search", [RBCA], search);
  router.get("/:id/full-detail", [], fullDetail);
  router.get("/:id", [RBCA], findOne);
  router.delete("/:id", [RBCA], _delete);
  router.post("/admin/login", [validatelogin], adminLogin);
  router.post("/send-otp", [validateSendOTP], setOTP);
  router.post("/verify-otp", [validateVerifyOTP], verifyOTP);
  router.post("/login", [validatelogin], login);
  router.post("/fcm/register", [FCM_registration], register_FCM);
  router.post("/staff/login", [validatelogin], stafflogin)
  router.post("/staff/register", [createUser], staffRegister)
  router.get("/staff/listing", [], staffListings)
  router.get("/staff/search", [], searchStaff)
  router.put("/staff/:id/update", [updateUser], updateStaff)
  router.delete("/staff/:id/delete", [], deleteStaff)
  app.use("/api/users", router);
};

// Exporting the permissions array separately
const _permissions = permissions;
export { _permissions as permissions };

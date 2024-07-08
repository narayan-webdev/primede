import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find, CFVerify, findOne, update, _delete, checkOut, verify, webhook } from "../controllers/server_subscription.js";
import { validateRequest, checkPlan, checkExistingSubscription, verifySchema } from "../middlewares/server_subscription.js";

const permissions = [
  {
    api: "server-subscriptions",
    endpoint: "/api/server-subscriptions",
    method: "POST",
    handler: "Create Server Subscription",
  },
  {
    api: "server-subscriptions",
    endpoint: "/api/server-subscriptions",
    method: "GET",
    handler: "List Server Subscriptions",
  },
  {
    api: "server-subscriptions",
    endpoint: "/api/server-subscriptions/cf-verify",
    method: "GET",
    handler: "CF Verify",
  },
  {
    api: "server-subscriptions",
    endpoint: "/api/server-subscriptions/:id",
    method: "GET",
    handler: "Find Server Subscription",
  },
  {
    api: "server-subscriptions",
    endpoint: "/api/server-subscriptions/:id",
    method: "PUT",
    handler: "Update Server Subscription",
  },
  {
    api: "server-subscriptions",
    endpoint: "/api/server-subscriptions/:id",
    method: "DELETE",
    handler: "Delete Server Subscription",
  },
  {
    api: "server-subscriptions",
    endpoint: "/api/server-subscriptions/checkout",
    method: "POST",
    handler: "Checkout Server Subscription",
  },
  {
    api: "server-subscriptions",
    endpoint: "/api/server-subscriptions/verify",
    method: "POST",
    handler: "Verify Server Subscription",
  },
  {
    api: "server-subscriptions",
    endpoint: "/api/server-subscriptions/webhooks",
    method: "POST",
    handler: "Server Subscription Webhook",
  },
];

// Define routes for the "Post" resource
export default (app) => {
  router.post("/", [RBAC, validateRequest], create);
  router.get("/", [], find);
  router.get("/cf-verify", [RBAC], CFVerify);
  router.get("/:id", [RBAC], findOne);
  router.put("/:id", [RBAC], update);
  router.delete("/:id", [RBAC], _delete);
  router.post("/checkout", [RBAC, validateRequest, checkPlan, checkExistingSubscription], checkOut);
  router.post("/verify", [RBAC, verifySchema], verify);
  router.post("/webhooks", webhook);
  // router.put('/:id/cancel', subscriptionController.refund);
  app.use("/api/server-subscriptions", router);
};

const _permissions = permissions;
export { _permissions as permissions };

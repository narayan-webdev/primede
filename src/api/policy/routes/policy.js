import { Router } from "express";
const router = Router();
import { create, get } from "../controllers/policy.js";
import { createStorePolicy, updateStorePolicy } from "../middlewares/policy.js";

const permissions = [
  {
    api: "policies",
    endpoint: "/api/policies",
    method: "POST",
    handler: "Create Store Policy",
  },
  {
    api: "policies",
    endpoint: "/api/policies",
    method: "GET",
    handler: "Get Store Policy",
  },
];

export default (app) => {
  router.post("/", createStorePolicy, create);
  router.get("/", get);
  app.use("/api/policies", router);
};

const _permissions = permissions;
export { _permissions as permissions };

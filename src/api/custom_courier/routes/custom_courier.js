import { Router } from "express";
const router = Router();
import { validateCreateCustomCourier, validateUpdateCustomCourier, validateReturnCustomCourier } from "../middlewares/custom_courier.js";
import RBAC from "../../../middlewares/RBAC.js";
import { create, productReturn, find, findOne, update, _delete } from "../controllers/custom_courier.js";


const permissions = [
  {
    api: "custom-courier",
    endpoint: "/api/custom-courier",
    method: "POST",
    handler: "Create custom-courier",
  },
  {
    api: "custom-courier",
    endpoint: "/api/custom-courier/return",
    method: "POST",
    handler: "Return custom-courier Product",
  },
  {
    api: "custom-courier",
    endpoint: "/api/custom-courier/:id",
    method: "GET",
    handler: "List Single custom-courier",
  },
  {
    api: "custom-courier",
    endpoint: "/api/custom-courier",
    method: "GET",
    handler: "List custom-couriers",
  },
  {
    api: "custom-courier",
    endpoint: "/api/custom-courier/:id",
    method: "PUT",
    handler: "Update custom-courier",
  },
  {
    api: "custom-courier",
    endpoint: "/api/custom-courier/:id",
    method: "DELETE",
    handler: "Delete custom-courier",
  },

];

// Define routes for the "Custom_courier" resource
export default (app) => {
  router.post("/", [RBAC], validateCreateCustomCourier, create);
  router.post("/return", [RBAC], validateReturnCustomCourier, productReturn);
  router.get("/", [RBAC], find);
  router.get("/:id", [RBAC], findOne);
  router.put(
    "/:id",
    [RBAC],
    validateUpdateCustomCourier,
    update
  );
  router.delete("/:id", [RBAC], _delete);
  app.use("/api/custom-courier", router);
};

const _permissions = permissions;
export { _permissions as permissions };
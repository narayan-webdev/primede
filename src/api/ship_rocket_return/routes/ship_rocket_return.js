import { Router } from "express";
const router = Router();
import { create, find, findOne, update, _delete } from "../controllers/ship_rocket_return.js";
import { validateCreateParcel, validateUpdateParcel } from "../middlewares/ship_rocket_return.js";
import StoreRBAC from "../../../middlewares/StoreRBAC.js";

const permissions = [
  {
    api: "ship-rocket-returns",
    endpoint: "/api/ship-rocket-returns",
    method: "POST",
    handler: "Create Ship Rocket Return",
  },
  {
    api: "ship-rocket-returns",
    endpoint: "/api/ship-rocket-returns",
    method: "GET",
    handler: "List Ship Rocket Returns",
  },
  {
    api: "ship-rocket-returns",
    endpoint: "/api/ship-rocket-returns/:id",
    method: "GET",
    handler: "Find One Ship Rocket Return",
  },
  {
    api: "ship-rocket-returns",
    endpoint: "/api/ship-rocket-returns/:id",
    method: "PUT",
    handler: "Update Ship Rocket Return",
  },
  {
    api: "ship-rocket-returns",
    endpoint: "/api/ship-rocket-returns/:id",
    method: "DELETE",
    handler: "Delete Ship Rocket Return",
  },
];

export default (app) => {
  router.post("/", [StoreRBAC, validateCreateParcel], create);
  router.get("/", [StoreRBAC], find);
  router.get("/:id", [StoreRBAC], findOne);
  router.put("/:id", [StoreRBAC, validateUpdateParcel], update);
  router.delete("/:id", [StoreRBAC], _delete);

  // You can pass the permissions array along with the router
  app.use("/api/ship-rocket-returns", [router]);
};

// Exporting the permissions array separately
const _permissions = permissions;
export { _permissions as permissions };

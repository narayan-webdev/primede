import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find, findOne, update, destroy } from "../controllers/banner.js";
import { validateRequest } from "../middlewares/banner.js";

// Define routes for the "Post" resource

const permissions = [
  {
    api: "banners",
    endpoint: "/api/banners",
    method: "POST",
    handler: "Create Banner",
  },
  {
    api: "banners",
    endpoint: "/api/banners",
    method: "GET",
    handler: "List Banners",
  },
  {
    api: "banners",
    endpoint: "/api/banners/:id",
    method: "GET",
    handler: "List Single Banners",
  },
  {
    api: "banners",
    endpoint: "/api/banners/:id",
    method: "PUT",
    handler: "Update Banners",
  },
  {
    api: "banners",
    endpoint: "/api/banners/:id",
    method: "DELETE",
    handler: "Delete Banners",
  },
];
export default (app) => {
  router.post("/", [RBAC, validateRequest], create);
  router.get("/", find);
  router.get("/:id", findOne);
  router.put("/:id", [RBAC], update);
  router.delete("/:id", [RBAC], destroy);
  app.use("/api/banners", router);
};
const _permissions = permissions;
export { _permissions as permissions };

import { Router } from "express";
const router = Router();
import { create, find, findOne, update, _delete } from "../controllers/coupon.js";
import RBAC from "../../../middlewares/RBAC.js";

// Define routes for the "Post" resource
export default (app) => {
  router.post("/", [RBAC], create);
  router.get("/", [], find);
  router.get("/:id", [], findOne);
  router.put("/:id", [RBAC], update);
  router.delete("/:id", [RBAC], _delete);
  app.use("/api/coupons", router);
};

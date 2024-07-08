import { Router } from "express";
const router = Router();

import { addToCart, consumerCart, emptyCart, deleteVariant } from "../controllers/cart.js";
import { validateAddToCart } from "../middlewares/cart.js";
import RBAC from "../../../middlewares/RBAC.js";


const permissions = [
  {
    api: "cart",
    endpoint: "/api/cart/add",
    method: "POST",
    handler: "Add To Cart",
  },
  {
    api: "cart",
    endpoint: "/api/cart/me",
    method: "GET",
    handler: "List Consumer cart",
  },
  {
    api: "cart",
    endpoint: "/api/cart/empty",
    method: "DELETE",
    handler: "Empty cart",
  },
  {
    api: "cart",
    endpoint: "/api/cart/remove/:id",
    method: "DELETE",
    handler: "Remove Item From Cart",
  },
];

export default (app) => {

  router.post("/add",[RBAC], validateAddToCart, addToCart);
  router.get("/me",[RBAC], consumerCart);
  router.delete("/empty",[RBAC], emptyCart);
  router.delete("/remove/:id",[RBAC], deleteVariant);
  app.use("/api/cart", router);
};
const _permissions = permissions;
export { _permissions as permissions };

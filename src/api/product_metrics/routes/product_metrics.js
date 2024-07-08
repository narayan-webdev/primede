import { Router } from "express";
const router = Router();
import { create, find, findOne, update, _delete } from "../controllers/product_metrics.js";
import { validateProductMetrics } from "../middlewares/product_metrics.js";

const permissions = [
  {
    api: "product-metrics",
    endpoint: "/api/product-metrics",
    method: "POST",
    handler: "Create Product Metrics",
  },
  {
    api: "product-metrics",
    endpoint: "/api/product-metrics",
    method: "GET",
    handler: "List Product Metrics",
  },
  {
    api: "product-metrics",
    endpoint: "/api/product-metrics/:id",
    method: "GET",
    handler: "Find Product Metrics",
  },
  {
    api: "product-metrics",
    endpoint: "/api/product-metrics/:id",
    method: "PUT",
    handler: "Update Product Metrics",
  },
  {
    api: "product-metrics",
    endpoint: "/api/product-metrics/:id",
    method: "DELETE",
    handler: "Delete Product Metrics",
  },
];

export default (app) => {
  router.post("/", validateProductMetrics, create);
  router.get("/", find);
  router.get("/:id", findOne);
  router.put("/:id", update);
  router.delete("/:id", _delete);

  app.use("/api/product-metrics", router);
};

const _permissions = permissions;
export { _permissions as permissions };

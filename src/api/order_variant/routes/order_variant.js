import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, exportToExcel, stats, listReturnRequests, trackOrder, storeUserOrders, storeUserOrderStats, find, findOneStoreUser, findOne, update, _delete, findByOrderId, acceptOrder, declineOrder, cancelOrder, deliverOrder, returnRequest, declineReturn, updateReturnStatus } from "../controllers/order_variant.js";

const permissions = [
  {
    api: "order-variants",
    endpoint: "/api/order-variants",
    method: "POST",
    handler: "Create Order Variant",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants",
    method: "GET",
    handler: "List Order Variants",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/users",
    method: "GET",
    handler: "List User Order Variants",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/stats",
    method: "GET",
    handler: "Get order variant stats",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/users/stats",
    method: "GET",
    handler: "Get Store User order stats",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id",
    method: "GET",
    handler: "Find Order Variant",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id/users",
    method: "GET",
    handler: "Find User Order Variant",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id",
    method: "PUT",
    handler: "Update Order Variant",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id",
    method: "DELETE",
    handler: "Delete Order Variant",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id/variants",
    method: "GET",
    handler: "Find Variants by Order ID",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:orderId/variants/:variantId/return_request",
    method: "PUT",
    handler: "Update Return Status",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id/accept",
    method: "PUT",
    handler: "Accept Order",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id/track",
    method: "GET",
    handler: "Track Order",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id/decline",
    method: "PUT",
    handler: "Decline Order",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id/cancel",
    method: "PUT",
    handler: "Cancel Order",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id/deliver",
    method: "PUT",
    handler: "Deliver Order",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id/return-request",
    method: "PUT",
    handler: "Return Request",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/:id/return-decline",
    method: "PUT",
    handler: "Decline Return",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/return-requests",
    method: "GET",
    handler: "List Return Requests",
  },
  {
    api: "order-variants",
    endpoint: "/api/order-variants/export",
    method: "POST",
    handler: "Export Order Variants To Excel",
  },
];

export default (app) => {
  router.post("/", [RBAC], create);
  router.post("/export", exportToExcel);
  router.get("/stats", stats);
  router.get("/return-requests", listReturnRequests);
  router.get("/:id/track", trackOrder);
  router.get("/users", storeUserOrders);
  router.get("/users/stats", storeUserOrderStats);
  router.get("/", find);
  router.get("/:id/users", findOneStoreUser);
  router.get("/:id", findOne);
  router.put("/:id", [RBAC], update);
  router.delete("/:id", [RBAC], _delete);
  router.get("/:id/variants", findByOrderId);
  router.put("/:id/accept", acceptOrder);
  router.put("/:id/decline", declineOrder);
  router.put("/:id/cancel", cancelOrder);
  router.put("/:id/deliver", deliverOrder);
  router.put("/:id/return-request", returnRequest);
  router.put("/:id/return-decline", declineReturn);
  router.put("/:orderId/variants/:variantId/return_request", [RBAC], updateReturnStatus);
  app.use("/api/order-variants", router);
};

const _permissions = permissions;
export { _permissions as permissions };

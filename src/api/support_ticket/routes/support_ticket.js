import { Router } from "express";
const router = Router();
import RBAC from "../../../middlewares/RBAC.js";
import { create, find, stats, exportToExcel, findOne, update, changeStatus, _delete } from "../controllers/support_ticket.js";
import { validateRequest, validateUpdateRequest } from "../middlewares/support_ticket.js";

// Define routes for the "Post" resource
const permissions = [
    {
        api: "support-tickets",
        endpoint: "/api/support-tickets",
        method: "POST",
        handler: "Create Support Ticket",
    },
    {
        api: "support-tickets",
        endpoint: "/api/support-tickets",
        method: "GET",
        handler: "List All Support Ticket",
    },
    {
        api: "support-tickets",
        endpoint: "/api/support-tickets/:id",
        method: "GET",
        handler: "List Single Support Ticket",
    },
    {
        api: "support-tickets",
        endpoint: "/api/support-tickets/:id",
        method: "PUT",
        handler: "Update Support Ticket",
    },
    {
        api: "support-tickets",
        endpoint: "/api/support-tickets/:id/:status",
        method: "PUT",
        handler: "Change Support Ticket Status",
    },
    {
        api: "support-tickets",
        endpoint: "/api/support-tickets/:id",
        method: "DELETE",
        handler: "Delete Support Ticket",
    },
    {
        api: "support-tickets",
        endpoint: "/api/support-tickets/stats",
        method: "GET",
        handler: "GET Support Tickets Stats",
    },
    {
        api: "support-tickets",
        endpoint: "/api/support-tickets/export",
        method: "GET",
        handler: "Export Support Tickets To Excel",
    },
];
export default (app) => {
    router.post("/", [validateRequest], create);
    router.get("/", [RBAC], find);
    router.get("/stats", [RBAC], stats);
    router.get("/export", [], exportToExcel);
    router.get("/:id", [RBAC], findOne);
    router.put("/:id", [RBAC], [validateUpdateRequest], update);
    router.put("/:id/:status", [RBAC], changeStatus);
    router.delete("/:id", [RBAC], _delete);
    app.use("/api/support-tickets", router);
};

const _permissions = permissions;
export { _permissions as permissions };

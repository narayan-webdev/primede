
// src/api/post/postRoutes.js
import { Router } from 'express';
const router = Router();
import RBAC from '../../../middlewares/RBAC.js';
import { create, find, findOne, update, _delete } from '../controllers/marquee.js';
import { validateRequest } from '../middlewares/marquee.js';


const permissions = [
    {
        api: "marquees",
        endpoint: "/api/marquees",
        method: "POST",
        handler: "Create marquee",
    },
    {
        api: "marquees",
        endpoint: "/api/marquees",
        method: "GET",
        handler: "List marquees",
    },
    {
        api: "marquees",
        endpoint: "/api/marquees/:id",
        method: "GET",
        handler: "Find marquee",
    },
    {
        api: "marquees",
        endpoint: "/api/marquees/:id",
        method: "PUT",
        handler: "Update marquee",
    },
    {
        api: "marquees",
        endpoint: "/api/marquees/:id",
        method: "DELETE",
        handler: "Delete marquee",
    },
];

export default (app) => {
    router.post('/', [RBAC, validateRequest], create);
    router.get('/', find);
    router.get('/:id', findOne);
    router.put('/:id', [RBAC, validateRequest], update);
    router.delete('/:id', [RBAC], _delete);
    app.use('/api/marquees', router)
}
const _permissions = permissions;
export { _permissions as permissions };

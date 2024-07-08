
import { Router } from 'express'
const router = Router();
import { create, find, findOne, update, destroy } from '../controllers/product_policy.js';
import { validateRequest } from '../middlewares/product_policy.js';

const permissions = [
    {
        api: "product-policies",
        endpoint: "/api/product-policies",
        method: "POST",
        handler: "Create Product Policy",
    },
    {
        api: "product-policies",
        endpoint: "/api/product-policies",
        method: "GET",
        handler: "List Product Policies",
    },
    {
        api: "product-policies",
        endpoint: "/api/product-policies/:id",
        method: "GET",
        handler: "List Single Product Policies",
    },
    {
        api: "product-policies",
        endpoint: "/api/product-policies/:id",
        method: "PUT",
        handler: "Update Product Policies",
    },
    {
        api: "product-policies",
        endpoint: "/api/product-policies/:id",
        method: "DELETE",
        handler: "Delete Product Policies",
    },
];
export default (app) => {
    router.post('/', [validateRequest], create);
    router.get('/', find);
    router.get('/:id', findOne);
    router.put('/:id', [validateRequest], update);
    router.delete('/:id', destroy);
    app.use('/api/product-policies', router)
}
const _permissions = permissions;
export { _permissions as permissions };
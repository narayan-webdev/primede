
import { Router } from 'express'
const router = Router();
import { create, find, findOne, update, _delete } from '../controllers/promotional_message.js';
import { validateRequest } from '../middlewares/promotional_message.js';

// Define routes for the "Post" resource
const permissions = [
    {
        api: "promotional-messages",
        endpoint: "/api/promotional-messages",
        method: "POST",
        handler: "Create Plan",
    },
    {
        api: "promotional-messages",
        endpoint: "/api/promotional-messages",
        method: "GET",
        handler: "List promotional-messages",
    },
    {
        api: "promotional-messages",
        endpoint: "/api/promotional-messages/:id",
        method: "GET",
        handler: "Find Plan",
    },
    {
        api: "promotional-messages",
        endpoint: "/api/promotional-messages/:id",
        method: "PUT",
        handler: "Update Plan",
    },
    {
        api: "promotional-messages",
        endpoint: "/api/promotional-messages/:id",
        method: "DELETE",
        handler: "Delete Plan",
    },
];
export default (app) => {
    router.post('/', [validateRequest], create);
    router.get('/', find);
    router.get('/:id', findOne);
    router.put('/:id', [validateRequest], update);
    router.delete('/:id', [], _delete);
    app.use('/api/promotional-messages', router)
}


import { Router } from 'express';
const router = Router();
import { create, find, findOne, update, _delete } from '../controllers/testimonial.js';
import { validateRequest } from '../middlewares/testimonial.js';

const permissions = [
    {
        api: "testimonials",
        endpoint: "/api/testimonials",
        method: "POST",
        handler: "Create testimonial",
    },
    {
        api: "testimonials",
        endpoint: "/api/testimonials",
        method: "GET",
        handler: "List testimonials",
    },
    {
        api: "testimonials",
        endpoint: "/api/testimonials/:id",
        method: "GET",
        handler: "Find One testimonial",
    },
    {
        api: "testimonials",
        endpoint: "/api/testimonials/:id",
        method: "PUT",
        handler: "Update testimonial",
    },
    {
        api: "testimonials",
        endpoint: "/api/testimonials/:id",
        method: "DELETE",
        handler: "Delete testimonial",
    },
];
export default (app) => {
    router.post('/', [validateRequest], create);
    router.get('/', find);
    router.get('/:id', findOne);
    router.put('/:id', [validateRequest], update);
    router.delete('/:id', _delete);
    app.use('/api/testimonials', router)
}
const _permissions = permissions;
export { _permissions as permissions };

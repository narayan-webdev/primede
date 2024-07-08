
import { Router } from 'express'
const router = Router();
import { create, find, findByProduct, update, _delete } from '../controllers/product_review.js';

// Define routes for the "Post" resource
export default (app) => {
    router.post('/', create);
    router.get('/', find);
    router.get('/products/:id', findByProduct);
    router.put('/:id', update);
    router.delete('/:id', _delete);
    app.use('/api/product-reviews', router)
}

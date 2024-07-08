

import { Router } from 'express';
const router = Router();
import { create, find, findOne, update, _delete } from '../controllers/story.js';

// Define routes for the "Post" resource
export default (app) => {
    router.post('/', create);
    router.get('/', find);
    router.get('/:id', findOne);
    router.put('/:id', update);
    router.delete('/:id', _delete);
    app.use('/api/stories', router)
}

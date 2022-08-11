import express from "express";
import homeController from '../controllers/homeController';

const router = express.Router();

const initWebRoutes = app => {
    router.get('/', homeController.getHomepage);
    router.get('/crud', homeController.getCRUD);

    router.post('/post-crud', homeController.postCRUD);
    router.get('/display-crud', homeController.displayCRUD);

    return app.use('/', router);
}

module.exports = initWebRoutes;
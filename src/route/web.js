import express from "express";
import homeController from '../controllers/homeController';

const router = express.Router();

const initWebRoutes = app => {
    router.get('/', homeController.getHomepage);

    router.get('/rye', (req, res) => {
        return res.send('Lets do this');
    });

    return app.use('/', router);
}

module.exports = initWebRoutes;
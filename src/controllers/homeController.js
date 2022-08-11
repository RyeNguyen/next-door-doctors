import db from '../models/index';
import CRUDService from '../services/CRUDService';

const getHomepage = async (req, res) => {
    try {
        const data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }
}

const getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

const postCRUD = async (req, res) => {
    const message = await CRUDService.createNewUser(req.body);
    return res.send(message);
}

module.exports = {
    getHomepage,
    getCRUD,
    postCRUD
};
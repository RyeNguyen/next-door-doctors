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
    const allUsers = await CRUDService.createNewUser(req.body);
    return res.render('displayCRUD.ejs', {
        tableData: allUsers
    });
}

const displayCRUD = async (req, res) => {
    const data = await CRUDService.getAllUsers();
    return res.render('displayCRUD.ejs', {
        tableData: data
    });
}

const getEditCRUD = async (req, res) => {
    const userId = req.query.id;
    if (userId) {
        const userData = await CRUDService.getUserInfoById(userId);
        //check user data whether it's not found
        return res.render('editCRUD.ejs', {userData});
    }
    return res.send('Invalid user id');
}

const putCRUD = async (req, res) => {
    const data = req.body;
    const allUsers = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        tableData: allUsers
    });
}

const deleteCRUD = async (req, res) => {
    const id = req.query.id;
    if (id) {
        const allUsers = await CRUDService.deleteUserById(id);
        return res.render('displayCRUD.ejs', {
            tableData: allUsers
        });
    }
    return res.send('User not found!!');
}

module.exports = {
    getHomepage,
    getCRUD,
    postCRUD,
    displayCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD
};
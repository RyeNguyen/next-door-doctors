import userService from '../services/userService';

const handleLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing required parameter(s)!!'
        })
    }

    const userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user: userData.user || {}
    });
}

const handleGetUsers = async (req, res) => {
    const id = req.query.id;
    const users = await userService.getUsers(id);

    if (users) {
        return res.status(200).json({
            errCode: 0,
            message: 'OK',
            users
        })
    }

    return res.status(200).json({
        errCode: 1,
        message: 'No user(s) found!!',
        users: users || []
    })
}

const handleCreateNewUser = async (req, res) => {
    const message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}

const handleEditUser = async (req, res) => {
    if (!req.body) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameter(s)!!',
            user: {}
        })
    }
    const updatedUser = await userService.updateUserData(req.body);
    return res.status(200).json(updatedUser);
}

const handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameter(s)!!'
        })
    }
    const message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

module.exports = {
    handleLogin,
    handleGetUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser
}
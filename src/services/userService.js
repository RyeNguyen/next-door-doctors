import bcrypt from 'bcrypt';
import db from '../models/index';

const handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = {};
            const isExist = await checkUserEmail(email);

            if (isExist) {
                //user already exist
                //compare password
                const user = await db.User.findOne({
                    where: {email: email},
                    attributes: ['email', 'roleId', 'password'],
                    raw: true
                })

                if (user) {
                    const check = await bcrypt.compare(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.message = 'OK';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.message = 'Passwords do not match!!';
                    }
                } else {
                    userData.errCode = 2;
                    userData.message = `User not found!!`;
                }
            } else {
                userData.errCode = 1;
                userData.message = `Your email is not existed in out system. Please try other email!`;
            }

            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}

const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email: userEmail }
            });

            if (user) {
                resolve(true);
            }

            resolve(false);
        } catch (error) {
            reject(error);
        }
    })
}

const getUsers = userId => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (!userId) {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } else {
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    handleUserLogin,
    getUsers
};
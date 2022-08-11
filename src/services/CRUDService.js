import bcrypt from 'bcrypt';
import db from '../models/index';

const saltRounds = 10;

const createNewUser = async data => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                address: data.address,
                gender: data.gender === '1',
                roleId: data.roleId
            });

            resolve('Create a new user successfully!!');
        } catch (error) {
            reject(error);
        }
    })
}

const getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({raw: true});
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

const getUserInfoById = userId => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id: userId },
            });

            if (user) {
                resolve(user);
            }

            resolve({});
        } catch (error) {
            reject(error);
        }
    })
}

const updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await getUserInfoById(data.id);
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                const allUsers = await getAllUsers();
                resolve(allUsers);
            } else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    })
}

const hashUserPassword = password => {
    return new Promise(async (resolve, reject) => {
        try {
            await bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    resolve(hash);
                });
            });
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    createNewUser,
    getAllUsers,
    getUserInfoById,
    updateUserData
}
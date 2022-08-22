import bcrypt from 'bcrypt';
import db from '../models/index';

const saltRounds = 10;

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

const createNewUser = data => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    message: 'This email has already existed in the system. Please login!'
                })
            } else {
                const hashPasswordFromBcrypt = await hashUserPassword(data.password);
                const newUser = await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    gender: data.gender === '1',
                    roleId: data.roleId
                });

                if (newUser) {
                    resolve({
                        errCode: 0,
                        message: 'OK'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        message: 'No new user created. Please try again!!'
                    })
                }
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

const deleteUser = userId => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {id: userId},
                raw: false
            });
            if (user) {
                await user.destroy();
                resolve({
                    errCode: 0,
                    message: 'OK'
                })
            }
            resolve({
                errCode: 2,
                message: 'User not found!!'
            })
        } catch (error) {
            reject(error);
        }
    })
}

const updateUserData = data => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameter(s)!!',
                    user: {}
                })
            }

            const user = await db.User.findOne({
                where: {id: data.id},
                raw: false
            });
            if (user) {
                user.email = data.email;
                user.password = data.password;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                const updatedUser = await user.save();
                resolve({
                    errCode: 0,
                    message: 'OK',
                    user: updatedUser
                });
            } else {
                resolve({
                    errCode: 3,
                    message: 'User not found!!',
                    user: {}
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    handleUserLogin,
    getUsers,
    createNewUser,
    deleteUser,
    updateUserData
};
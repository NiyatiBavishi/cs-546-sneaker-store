const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const {ObjectId} = require('mongodb');
const {checkInputStr} = require("./validate");
const bcrypt = require("bcrypt");

const create = async (firstName, lastName, email, password, address, phoneNumber, isAdmin, sneakersListed, sneakersBought) => {
    checkInputStr(firstName);
    checkInputStr(lastName);
    checkInputStr(email);
    checkInputStr(password);
    checkInputStr(address);
    checkInputStr(phoneNumber);

    const usersCollection = await users();

    let user = usersCollection.findOne({
        email: email.toLowerCase()
    });

    if (user) {
        throw {
            statusCode: 400,
            message: "A user with email " + email + " already exists in the system!"
        }
    }

    let newUser = {
        _id: ObjectId(),
        email: email,
        password: await hashPassword(password),
        firstName: firstName,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
        isAdmin: isAdmin,
        sneakersListed: [],
        sneakersBought: []
    };

    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) {
        throw {
            statusCode: 500,
            message: "Internal server error!"
        }
    }

    return {userInserted: true};
};

const getAll = () => {
};

const get = (userId) => {
};

const update = (userId, firstName, lastName, email, passwordHash, address, phoneNumber, isAdmin, sneakersListed, sneakersBought) => {
};

const remove = (userId) => {
};

const hashPassword = async (password) => {
    const saltRounds = 16;
    return await bcrypt.hash(password, saltRounds);
}

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
};

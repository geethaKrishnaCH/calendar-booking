const { createHmac } = require("crypto")
const jwt = require('jsonwebtoken');
const user = require("../../models/user");

const SECRET_KEY = "SECRET"

function hashPassword(password) {
    return createHmac('sha256', SECRET_KEY).update(password).digest('base64');
}

function validatePassword(password, hashedPassword) {
    return hashPassword(password) === hashedPassword;
}

function createJWTToken(userInfo) {
    const token = jwt.sign(userInfo, SECRET_KEY, {
        expiresIn: '1h'
    })
    return {
        userId: userInfo.id,
        token,
        expiresIn: 1,
        roles: userInfo.roles
    }
}

module.exports = {
    hashPassword,
    validatePassword,
    createJWTToken
}
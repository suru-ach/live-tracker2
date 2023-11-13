const { genSalt, hash, compare } = require('bcrypt');

const hashPassword = async (password) => {
    const salt = await genSalt(10);
    return await hash(password, salt);
}

const comparePassword = async (password, inputPassword) => {
    return await compare(password, inputPassword);
}

module.exports = {
    hashPassword,
    comparePassword
}

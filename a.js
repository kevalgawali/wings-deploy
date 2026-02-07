const bcrypt = require("bcrypt")
require("dotenv").config()

const hash = bcrypt.hashSync("super123", parseInt(process.env.SALT_ROUNDS, 10))
console.log(hash)
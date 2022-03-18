/*
    Developed by Nay Oo Kyaw
    nayookyaw.nok@gmail.com
*/

const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.users = require("./users.model.js")(mongoose);
db.bookings = require("./bookings.model")(mongoose);

module.exports = db;

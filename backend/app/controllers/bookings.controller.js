/*
    Developed by Nay Oo Kyaw
    nayookyaw.nok@gmail.com
*/

const db = require("../models");
const Bookings = db.bookings;

// Create new booking
exports.add = async (req, res) => {
    var input = req.body;
    if (!input) {
        res.status(400).json({ message: "Content can not be empty!" });
        return;
    }

    // Validate input
    var isValid = validateInput(input);
    if (isValid != false) {
        res.status(400).json({ message: isValid });
        return;
    }

    var existingUser = await getUserByNric(input.nric);
    console.log (existingUser);

    if (existingUser) {
        res.status(400).json({ message: "User is already exist!" });
        return;
    }

    // Call booking object
    const newBooking = new Bookings({
        nric: input.nric,
        name: input.name,
        description: input.description ? input.description : null,
        phone : input.phone ? input.phone : null,
        email : input.email ? input.email : null,
        vaccine_center : input.vaccine_center ? input.vaccine_center : null,
        slot : input.slot ? input.slot : null
    });

    // Save booking in the database
    newBooking
        .save(newBooking)
        .then(data => {
            res.status(200).json({ message: "Success", data: data });
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the User."
        });
    });
};

function validateInput(input) {
    var errMsg = false;

    if (!input.nric) {
        errMsg = "NRIC can not be empty!";
    }

    else if (!input.name) {
        errMsg = "Full Name can not be empty!";
    }

    else if (!input.email) {
        errMsg = "Email can not be empty!";
    }

    else if (!input.vaccine_center) {
        errMsg = "Vaccine Center can not be empty!";
    }

    else if (!input.slot) {
        errMsg = "Slot Time can not be empty!";
    }

    return errMsg;
}

function getUserByNric(inputNric) {
    return Bookings.findOne({ nric: inputNric });
}
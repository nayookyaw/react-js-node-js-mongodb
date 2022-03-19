/*
    Developed by Nay Oo Kyaw
    nayookyaw.nok@gmail.com
*/
const mongoose = require('mongoose');

const db = require("../models");
const Bookings = db.bookings;

// Create new booking
exports.add = async (req, res) => {
    var input = req.body;
    if (!input) {
        res.status(200).json({ status: "error", message: "Content can not be empty!" });
        return;
    }

    // Validate input
    var isValid = validateInput(input);
    if (isValid != false) {
        res.status(200).json({ status: "error", message: isValid });
        return;
    }

    // Check whether user is existing or not
    var existingUser = await getUserByNric(input.nric);
    console.log (existingUser);

    if (existingUser) {
        res.status(200).json({ status: "error", message: "User is already exist!" });
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
    var newBook = await newBooking.save(newBooking);

    res.status(200).json({ status: "success", message: "Success", data: newBooking });
    return;
};

exports.update = async (req, res) => {
    var input = req.body;
    if (!input) {
        res.status(200).json({ status: "error", message: "Content can not be empty!" });
        return;
    }

    // Validate input
    var isValid = validateInput(input);
    if (isValid != false) {
        res.status(200).json({ status: "error", message: isValid });
        return;
    }

    const id = (req.params.id).trim();

    var isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
        res.status(200).json({ status: "error", message: "Id is not valid format, please check again" });
        return;
    }
    
    const existBooking = await Bookings.findById(id);
    if (!existBooking) {
        res.status(200).json({ status: "error", message: "Booking does not exist!" });
        return;
    }

    // update booking
    await Bookings.findByIdAndUpdate(id, input, { useFindAndModify: false });

    res.status(200).json({ status: "success", message: "Booking has been updated successfully", data: {} });
    return;
};

exports.delete = async (req, res) => {
    var input = req.body;
    if (!input) {
        res.status(200).json({ status: "error", message: "Content can not be empty!" });
        return;
    }

    const id = (req.params.id).trim();

    var isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
        res.status(200).json({ status: "error", message: "Id is not valid format, please check again" });
        return;
    }

    const existBooking = await Bookings.findById(id);
    if (!existBooking) {
        res.status(200).json({ status: "error", message: "Booking does not exist!" });
        return;
    }

    // update booking
    await Bookings.findByIdAndRemove(id, { useFindAndModify: false });

    res.status(200).json({ status: "success", message: "Booking has been deleted successfully", data: {} });
    return;

}

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
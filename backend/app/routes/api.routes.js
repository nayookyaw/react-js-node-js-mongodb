/*
    Developed by Nay Oo Kyaw
    nayookyaw.nok@gmail.com
*/

module.exports = app => {

  const users = require("../controllers/users.controller.js");
  const bookings = require("../controllers/bookings.controller");

  var router = require("express").Router();

  // Add new booking
  router.post("/add/booking", bookings.add);

  // Create a new User
  router.post("/create", users.create);
  
  // Retrieve all users
  router.get("/find", users.findAll);

  // Retrieve all published users
  router.get("/published", users.findAllPublished);

  // Retrieve a single User with id
  router.get("/:id", users.findOne);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);

  // Create a new User
  router.delete("/delete", users.deleteAll);

  app.use("/api/", router);
};

/*
    Developed by Nay Oo Kyaw
    nayookyaw.nok@gmail.com
*/

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      nric: { type: String, required: true },
      name: { type: String, required: true },
      description: String,
      phone: Number,
      email: { type: String, required: true },
      vaccine_center: { type: String, required: true },
      slot: { type: String, required: true },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Bookings = mongoose.model("bookings", schema);
  return Bookings;
};
  
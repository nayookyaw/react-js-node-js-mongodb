/*
    Developed by Nay Oo Kyaw
    nayookyaw.nok@gmail.com
*/

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String,
      description: String,
      phone: Number,
      nric: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Users = mongoose.model("users", schema);
  return Users;
};

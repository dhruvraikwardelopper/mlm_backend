// // // import mongoose from "mongoose";

// // const userSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   phone: { type: String, required: true },
// //   password: { type: String, required: true },
// //   sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
// //   membersCount: { type: Number, default: 0 },
// //   earnings: { type: Number, default: 0 },
// // });

// // export default mongoose.model("User", userSchema);



// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   password: { type: String, required: true },
//   sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//   membersCount: { type: Number, default: 0 },
//   earnings: { type: Number, default: 0 },
// });

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  membersCount: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
});

export default mongoose.model("User", userSchema);

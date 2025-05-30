import readline from "readline";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) => new Promise((res) => rl.question(question, res));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => verifySuperadmin())
  .catch((err) => {
    console.error("DB error:", err.message);
    process.exit(1);
  });

function verifySuperadmin() {
  console.log("Authenticate Superadmin to view all admins\n");

  ask("Superadmin email: ")
    .then((email) =>
      ask("Superadmin password: ").then((password) => ({ email, password }))
    )
    .then(({ email, password }) =>
      Admin.findOne({ email, role: "superadmin" }).then((admin) => {
        if (!admin) throw new Error("Superadmin not found");
        return bcrypt.compare(password, admin.password).then((match) => {
          if (!match) throw new Error("Authentication failed");
          return true;
        });
      })
    )
    .then(() => Admin.find({ role: "admin" }))
    .then((admins) => {
      console.log("Admin Users:");
      admins.forEach((a, i) => {
        console.log(`${i + 1}. ${a.name} (${a.email})`);
      });
      rl.close();
      mongoose.disconnect();
    })
    .catch((err) => {
      console.error(err.message);
      rl.close();
      mongoose.disconnect();
    });
}
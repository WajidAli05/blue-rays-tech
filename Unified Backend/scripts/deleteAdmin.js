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

const ask = (q) => new Promise((res) => rl.question(q, res));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => verifySuperadmin())
  .catch((err) => {
    console.error("DB error:", err.message);
    process.exit(1);
  });

function verifySuperadmin() {
  console.log("Authenticate Superadmin to delete an admin\n");

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
    .then(() => ask("Admin email to delete: "))
    .then((emailToDelete) =>
      Admin.findOneAndDelete({ email: emailToDelete, role: "admin" }).then(
        (deleted) => {
          if (!deleted) throw new Error("Admin not found");
          console.log(`Deleted admin: ${deleted.email}`);
        }
      )
    )
    .then(() => {
      rl.close();
      mongoose.disconnect();
    })
    .catch((err) => {
      console.error(err.message);
      rl.close();
      mongoose.disconnect();
    });
}
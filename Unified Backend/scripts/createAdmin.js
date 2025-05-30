// scripts/createAdmin.js

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

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

// Mongo connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    return verifySuperadmin();
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Step 1: Authenticate superadmin
function verifySuperadmin() {
  console.log("Authenticate Superadmin to continue\n");

  ask("Superadmin email: ")
    .then((email) =>
      ask("Superadmin password: ").then((password) => ({ email, password }))
    )
    .then(({ email, password }) =>
      Admin.findOne({ email, role: "superadmin" }).then((admin) => {
        if (!admin) throw new Error("Superadmin not found or unauthorized");

        return bcrypt.compare(password, admin.password).then((isMatch) => {
          if (!isMatch) throw new Error("Authentication failed");
          return true;
        });
      })
    )
    .then(() => createAdminFlow())
    .catch((err) => {
      console.error(err.message);
      rl.close();
      mongoose.disconnect();
    });
}

// Step 2: Create new admin
function createAdminFlow() {
  console.log("\n✅ Superadmin authenticated. Proceeding to create a new admin.\n");

  ask("New admin name: ")
    .then((name) =>
      ask("New admin email: ").then((email) => ({ name, email }))
    )
    .then((data) =>
      ask("New admin password: ").then((password) => ({
        ...data,
        password,
      }))
    )
    .then((data) => {
      const newAdmin = new Admin({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "admin", // enforce role
      });

      return newAdmin.save();
    })
    .then((admin) => {
      console.log(`New admin created: ${admin.name} (${admin.email})`);
      rl.close();
      mongoose.disconnect();
    })
    .catch((err) => {
      console.error(`Failed to create admin: ${err.message}`);
      rl.close();
      mongoose.disconnect();
    });
}
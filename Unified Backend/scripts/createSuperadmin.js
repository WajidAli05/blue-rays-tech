import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import Admin from '../models/adminModel.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (q) => new Promise(resolve => rl.question(q, resolve));

mongoose.connect(process.env.MONGO_URI)
  .then(() => Admin.findOne({ role: 'superadmin' }))
  .then(existing => {
    if (existing) {
      console.log('Superadmin already exists. Cannot create another.');
      rl.close();
      return mongoose.disconnect();
    }
    return question('Enter superadmin name: ')
      .then(name => question('Enter superadmin email: ')
        .then(email => question('Enter superadmin password: ')
          .then(password => ({ name, email, password }))
        )
      );
  })
  .then(data => {
    if (!data) return; // superadmin exists, exit early
    const newSuperadmin = new Admin({
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'superadmin',
      permissions: []
    });
    return newSuperadmin.save();
  })
  .then(() => {
    console.log('✅ Superadmin created successfully!');
    rl.close();
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err.message);
    rl.close();
    mongoose.disconnect();
  });
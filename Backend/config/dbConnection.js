import mongoose from "mongoose";

const dbConnection = async () => {
    mongoose.connection.on('connected', () => console.log('connected'));
    mongoose.connection.on('open', () => console.log('open'));
    mongoose.connection.on('disconnected', () => console.log('disconnected'));
    mongoose.connection.on('reconnected', () => console.log('reconnected'));
    mongoose.connection.on('disconnecting', () => console.log('disconnecting'));
    mongoose.connection.on('close', () => console.log('close'));
    
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Database connection established');
    })
    .catch((err)=> {
        console.log('Database connection error: ', err);
        process.exit(1);
    })
}


export default dbConnection;
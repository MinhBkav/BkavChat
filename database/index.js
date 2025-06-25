require('dotenv').config()
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

const option = {
    socketTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

let dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
console.log(`dbURI=${dbURI}`)

// mongoose.connect(dbURI, option)
// mongoose.connection.on('error', function (err) {
//     if (err) {
//         console.log(err.message);
//         throw err
//     }
// })
mongoose.connect(dbURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); 
  });


module.exports = {
    mongoose,
    models: {
        Users: require('./schemas/users'),
        Message: require('./schemas/message')
    }
}

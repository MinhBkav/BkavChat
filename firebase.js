const admin = require('firebase-admin')
const serviceAccount = require('./bkavchat-a8fae-firebase-adminsdk-fbsvc-74c2ee7e85.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

module.exports = admin
// const serviceAccount = require("../config/web-push-559b6-firebase-adminsdk-8ruqy-5670e6b148.json");
import serviceAccount from "../../config/mtl-ssa-firebase-adminsdk-6y68d-acf213b05e.js";
import firebaseAdmin from "firebase-admin";

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

export {
    firebaseAdmin
}
// code to send Notification
// const token = "dDQ53sEPIHr6Wu5TUvxX5M:APA91bHlYmCT6Veoukmk_AozLrtYRegqhtPZIVHYtz8OeclbTp9jTTCrjuR20orkmAOa9P1yGom4hvfpPgOoDWOsHMr-XHhaftEYUKHfvdzI6oWxwhJrwM_4TuhJAQdD31YPewmC8kiP"
// const message = {
//   notification: {
//     title: "Subscription Purchased successfullY!",
//     body: "Your subscription has been created successfully , now you can enjoy premium benifits"
//   }, token
// }
// const sendMessage = await firebaseAdmin.messaging().send(message)

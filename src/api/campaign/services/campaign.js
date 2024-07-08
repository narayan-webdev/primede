import { firebaseAdmin } from "../../../utils/firebase.js";

export default async ({ title, body, imageUrl, targetType, topic, token, web_notification = false, app_notification = false, wp_notification = false }) => {
    try {
        if (!["token", "topic"].includes(targetType)) {
            return {
                error: {
                    message: "Invalid target type , please choose one from 'token','topic'"
                }
            }
        }
        let message;
        if (web_notification) {
            if (targetType === "topic") {
                message = {
                    notification: {
                        title: title,
                        body: body,
                        image: (imageUrl ? imageUrl : null),
                    },
                    topic: topic
                };
            } else {
                message = {
                    notification: {
                        title: title,
                        body: body,
                        imageUrl: (imageUrl ? imageUrl : null),
                    },
                    token: token
                };
            }
            const sentNotification = await firebaseAdmin.messaging().send(message)
        }
        if (app_notification) {
            if (targetType === "topic") {
                message = {
                    data: {
                        title: title,
                        body: body,
                        image: (imageUrl ? imageUrl : null),
                    },
                    topic: topic
                };
            } else {
                message = {
                    data: {
                        title: title,
                        body: body,
                        imageUrl: (imageUrl ? imageUrl : null),
                    },
                    token: token
                };
            }
            const sentNotification = await firebaseAdmin.messaging().send(message)
        }
        if (wp_notification) {
            // code logic to send wp messagess
        }
        return true
    } catch (error) {
        console.log(error)
        return { error }
    }
}
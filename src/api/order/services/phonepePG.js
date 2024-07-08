import { default as axios } from "axios";
import { createHmac, createHash } from "crypto";
import { v4 as uuidv4 } from 'uuid';

// Function to create a new order
const createNewOrder = (amount, userId) => {
    const orderId = uuidv4();  // Generate a unique order ID
    // Save order details to the database
    // saveOrderToDatabase(orderId, amount, userId);
    return orderId;
};


// const merchantId = 'YOUR_MERCHANT_ID';
// const secretKey = 'YOUR_SECRET_KEY';

const createSignature = (data, secret) => {
    return createHmac('sha256', secret).update(data).digest('base64');
};

export default async ({ merchantId, body, secretKey: salt_key, amount, client, token }) => {
    try {
        // const { amount, userId } = req.body;
        // const orderId = createNewOrder(amount, userId); // Generate order ID
        // const callbackUrl = `http://yourdomain.com/paymentCallback`;
        // const callbackUrl = `https://api-preprod.phonepe.com/apis/pg-sandbox`;

        const merchantTransactionId = 'T' + Date.now();
        const data = {
            merchantId: merchantId,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: "MUID" + Date.now(),
            name: "req.body.name",
            amount: amount * 100,
            redirectUrl: `http://${client}.localhost:4500/api/orders/verify/phonepe?id=${merchantTransactionId}`,
            redirectMode: 'POST',
            mobileNumber: body.consumer.phone,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        // const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
        const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"

        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                // "Authorization": `Bearer ${token}`
            },
            data: {
                request: payloadMain
            }
        };

        const response = await axios.request(options);
        return JSON.parse(JSON.stringify(response.data))

    } catch (error) {
        console.log(error)
        return error
    }
}
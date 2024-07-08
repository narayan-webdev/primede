
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';
// const { access_token, api_key, api_secret } = require('../../config.js');

async function shopify({ api_key, api_secret, access_token, domain }) {
    if (!api_key || !api_secret || !access_token) throw Error("please pass all the required parameters api_key, api_secret, access_token ")
    const shopifyConfig = shopifyApi({
        apiKey: api_key,
        apiSecretKey: api_secret,
        scopes: ["*"],
        hostName: 'https://d16c-115-245-32-174.ngrok-free.app ',
        apiVersion: ApiVersion.April24
    });
    return new shopifyConfig.clients.Rest({ session: { accessToken: access_token, shop: domain } });
}

export default shopify

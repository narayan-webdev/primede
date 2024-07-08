import axios from "axios";
import { mailSender } from "../../../services/emailSender.js";
import { readFileSync } from "fs";
import { render } from "ejs";

export async function makeShipmentOrderBody({ body, client, order, orderVariants, totalSum, globals }) {
  try {
    const address = order.address;

    const order_items = orderVariants.map((orderVariant) => {
      const { quantity, price } = orderVariant;

      return {
        name: `${orderVariant.variant.name}`,
        sku: `${orderVariant.id}`,
        units: quantity.toString(),
        selling_price: price.toFixed(2),
        discount: "0.00",
        tax: "0.00",
        hsn: "0",
      };
    });

    // console.log(order);
    const formattedOrderDate = new Date(order.createdAt).toISOString().split("T")[0];

    const shipmentBody = {
      order_id: order.payment_order_id,
      order_date: formattedOrderDate,
      pickup_location: body.pickup_location,
      reseller_name: client,
      company_name: client,
      billing_customer_name: order.consumer_name,
      billing_last_name: order.consumer_name.split(" ")[1] || "",
      billing_address: address.addressLine1,
      billing_address_2: address.addressLine2 || null,
      billing_isd_code: "91",
      billing_city: address.city,
      billing_pincode: address.pincode,
      billing_state: address.state,
      billing_country: address.country,
      billing_email: order.consumer_email,
      billing_phone: order.consumer_phone,
      shipping_is_billing: true,
      order_items: order_items,
      payment_method: order.payment_mode,
      giftwrap_charges: "0",
      transaction_charges: "0",
      total_discount: "0",
      shipping_charges: "0",
      sub_total: totalSum,
      length: body.length,
      breadth: body.breadth,
      height: body.height,
      weight: body.weight,
      order_type: "ESSENTIALS",
    };

    return shipmentBody;
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export async function makeShipmentReturnBody({ body, client, order, orderVariant, totalSum, shipmentOrderId, sr_token }) {
  try {
    const address = order.dataValues.address;
    // console.log(address)
    const shippingAddress = await getStoreAddressData(sr_token);
    const primaryAddress = shippingAddress.find((address) => address.pickup_location === "Primary");


    const order_items = [{
      name: `${orderVariant.variant.name}`,
      sku: `${orderVariant.id}`,
      units: orderVariant.quantity.toString(),
      selling_price: orderVariant.price.toFixed(2),
      discount: "0.00",
      tax: "0.00",
      hsn: "0",
    }]

    const formattedOrderDate = new Date(order.createdAt).toISOString().split("T")[0];
    // console.log(order)
    const shipmentBody = {
      order_id: shipmentOrderId,
      order_date: formattedOrderDate,
      pickup_customer_name: order.consumer_name,
      pickup_last_name: order.consumer_name.split(" ")[1] || "",
      company_name: client,
      pickup_address: address.addressLine1,
      pickup_address_2: address.addressLine2,
      pickup_city: address.city,
      pickup_state: address.state,
      pickup_country: address.country,
      pickup_pincode: address.pincode,
      pickup_email: order.consumer_email,
      pickup_phone: order.consumer_phone,
      pickup_isd_code: "91",
      shipping_customer_name: primaryAddress.name,
      shipping_last_name: primaryAddress.name.split(" ")[1],
      shipping_address: primaryAddress.address,
      shipping_address_2: primaryAddress.address_2,
      shipping_city: primaryAddress.city,
      shipping_country: primaryAddress.country,
      shipping_pincode: parseInt(primaryAddress.pin_code, 10),
      shipping_state: primaryAddress.state,
      shipping_email: primaryAddress.email,
      shipping_isd_code: "91",
      shipping_phone: parseInt(primaryAddress.phone, 10),
      order_items: order_items,
      payment_method: order.payment_mode,
      total_discount: "0",
      sub_total: totalSum,
      length: body.length,
      breadth: body.breadth,
      height: body.height,
      weight: body.weight,
    };

    return shipmentBody;
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export async function regenerateToken(globals) {
  try {
    console.log("entered in regenerate token");
    console.log(globals)
    const shiprocketUsername = globals.shiprocket_username;
    const shiprocketPassword = globals.shiprocket_password;

    if (!shiprocketUsername || !shiprocketPassword) {
      throw new Error("Shiprocket credentials are missing");
    }

    const shiprocketLoginUrl = "https://apiv2.shiprocket.in/v1/external/auth/login";
    const loginResponse = await post(shiprocketLoginUrl, {
      email: shiprocketUsername,
      password: shiprocketPassword,
    });

    console.log(loginResponse)

    const shiprocketToken = loginResponse.data.token;

    await globals.update({ shiprocket_token: shiprocketToken });

    return shiprocketToken;
  } catch (error) {
    console.log(error);
    throw error
    // return { error }
  }
}

export async function createShiprocketReturn(
  shiprocketReturnApi,
  returnOrderData,
  headers
) {
  try {
    console.log("entered in shiprocket order API");

    return shiprocketResponse.data;
  } catch (error) {
    return { error: error };
  }
}

export async function sendOrderInTransitEmail(order) {
  try {
    const price = order.totalSum;
    const slug = order.slug;
    const name = order.consumer_name;
    const discount = 0;

    const htmlContent = readFileSync("./views/orderInTransit.ejs", "utf8");
    const renderedContent = render(htmlContent, {
      price,
      slug,
      name,
      discount,
    });

    console.log(order.store_user.email);

    await mailSender({
      to: order.store_user.email,
      subject: "Order In Transit",
      html: renderedContent,
    });

    console.log("Order in transit email sent successfully");
  } catch (error) {
    console.log("Error sending order in transit email:", error.message);
  }
}

const getStoreAddressData = async (sr_token) => {
  try {
    const apiUrl =
      "https://apiv2.shiprocket.in/v1/external/settings/company/pickup";

    const response = await get(apiUrl, {
      headers: {
        Authorization: `Bearer ${sr_token}`,
      },
    });

    const storeAddressData = response.data.data.shipping_address;

    return storeAddressData;
  } catch (error) {
    console.log("Error in getting store address data:", error.message);
    return { error };
  }
};

import { randomBytes } from "crypto";
import Order from "../models/order.js";
import Order_variant from "../../order_variant/models/order_variant.js";

export async function createOrderVaraint({ razorpayOrder, UserId, body,  transaction, variantsPrice }) {
  try {
    const order = await Order.create(
      {
        slug: generateOrderId(),
        consumer_name: body.consumer.name,
        consumer_email: body.consumer.email,
        consumer_phone: body.consumer.phone,
        payment_order_id: razorpayOrder.id,
        price: razorpayOrder.amount / 100,
        UserId: UserId,
        payment_mode: body.payment_mode,
        status: "new",
        AddressId: body.AddressId,
        is_paid: false,
      },
      { transaction } // Use the provided transaction if available
    );

    let order_variants_body = [];

    for (const [i, it] of body.variants.entries()) {
      let obj = {};
      obj["quantity"] = it.quantity;
      obj["VariantId"] = it.VariantId;
      obj["price"] = variantsPrice[it.VariantId];
      obj["status"] = "NEW";
      obj["OrderId"] = order.id;
      order_variants_body.push(obj);
    }

    const orderVariant = await Order_variant.bulkCreate(order_variants_body, { transaction });

    return order.id
  } catch (error) {
    console.log(error);
    throw error;
  }
}



const generateOrderId = () => {
  const order_id_prefix = "ORD";
  const order_id_length = 10;
  const generatedOrderId = order_id_prefix + randomBytes(order_id_length / 2).toString("hex").toUpperCase();
  return generatedOrderId;
};

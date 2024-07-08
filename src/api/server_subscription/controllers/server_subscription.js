// Controller function to create a new post
import { uid } from "uid";

import * as jwt from "../../../services/jwt.js";
import { createHmac } from "crypto";
import { getPagination, getMeta } from "../../../services/pagination.js";

// firebase credentials

import getWebhookBody from "../services/getWebhookBody.js";
import payment_log from "../../payment_log/models/payment_log.js";
import orderBy from "../../../services/orderBy.js";
import { getRazorpay as razorpay } from "../../../utils/gateway.js";
import { default as axios } from "axios";
import { errorResponse } from "../../../services/errorResponse.js";
import { getDate, getValidToDates } from "../../../services/date.js";
import dbCache from "../../../utils/dbCache.js";
import { mode as _mode, purpose as _purpose, txn_type as _txn_type } from "../../../constants/transaction.js";


export async function create(req, res) {
  try {
    console.log("inside creat subs");

    const body = req.body;
    const valid_from = getDate();

    const valid_to = getValidToDates(10);
    console.log(valid_from, valid_to);
    const subscription = await Server_subscription.create({
      order_id: `OID_${uid(10)}`,
      payment_id: `PID_${uid(10)}`,
      order_type: body.order_type,
      valid_from: valid_from,
      valid_to: valid_to,
      PlanId: body.plan_id,
      purchaseType: "CASH",
    });
    return res.status(200).send(subscription);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to create a subscription" });
  }
}

// Controller function to get all posts
export async function find(req, res) {
  try {

    const query = req.query;
    const order = orderBy(query);
    const pagination = await getPagination(query.pagination);
    const whereClause = {}
    if (query.hasOwnProperty("status")) {
      if (!["ACTIVE", "REFUNDED", "EXPIRED"].includes(query.status)) return res.status(400).send(errorResponse({ message: `Invalid status type select one of ["ACTIVE", "REFUNDED", "EXPIRED"]` }))
      else whereClause.status = query.status
    }
    if (query.hasOwnProperty("mode")) {
      if (!["ONLINE", "CASH"].includes(query.mode)) return res.status(400).send(errorResponse({ message: `Invalid mode type select one of ["ONLINE", "CASH"]` }))
      else whereClause.purchaseType = query.mode
    }
    if (query.hasOwnProperty("paid")) {
      if (!["true", "false"].includes(query.paid)) return res.status(400).send(errorResponse({ message: `Invalid paid type select one of ["true", "false"]` }))
      else whereClause.is_paid = query.paid
    }

    console.log(whereClause)
    const subscriptions = await Server_subscription.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
      order: order,
      where: whereClause
    })


    const meta = await getMeta(pagination, subscriptions?.count);

    return res.status(200).send({ data: subscriptions?.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch subscriptions" });
  }
}

export async function findOne(req, res) {
  try {

    const { id } = req.params;
    const subscription = await Server_subscription.findByPk(
      id,
      { include: { model: sequelize.models.Plan, as: "plan" } }
    );
    if (!subscription)
      return res
        .status(400)
        .send(errorResponse({ message: "Invalid Subscription ID" }));
    return res.status(200).send(subscription);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch subscription" });
  }
}


export async function update(req, res) {
  try {

    const { id } = req.params;
    const getsubscription = await Server_subscription.findByPk(
      id
    );

    if (!getsubscription)
      return res
        .status(400)
        .send(errorResponse({ message: "Invalid Subscription ID" }));
    const subscription = await Server_subscription.update(
      req.body,
      {
        where: { id },
        returning: true,
      }
    );
    return res
      .status(200)
      .send({
        message: "subscription updated successfully!",
        data: subscription[1][0],
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch subscription" });
  }
}


const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const getsubscription = await Server_subscription.findByPk(
      id
    );

    if (!getsubscription)
      return res
        .status(400)
        .send(errorResponse({ message: "Invalid ID to delete" }));
    const subscription = await Server_subscription.destroy({
      where: { id },
    });
    return res
      .status(200)
      .send({ message: "subscription deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch subscription" });
  }
};
export { _delete as _delete };


export async function checkOut(req, res) {
  try {
    const sequelize = get("main_instance");
    const global = await Global.findOne();
    const GATEWAY = global.selected_payment_gateway;
    const user = await User.findOne({
      where: { subdomain: req.subdomain },
    });
    if (!user)
      return res
        .status(400)
        .send(
          errorResponse({
            message: "Invalid request",
            details: "Could Not find Tenant!",
          })
        );
    const amount =
      Number((global.subscription_price / 100) * 2) +
      Number(global.subscription_price);
    console.log(amount);
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: req.subdomain + "/" + require("uid").uid(10).toUpperCase(),
    };

    const createSubscription = async (order) => {
      try {
        const valid_from = getDate();
        const valid_to = getValidToDates(global.subscription_validity);
        const subscription = await Server_subscription.create({
          order_id: order.id || order,
          valid_from: valid_from,
          valid_to: valid_to,
          // "purchaseType": "ONLINE",
          UserId: 2,
        });
      } catch (error) {
        console.log(error);
      }
    };

    switch (GATEWAY) {
      case "RAZORPAY":
        const prePaidSubscription = razorpay.orders.create(
          options,
          async function (error, order) {
            if (error) {
              return res.status(error.statusCode).send(
                errorResponse({
                  status: error.statusCode,
                  message: error.error.reason,
                  details: error.error.description,
                })
              );
            }
            await createSubscription(order);
            return res.status(200).send({ data: order });
          }
        );
        break;
      case "CASHFREE":
        const user = await User.findByPk(token.id);
        const uuid = uid(10);
        const order_id = `CFPG_${uuid}`;
        const response = await axios.post(
          "https://sandbox.cashfree.com/pg/orders",
          {
            customer_details: {
              customer_id: "7112AAA812234",
              customer_phone: "9908734801",
              customer_email: user.email,
            },
            order_meta: {
              return_url: `http://localhost:4500/api/subscriptions/cf-verify?order_id=${order_id}`,
              notify_url: "http://localhost:4500/api",
            },
            order_id: order_id,
            order_amount: amount,
            order_currency: "INR",
          },
          {
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "x-api-version": "2022-09-01",
              "x-client-id": process.env.CASHFREE_CLIENT_ID,
              "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
            },
          }
        );

        const data = response.data;
        // Create a subscription
        await createSubscription(order_id);
        return res.status(200).send({ data });

        break;
      case "PHONEPE":
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch subscription" });
  }
}

export async function verify(req, res) {
  try {
    const tenant_sequelize = req.db;
    const sequelize = get("main_instance");
    const jwt_token = jwt.verify(req);
    const body = req.body;
    const { razorpay_signature, razorpay_payment_id, razorpay_order_id } = body;
    const razorpay_OP_id = razorpay_order_id + "|" + razorpay_payment_id;
    const generateSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_OP_id.toString())
      .digest("hex");

    if (generateSignature === razorpay_signature) {
      console.log("signature verified!");
      const order = await razorpay.orders.fetch(razorpay_order_id)
      const [rows_count, [subscription]] = await Server_subscription.update(
        {
          is_paid: true,
          payment_id: razorpay_payment_id,
          status: "ACTIVE",
        },
        {
          where: { order_id: razorpay_order_id },
          returning: true,
        }
      );
      // code to store store admin subscription log to shared db +++++++++++++++
      delete subscription.dataValues.id
      const store_server_subscription = await tenant_sequelize.models.Store_server_subscription.create({ ...subscription.dataValues, UserId: jwt_token.id })
      await adminTransaction({ UserId: jwt_token.id, amount: order.amount / 100, mode: _mode.MONEY, purpose: _purpose.PURCHASE, txn_type: _txn_type.CREDIT })
      return res.status(200).send({ message: "Transaction Successful!", data: store_server_subscription })
    } else {
      return res.status(400).send(
        errorResponse({
          message: "Bad Request!",
          details:
            "razorpay_signature and generated signature did not matched!",
        })
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
export async function CFVerify(req, res) {
  try {

    const token = jwt.verify(req);
    const body = req.body;
    const orderId = req.query.order_id;
    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          accept: "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
        },
      }
    );

    const cashfree = response.data;
    console.log(cashfree);
    if (cashfree.order_status === "PAID") {
      const subscription = await Server_subscription.update(
        {
          is_paid: true,
          payment_id: cashfree.payment_session_id,
          status: "ACTIVE",
        },
        {
          where: { order_id: cashfree.order_id },
        }
      );
      return res
        .status(200)
        .send(
          errorResponse({ message: "subscription purchased successfully!" })
        );
    } else {
      return res
        .status(200)
        .send(errorResponse({ message: "Invalid Request!" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function refund(req, res) {
  try {
    const subscription = req.body.subscription;
    console.log(subscription);
    const refund = await razorpay.payments.refund(subscription.payment_id, {
      amount: subscription.plan.price * 100,
      speed: "normal",
    });
    if (refund) {
      const updateSubsciption =
        await Server_subscription.update(
          { status: "REFUNDED" },
          { where: { id: subscription.id } }
        );
    }
    return res
      .status(200)
      .send({ message: "Refund Created", data: refund, subscription });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function webhook(req, res) {
  try {
    const body = req.body;

    const hookSignature = createHmac(
      "sha256",
      process.env.RAZORPAY_WEBHOOK_SECRETE
    );
    hookSignature.update(JSON.stringify(req.body));
    const digest = hookSignature.digest("hex");

    if (digest !== req.headers["x-razorpay-signature"]) {
      return res.status(400).send({ error: "Invalid Request!" });
    }

    const webHookBody = await getWebhookBody(req);
    const payment_log = sequelize.models.Payment_log.create(webHookBody);
    return res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
export async function CFWebhook(req, res) {
  try {

    const ts = req.headers["x-webhook-timestamp"];
    const signature = req.headers["x-webhook-signature"];
    const currTs = Math.floor(new Date().getTime() / 1000);

    if (currTs - ts > 30000) {
      return res
        .status(400)
        .send(errorResponse({ message: "Invalid Request!" }));
    }

    const tsBody = ts + rawBody;
    const secretKey = process.env.CASHFREE_CLIENT_SECRET;
    let genSignature = createHmac("sha256", secretKey)
      .update(tsBody)
      .digest("base64");

    if (signature === genSignature) {
      console.log("signature is verified");
      const webHookBody = await getWebhookBody(req);
      const payment_log = await Payment_log.create(
        webHookBody
      );
      return res.status(200).send("OK");
    } else {
      return res
        .status(400)
        .send(errorResponse({ message: "Invalid Request!" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
}

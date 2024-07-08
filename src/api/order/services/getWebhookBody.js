export default async (req, gateway) => {


  let payObject;

  switch (gateway) {
    case "RAZORPAY":
      let method = req.body.payload.payment.entity.method;
      const payload = req.body.payload;
      switch (method) {
        case "upi":
          payObject = {
            order_id: payload.payment.entity.order_id,
            payment_id: payload.payment.entity.id,
            amount: payload.payment.entity.amount,
            amount_refunded: payload.payment.entity.amount_refunded,
            currency: payload.payment.entity.currency,
            status: payload.payment.entity.status,
            method: payload.payment.entity.method,
            captured: payload.payment.entity.captured,
            card_id: payload.payment.entity.card_id,
            card: null,
            last4: null,
            bank: null,
            wallet: null,
            vpa: payload.payment.entity.vpa,
            email: payload.payment.entity.email,
            contact: payload.payment.entity.contact,
            notes: payload.payment.entity.contact,
          };
          break;
        case "card":
          payObject = {
            order_id: payload.payment.entity.order_id,
            payment_id: payload.payment.entity.id,
            amount: payload.payment.entity.amount,
            amount_refunded: payload.payment.entity.amount_refunded,
            currency: payload.payment.entity.currency,
            status: payload.payment.entity.status,
            method: payload.payment.entity.method,
            captured: payload.payment.entity.captured,
            card_id: payload.payment.entity.card_id,
            card: payload.payment.entity.card.type,
            last4: payload.payment.entity.card.last4,
            network: payload.payment.entity.card.network,
            bank: null,
            wallet: null,
            vpa: payload.payment.entity.vpa,
            email: payload.payment.entity.email,
            contact: payload.payment.entity.contact,
            notes: payload.payment.entity.contact,
            client: null,
          };
          break;
        case "netbanking":
          payObject = {
            order_id: payload.payment.entity.order_id,
            payment_id: payload.payment.entity.id,
            amount: payload.payment.entity.amount,
            amount_refunded: payload.payment.entity.amount_refunded,
            currency: payload.payment.entity.currency,
            status: payload.payment.entity.status,
            method: payload.payment.entity.method,
            captured: payload.payment.entity.captured,
            card_id: payload.payment.entity.card_id,
            card: null,
            last4: null,
            network: null,
            bank: payload.payment.entity.bank,
            wallet: null,
            vpa: payload.payment.entity.vpa,
            email: payload.payment.entity.email,
            contact: payload.payment.entity.contact,
            notes: payload.payment.entity.contact,
            client: null,
          };
          break;
        case "wallet":
          payObject = {
            order_id: payload.payment.entity.order_id,
            payment_id: payload.payment.entity.id,
            amount: payload.payment.entity.amount,
            amount_refunded: payload.payment.entity.amount_refunded,
            currency: payload.payment.entity.currency,
            status: payload.payment.entity.status,
            method: payload.payment.entity.method,
            card_id: payload.payment.entity.card_id,
            card: null,
            last4: null,
            network: null,
            bank: null,
            wallet: null,
            vpa: payload.payment.entity.vpa,
            email: payload.payment.entity.email,
            contact: payload.payment.entity.contact,
            notes: payload.payment.entity.contact,
            client: null,
          };
          break;

        default:
          break;
      }

      break;

    case "PHONEPE":
      break;

    case "CASH_FREE":
      const paymentMethod = Object.keys(req.body.data.payment.payment_method)[0];
      const data = req.body.data;
      switch (paymentMethod) {
        case "upi":
          payObject = {
            order_id: data.order.order_id,
            payment_id: data.payment.cf_payment_id,
            amount: data.payment.payment_amount,
            currency: data.order.order_currency,
            status: data.payment.payment_status,
            method: "upi",
            card_id: null,
            card: null,
            bank: null,
            wallet: null,
            vpa: data.payment.payment_method.upi.upi_id,
            email: data.customer_details.customer_email, // Add customer email if available
            contact: data.customer_details.customer_phone,
            notes: "upi details",
            captured: "true",
          };
          break;

        case "card":
          payObject = {
            order_id: data.order.order_id,
            payment_id: data.payment.cf_payment_id,
            amount: data.payment.payment_amount,
            currency: data.order.order_currency,
            status: data.payment.payment_status,
            method: "card",
            card_id: null, // Add card ID if available
            card: data.payment.payment_method.card.card_type,
            last4: data.payment.payment_method.card.card_number.slice(-4),
            network: data.payment.payment_method.card.card_network,
            bank: data.payment.payment_method.card.card_bank_name,
            wallet: null,
            vpa: null,
            email: data.customer_details.customer_email, // Add customer email if available
            contact: data.customer_details.customer_phone,
            notes: "card details",
            captured: "true",
          };
          break;

        case "netbanking":
          payObject = {
            order_id: data.order.order_id,
            payment_id: data.payment.cf_payment_id,
            amount: data.payment.payment_amount,
            currency: data.order.order_currency,
            status: data.payment.payment_status,
            method: "netbanking",
            card_id: null,
            card: null,
            last4: null,
            network: null,
            bank: data.payment.payment_method.netbanking.netbanking_bank_name,
            wallet: null,
            vpa: null,
            email: data.customer_details.customer_email, // Add customer email if available
            contact: data.customer_details.customer_phone,
            notes: "netbaking details",
            captured: "true",
          };
          break;

        case "app":
          payObject = {
            order_id: data.order.order_id,
            payment_id: data.payment.cf_payment_id,
            amount: data.payment.payment_amount,
            currency: data.order.order_currency,
            status: data.payment.payment_status,
            method: "wallet",
            card_id: null,
            card: null,
            last4: null,
            network: null,
            bank: null,
            wallet: data.payment.payment_method.app.provider,
            vpa: null,
            email: data.customer_details.customer_email,
            contact: data.customer_details.customer_phone,
            notes: "wallet details",
            captured: "true",
          };
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
  return payObject;
};

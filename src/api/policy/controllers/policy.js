// controllers/StorePolicyController.js

import { errorResponse } from "../../../services/errorResponse.js";
import Policy from '../models/policy.js';

export async function create(req, res) {
  try {

    const getStorePolicy = await Policy.findOne();

    if (getStorePolicy) {
      const updateStorePolicy = await Policy.update(req.body, {
        where: { id: getStorePolicy.id },
        returning: true,
      });

      return res.status(200).send({
        message: "Store Plicy updated",
        data: updateStorePolicy[1][0],
      });
    } else {
      const StorePolicy = await Policy.create(req.body);
      return res.status(200).send({
        message: "Store Plicy Created Successfully",
        data: StorePolicy,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ message: "Internal Server Error", status: 500 }));
  }
}

export async function get(req, res) {
  try {

    const attributes = ["about_us", "terms_and_conditions", "privacy_policy", "refund_and_cancellation", "ship_and_delivery", "contact_us",]
    const tag = req.query.tag;
    if (tag && !attributes.includes(tag)) return res.status(400).send(errorResponse({ message: `invalid tag passed select on from ${attributes}` }))
    const StorePolicy = await Policy.findOne({
      attributes: (tag ? [tag] : null)
    });
    return res.status(200).send({ data: StorePolicy });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ message: "Internal Server Error", status: 500 }));
  }
}

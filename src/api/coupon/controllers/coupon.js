import { getPagination, getMeta } from "../../../services/pagination.js";
import { errorResponse } from "../../../services/errorResponse.js";
import orderBy from "../../../services/orderBy.js";
import Coupon from "../models/coupon.js";

export async function create(req, res) {
  try {

    const coupon_code = req.body.coupon_code.toUpperCase();
    const body = req.body;
    body["coupon_code"] = coupon_code;
    const coupon = await Coupon.findOne({
      where: { coupon_code: coupon_code },
    });

    if (coupon) {
      return res.send(
        errorResponse({ status: 400, message: "Coupon Code Already Exists" })
      );
    }

    const new_coupon = await Coupon.create(body);

    return res.status(200).send({ data: new_coupon });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to create a coupon" });
  }
}

// Controller function to get all posts
export async function find(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const order = orderBy(req.query)
    const coupons = await Coupon.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,
      include: ["image"]
    });
    const meta = await getMeta(pagination, coupons.count);
    return res.status(200).send({ data: coupons.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch coupons" });
  }
}

export async function findOne(req, res) {
  try {

    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    }
    return res.status(200).send(coupon);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch coupon" });
  }
}


export async function update(req, res) {
  try {

    const { id } = req.params;
    const getcoupon = await Coupon.findByPk(id);

    if (!getcoupon) {
      return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    }
    const coupon = await Coupon.update(req.body, {
      where: { id },
      returning: true,
    });
    return res
      .status(200)
      .send({ message: "coupon updated", data: coupon[1][0] });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Failed to fetch coupon" });
  }
}


const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const getcoupon = await Coupon.findByPk(id);

    if (!getcoupon) {
      return res.status(400).send(errorResponse({ message: "Invalid ID" }));
    }
    const coupon = await Coupon.destroy({ where: { id } });
    return res.status(200).send({ message: "coupon deleted!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch coupon" });
  }
};
export { _delete as _delete };

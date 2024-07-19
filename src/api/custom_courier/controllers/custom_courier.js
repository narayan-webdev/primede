import { order_status } from "../../../constants/order.js";
import { errorResponse } from "../../../services/errorResponse.js";
import orderTracker from "../../../services/orderTracker.js";
import { getPagination, getMeta } from "../../../services/pagination.js";
import Custom_courier from "../models/custom_courier.js";

export async function create(req, res) {
  const t = await sequelize.transaction();
  try {


    const customCourier = await Custom_courier.create(req.body);

    if (req.body.images && req.body.images.length) {
      const imageIds = req.body.images;

      const orderImages = imageIds.map((imageId) => ({
        CustomCourierId: customCourier.id,
        MediaId: imageId,
      }));

      const customCourierLinks = await Courier_media_link.bulkCreate(orderImages, { transaction: t });
    }

    await Order_variant.update(
      { status: order_status.intransit, CustomCourierId: customCourier.id },
      { where: { id: req.body.OrderVariantId }, transaction: t }
    );
    await orderTracker({
      sequelize,
      order_variant_ids: [req.body.OrderVariantId],
      status: order_status.intransit,
      transaction: t,
    });

    await t.commit();

    return res.status(200).send({
      message: "Customer Courier Created Successfully!",
      data: customCourier,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Some Internal server error occurred!",
      })
    );
  }
}

export async function productReturn(req, res) {
  const t = await sequelize.transaction();
  try {


    await Order_variant.update(
      { status: order_status.return_request },
      { where: { id: req.body.OrderVariantId } }
    );
    await orderTracker({
      sequelize,
      order_variant_ids: [req.body.OrderVariantId],
      status: order_status.return_request,
      transaction: t,
    });

    await t.commit();

    return res.status(200).send({
      message: "Return Order Created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Some Internal server error occurred!",
      })
    );
  }
}

export async function update(req, res) {
  try {

    const customCourierId = req.params.id;
    const [updatedRowsCount, updatedCustomCourier] =
      await Custom_courier.update(req.body, {
        where: { id: customCourierId },
        returning: true,
      });
    if (updatedRowsCount === 0) {
      return res.status(404).send(errorResponse({ message: "Custom courier ID" }));
    }
    return res.status(200).send({
      message: "Customer Courier Updated Successfully!",
      data: updatedCustomCourier[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({
      status: 500,
      message: "Some Internal server error occured! ",
    }));
  }
}

export async function find(req, res) {
  try {


    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const customCouriers = await Custom_courier.findAndCountAll({
      limit: pagination.limit,
      offset: pagination.offset,
    });
    const meta = await getMeta(pagination, customCouriers.count);
    return res.status(200).send({ data: customCouriers.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function findOne(req, res) {
  try {

    const customCourierId = req.params.id;
    const customCourier = await Custom_courier.findOne({
      where: { id: customCourierId },
    });
    if (!customCourier) {
      return res.status(404).send(errorResponse({ message: "Invalid ID find custom courier" }));
    }
    return res.status(200).send({ data: customCourier });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

const _delete = async (req, res) => {
  try {

    const customCourierId = req.params.id;
    const deletedRowCount = await Custom_courier.destroy({
      where: { id: customCourierId },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send(errorResponse({ message: "Invalid ID to delete" }));
    }
    return res.status(200).send({ message: "Custom Courier Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};
export { _delete as _delete };

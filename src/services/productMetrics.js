import Product_metrics from "../api/product_metrics/models/product_metrics.js";

export default async ({ product_id = [], field_name, transaction, order_variant = [] }) => {
  try {
    if (product_id.length > 0) {
      for (const item of product_id) {
        const getMetric = await Product_metrics.findOne({
          where: { ProductId: item },
        });
        if (getMetric) {
          await getMetric.increment(
            { [field_name]: 1 },
            {
              where: { ProductId: item },
              transaction: transaction,
            }
          );
        } else {
          await Product_metric.create(
            {
              [field_name]: 1,
              ProductId: item,
            },
            { transaction: transaction }
          );
        }
      }
    } else if (order_variant.length > 0 && Array.isArray(order_variant)) {
      for (const item of order_variant) {
        const getMetric = await Product_metrics.findOne({
          where: { ProductId: item.variant.ProductId },
        });
        if (getMetric) {
          await getMetric.increment(
            { [field_name]: item.price },
            {
              where: { ProductId: item.variant.ProductId },
              transaction: transaction,
            }
          );
        } else {
          await Product_metrics.create(
            { [field_name]: item.price, ProductId: item.variant.price },
            { transaction: transaction }
          );
        }
      }
    } else {
      return { error: "Invalid data" };
    }
  } catch (error) {
    console.log(error);
  }
};

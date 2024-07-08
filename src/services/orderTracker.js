import Order_status_tracker from "../api/order_status_tracker/models/order_status_tracker.js"

export default async ({ transaction, order_variant_ids = [], status }) => {
    try {
        let array = order_variant_ids.map((id) => {
            return {
                OrderVariantId: id,
                status: status
            }
        })
        const order_status_tracker = await Order_status_tracker.bulkCreate(array, { transaction: transaction })
    } catch (error) {
        console.log(error)
    }
}

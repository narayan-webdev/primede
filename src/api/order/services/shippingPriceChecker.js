export default async ({ global, variantsArray, variantsPrice }) => {
    try {
        let variants = variantsArray
        variants.forEach((item) => {
            item.price = +variantsPrice[item.id]
        })
        let shippingPrice = 0;
        for (const variant of variants) {
            if (variant.product.shipping_value && variant.product.shipping_value_type) {
                switch (variant.product.shipping_value_type) {
                    case "SHIPPING_PRICE":
                        shippingPrice += +variant.product.shipping_value
                        console.log("product shipping price")
                        break;
                    case "SHIPPING_PERCENTAGE":
                        shippingPrice += +variant.product.shipping_value / 100 * variant.price
                        console.log("product shipping percentage")
                        break;
                    default:
                        break;
                }
            } else {
                if (global.shipping_price && global.shipping_value_type) {
                    switch (global.shipping_value_type) {
                        case "PRICE":
                            shippingPrice += +global.shipping_value
                            console.log("global shipping price")
                            break;
                        case "PERCENTAGE":
                            shippingPrice += +global.shipping_value / 100 * variant.price
                            console.log("global shipping percentage")
                            break;

                        default:
                            break;
                    }
                }
            }
        }

        return shippingPrice
    } catch (error) {
        return { error }
    }
}
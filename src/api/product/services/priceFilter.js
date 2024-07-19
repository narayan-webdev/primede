import Product_metrics from "../../product_metrics/models/product_metrics.js";
import Variant from "../../variant/models/variant.js";

export default (query) => {
    delete query.category
    const orderBy = query.orderBy ? Object.keys(query.orderBy).map((key) => {
        switch (key) {
            case "price":
                const sortOrder = query.orderBy[key] === "low-to-high" ? "ASC" : "DESC";
                return [
                    { model: Variant, as: "variants" },
                    "price",
                    sortOrder,
                ];
            case "share":
                const sortShare = query.orderBy[key];
                return [
                    { model: Product_metrics, as: "product_metrics", },
                    "shares_count",
                    sortShare,
                ];
            case "revenue":
                const revShare = query.orderBy[key];
                return [
                    { model: Product_metrics, as: "revenue_generated" },
                    "revenue_generated",
                    revShare,
                ];
            case "order":
                const orderShare = query.orderBy[key];
                return [
                    { model: Product_metrics, as: "ordered_count" },
                    "ordered_count",
                    orderShare,
                ];

            case "date":
                return ["createdAt", query.orderBy[key]];
            default:
                return [key, query.orderBy[key]];
        }
    })
        : [["createdAt", "DESC"]];

    return orderBy;
};
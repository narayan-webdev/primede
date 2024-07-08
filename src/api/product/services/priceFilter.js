export default (query, sequelize) => {
    delete query.category
    const orderBy = query.orderBy ? Object.keys(query.orderBy).map((key) => {
        switch (key) {
            case "price":
                const sortOrder = query.orderBy[key] === "low-to-high" ? "ASC" : "DESC";
                return [
                    { model: sequelize.models.Variant, as: "variants" },
                    "price",
                    sortOrder,
                ];
            case "share":
                const sortShare = query.orderBy[key];
                return [
                    { model: sequelize.models.Product_metric, as: "product_metrics", },
                    "shares_count",
                    sortShare,
                ];
            case "revenue":
                const revShare = query.orderBy[key];
                return [
                    { model: sequelize.models.Product_metric, as: "revenue_generated" },
                    "revenue_generated",
                    revShare,
                ];
            case "order":
                const orderShare = query.orderBy[key];
                return [
                    { model: sequelize.models.Product_metric, as: "ordered_count" },
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
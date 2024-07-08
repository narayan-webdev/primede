import shopify from "./shopify.js";
import sequelize from './../../../../database/index.js';
import Product from "../models/product.js";
import Category from "../../category/models/category.js";
import Variant from "../../variant/models/variant.js";
import Media from "../../upload/models/media.js";
const Product_gallery = sequelize.models.Product_gallery
export default async ({  api_key, api_secret, access_token , domain }) => {

    const transaction = await sequelize.transaction();
    try {

        const client = await shopify({ api_key, access_token, api_secret,domain })

        const count = await client.client.get("/products/count", {

        })
        const total_count = await count.json();
        console.log(total_count)
        const loop_count = Math.ceil(total_count.count / 250);
        console.log(loop_count)
        let page_info = null;
        const whereClause = {};

        if (!page_info) {
            whereClause.page_info = page_info;
        }
        for (let i = 0; i < loop_count; i++) {
            const res = await client.client.get("/products", {
                searchParams: {
                    limit: 250,
                    fields: ["id", "title", "body_html", "product_type", "tags", "status", "variants", "images", "image",],

                    ...(page_info ? { page_info: page_info, rel: "next" } : null),
                }

            })
            const products = await res.json()

            if (i === 0) {
                console.log(res.headers.get("link"))
                const [temp_page_info, temp_rel] = res.headers.get("link").split("page_info")[1].split(";")
                page_info = temp_page_info.slice(1, temp_page_info.length - 1)
                whereClause.page_info = page_info;
            } else {
                console.log(res.headers.get("link"))
                const [temp_page_info, temp_rel] = res.headers.get("link").split("page_info")[res.headers.get("link").split("page_info").length - 1].split(";")
                page_info = temp_page_info.slice(1, temp_page_info.length - 1)
                whereClause.page_info = page_info;
            }


            for (const item of products.products) {
                const [category, rows] = await Category.findOrCreate({
                    where: { name: item.product_type },
                    transaction: transaction
                })

                const product_thumbnail = await Media.create({
                    "name": item?.image?.alt,
                    "url": item?.image?.src,
                    "width": item.image?.width,
                    "height": item.image?.height
                }, { transaction: transaction })

                const gallImages = item.images.map((item) => {
                    return {
                        name: item?.alt,
                        url: item?.src,
                        width: item?.width,
                        height: item?.height
                    }
                })
                const product_gallery = await Media.bulkCreate(gallImages, { transaction: transaction })

                const proudct = await Product.create({
                    name: item.title,
                    description: item.body_html,
                    ThumbnailId: product_thumbnail.id,
                    is_active: true,
                    shipping_value: 0,
                    shipping_value_type: "SHIPPING_PRICE",
                    CategoryId: category.id,
                    cod_enabled: true,
                    product_return: true,
                    rating: 4.5,
                    enquiry_enabled: true,
                    show_price: true
                }, { transaction: transaction })

                const product_gallery_array = product_gallery.map((item) => {
                    return { MediaId: item.id, ProductId: proudct.id }
                })
                await Product_gallery.bulkCreate(product_gallery_array, { transaction: transaction })
                for (const v of item.variants) {
                    const image = item.images.find((item) => item.id === v.image_id) ?? item.image
                    const variant_thumbnail = await Media.create({
                        name: "image.alt",
                        width: image?.width,
                        height: image?.height,
                        url: image?.src
                    }, { transaction: transaction })

                    const variants = await Variant.create({
                        "name": v.title || v.name,
                        "price": v.price,
                        "premium_price": null,
                        "strike_price": v.compare_at_price,
                        "quantity": v.inventory_quantity,
                        "is_active": true,
                        "ProductId": proudct.id,
                        "ThumbnailId": variant_thumbnail.id,
                    }, { transaction: transaction })
                }
            }
        }
        await transaction.commit()
        return true
    } catch (error) {
        console.log(error)
        await transaction.rollback()
        return false
    }
}


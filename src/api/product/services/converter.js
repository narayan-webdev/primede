import csv from "csvtojson"
export async function converToJson(csvFilePath) {
    const jsonObj = await csv().fromFile(csvFilePath)
    return jsonObj
}

export function convertToOriginalStructure(data) {
    const productMap = {};

    data.forEach(item => {
        if (!productMap[item.id]) {
            productMap[item.id] = {
                name: item.name,
                description: item.description,
                short_description: item.short_description,
                is_active: item.is_active,
                cod_enabled: item.cod_enabled,
                product_return: item.product_return,
                shipping_value: item.shipping_value,
                enquiry_enabled: item.enquiry_enabled,
                show_price: item.show_price,
                shipping_value_type: item.shipping_value_type,
                yt_video_link: item.yt_video_link,
                rating: +item.rating,
                CategoryId: +item.CategoryId,
                SubCategoryId: +item.SubCategoryId,
                ThumbnailId: +item.ThumbnailId,
                SizeChartId: +item.SizeChartId,
                ratings: item.ratings,
                variants: [],
                thumbnail: {
                    name: item.variant_thumbnail_name,
                    url: item.variant_thumbnail_url
                },
                category: {
                    name: item.category_name
                },
                sub_category: {
                    name: item.sub_category_name
                },
                tags: item.tag_ids.split(',').map((id, index) => ({
                    name: item.tag_names.split(',')[index]
                })),
                gallery: item.product_gallery_id.split(',').map((id, index) => ({
                    name: item.product_gallery_name.split(',')[index],
                    url: item.product_gallery_url.split(',')[index]
                }))
            };
        }

        productMap[item.id].variants.push({
            name: item.variant_name,
            price: +item.variant_price,
            strike_price: +item.variant_strike_price,
            quantity: +item.variant_quantity,
            ProductId: +item.id,
            PrimaryAttributeId: item.PrimaryAttributeId,
            SecondaryAttributeId: item.SecondaryAttributeId,
            ThumbnailId: +item.variant_thumbnail_id,
            thumbnail: {
                name: item.variant_thumbnail_name,
                url: item.variant_thumbnail_url
            },
            gallery: item.variant_gallery_id.split(',').map((id, index) => ({
                name: item.variant_gallery_name.split(',')[index],
                url: item.variant_gallery_url.split(',')[index]
            })),
            primary_attribute: {
                value: item.PrimaryAttributeValue,
                hex_code: item.PrimaryAttributeHexCode,
                AttributeId: item.PrimaryAttributeId,
                attribute: {
                    name: item.PrimaryAttributeName
                }
            },
            secondary_attribute: {
                value: item.SecondaryAttributeValue,
                hex_code: item.SecondaryAttributeHexCode,
                AttributeId: item.SecondaryAttributeId,
                attribute: {
                    name: item.SecondaryAttributeName
                }
            }
        });
    });

    return Object.values(productMap);
}
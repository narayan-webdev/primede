import { create } from "pdf-creator-node";
import { readFileSync } from "fs";
import { join } from "path";


var html = readFileSync(join(process.cwd(), "views/product.html"), "utf8");

var options = {
    // format: "",
    // size: ["100", "100"],
    width: "600", height: "500",
    orientation: "portrait",
    border: "10mm",
    // header: {
    //     height: "20mm",
    //     contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
    // },
    footer: {
        height: "28mm",
        // contents: {
        //     first: 'Cover page',
        //     2: 'Second page', // Any page number is working. 1-based index
        //     default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        //     last: 'Last Page'
        // }
    }
};


var users = [
    {
        name: "Shyam",
        age: "26",
    },
    {
        name: "Navjot",
        age: "26",
    },
    {
        name: "Vitthal",
        age: "26",
    },
];

export default async (data) => {
    try {
        var document = {
            html: html,
            data: {
                products: data,
            },
            path: "./output.pdf",
            type: "",
        };
        const pdfCreated = await create(document, options)
        return pdfCreated
    } catch (error) {
        return { error }
    }
}

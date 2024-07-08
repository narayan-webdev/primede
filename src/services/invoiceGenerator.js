import { create } from "pdf-creator-node";
import { readFileSync } from "fs";
import { join } from "path";

var options = {
    // width: "600px",
    format: "A4",
    orientation: "portrait",
    border: "10mm",

};

const createInvoice = async (data, type) => {
    try {
        let html
        switch (type) {
            case "order":
                html = readFileSync(join(process.cwd(), "/views/order-invoice.html"), "utf8");
                // html = fs.readFileSync(path.join(process.cwd(), "/views/order-invoice.html"), "utf8");
                break;
            case "subscription":
                html = readFileSync(join(process.cwd(), "/views/subscription-invoice.html"), "utf8");
                break;
            case "user-subscription":
                html = readFileSync(join(process.cwd(), "/views/user-subscription-invoice.html"), "utf8");
                break;

            default:
                break;
        }
        var document = {
            html: html,
            data: data,
            path: "./output.pdf",
            type: "",
        };
        const generatedPDF = await create(document, options);

        const pdfData = readFileSync(generatedPDF.filename);

        const pdfBuffer = Buffer.from(pdfData);
        return pdfBuffer
    } catch (error) {
        console.log(error)
        return { error }
    }
}

export { createInvoice };
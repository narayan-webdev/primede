export default async (global, totalAmount) => {
    try {
        const type = global.cod_prepaid_type;
        let codAmount;
        if (global.cod_prepaid) {
            switch (type) {
                case 'PRICE':
                    codAmount = global.cod_prepaid
                    break;
                case 'PERCENTAGE':
                    codAmount = global.cod_prepaid / 100 * totalAmount
                    break;
                default:
                    break;
            }
            return { codAmount }
        }
    } catch (error) {
        return { error }
    }
}
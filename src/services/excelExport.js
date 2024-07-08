import { utils, write } from 'xlsx';

export default async (data) => {
    try {

        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Sheet1');
        const buffer = write(wb, { type: 'buffer', bookType: 'xlsx' });
        return buffer
    } catch (error) {
        console.log(error)
        return { error }
    }
}
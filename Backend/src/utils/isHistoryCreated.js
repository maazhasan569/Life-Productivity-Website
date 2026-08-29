import { History } from "../models/history.models.js";
const delAndPushToHistory = async (userId, delItmId, field) => {
    console.log("2")
    const isUserHistory = await History.findOne({ userId, })
    const history = isUserHistory
        ? isUserHistory[field] = [...isUserHistory[field] || [], delItmId]
        : await History.create({ [field]: [delItmId], userId });

    if (isUserHistory) await isUserHistory.save();
    return history;

}
export default delAndPushToHistory
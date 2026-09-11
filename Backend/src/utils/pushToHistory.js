import { History } from "../models/history.models.js";
const pushToHistory = async (userId, delItmId, field) => {
    const isUserHistory = await History.findOne({ userId, })
    const history = isUserHistory
        ? isUserHistory[field] = [...isUserHistory[field] || [], delItmId]
        : await History.create({ [field]: [delItmId], userId });

    if (isUserHistory) await isUserHistory.save();
    return history;

}
export default pushToHistory
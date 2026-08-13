export async function paginate(Model, page = 1, limit = 10, sortBy, sortType, userId) {

    const page = Math.max(1, parseInt(page, 10) || 1);
    const limit = Math.max(1, parseInt(limit, 10) || 10);
    let sortObj = {}
    if (sortBy) {
        const sortDirection = sortType === "desc" ? -1 : 1;
        sortObj[sortBy] = sortDirection
    } else {
        sortObj.createdAt = -1
    }
    const skip = (page - 1) * limit
    const totalDoc = await Model.countDocuments({})
    const totalPages = Math.ceil(totalDoc / limit)
    if (totalDoc === 0) return {
        totalDoc: 0,
        totalPages: 0,
        fetchedDoc: [],
        page,
        limit,
    }
    const fetchedDoc = await Model
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .exec()

    return { totalDoc, totalPages, fetchedDoc, page, limit }

}
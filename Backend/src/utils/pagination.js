async function paginate(page, limit, sortBy, sortType, userId) {

    let sortObj = {}
    if (sortBy) {
        const sortDirection = sortType === "desc" ? -1 : 1;
        sortObj[sortBy] = sortDirection
    } else {
        sortObj.createdAt = -1
    }
    const skip = (page - 1) * limit
    const totalDoc = await Video.countDocuments(filter)
    const totalPages = Math.ceil(totalDoc / limit)
    if (!totalDoc) return {}
    const fetchedVideos = await Video
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .exec()

    return { totalDoc, totalPages, fetchedVideos, page, limit }

}
import ApiError from "../utils/ApiError"

class FileService {
    constructor(userId, fileType, filePath) {
        this.fileType = fileType
        this.filePath = filePath
        this.userId = userId
    }


    async deleteFromCloudinary (publicId){
         if (!publicId) return;
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
                throw new ApiError(500 , err.message)
          }
    } 
    async uploadFile() {
        if (!this.fileType || !["document", "avatar"].includes(this.fileType)) {
            throw new ApiError(400, "No file type found (doc/avatar)")
        }
        try {
            const { fileUrl, publicId } = await fileUpload(this.filePath)

            return {fileUrl, publicId}
        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }


    async updateFile(id, Model) {
        if (!this.fileType || !["document", "avatar"].includes(this.fileType)) {
            throw new ApiError(400, "No file type found (doc/avatar)")
        }

        try {
            const modelRecord = await Model.findById(id)
            if (!modelRecord.document) {
                throw new ApiError(400, "file not found")
            }
            await this.deleteFromCloudinary(isExistingFile.publicId)
            const { fileUrl, publicId } = await fileUpload(this.filePath)
            const newFile = await Model.findByIdAndUpdate(
                id,
                {
                    document: fileUrl,
                    publicId,
                },
                { new: true }
            )
            return newFile
        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }

    async deleteFile(id , Model) {
        try {
            if (!this.fileType || !["document", "avatar"].includes(this.fileType)) {
                throw new ApiError(400, "No file type found (doc/avatar)")
            }

            const modelRecord = await Model.findById(id)
            if (!modelRecord.document) {
                throw new ApiError(400, "No file found")
            }
            await this.deleteFromCloudinary(modelRecord.publicId)

           
            const response = await Model.findByIdAndUpdate(
                id,
                {
                    document : null,
                    publicId : null
                }
            )
               
            return response
        }catch(err){
            throw new ApiError(500 , err.message)
    }
    }
}


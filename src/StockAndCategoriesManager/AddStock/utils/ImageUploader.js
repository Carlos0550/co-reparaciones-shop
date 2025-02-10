import { v4 } from "uuid"
import { compressImage } from "./CompressImages"

async function handleUpload(e) {
    const files = e.target.files
    const filesArray = Array.from(files)
    const newFiles = []
    for (const file of filesArray) {
        const newOptimicedFiles = await compressImage(file)
        const newOptimicedFile = new File([newOptimicedFiles], `${v4().slice(0, 10)}.${newOptimicedFiles.type.split("/").pop()}`, {
            type: newOptimicedFiles.type

        })

        newFiles.push({
            uid: v4(),
            editing: false,
            originalFile: newOptimicedFile,
            name: `${v4().slice(0, 10)}.${newOptimicedFiles.type.split("/").pop()}`,
            status: 'done',
            type: newOptimicedFiles.type,
            thumbUrl: URL.createObjectURL(newOptimicedFiles)
        })
    }
    return newFiles
}

export default handleUpload
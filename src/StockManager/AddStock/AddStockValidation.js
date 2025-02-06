import { message, notification } from "antd"
import { useRef, useState } from "react"
import { v4 } from "uuid"
import { compressImage } from "./CompressImages"
import { useAppContext } from "../../Context/AppContext"

function AddStockValidation(editorRef) {

    const [fileList, setFileList] = useState([])
    const [savingProduct, setSavingProduct] = useState(false)
    const { 
        saveProducts, getInitialProducts
     } = useAppContext()

    const uploadImages = async (e) => {
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
                originalFile: newOptimicedFile,
                name: `${v4().slice(0, 10)}.${newOptimicedFiles.type.split("/").pop()}`,
                status: 'done',
                type: newOptimicedFiles.type,
                thumbUrl: URL.createObjectURL(newOptimicedFiles)
            })
        }

        setFileList((prev) => [...prev, ...newFiles].slice(0, 4))

    }


    const deleteImage = (uid) => {
        setFileList((prev) => prev.filter((file) => file.uid !== uid))
    }

    const formFieldsRef = useRef(null)

    const handleVerifyValues = () => {
        const formFields = Array.from(formFieldsRef.current.querySelectorAll('input'))

        const productPriceInput = formFields.find(element => element.name === "product_price")
        const productStockInput = formFields.find(element => element.name === "product_stock")

        if (!productPriceInput || !productStockInput) {
            notification.error({
                message: "No se encontraron los campos de precio y stock",
                showProgress: true,
                pauseOnHover: false,
                duration: 3
            })
            return false
        }

        const productPrice = parseFloat(productPriceInput.value)
        const productStock = parseInt(productStockInput.value)

        if (isNaN(productPrice) || productPrice <= 0) {
            notification.error({
                message: "El precio debe ser un número mayor a 0",
                showProgress: true,
                pauseOnHover: false,
                duration: 3
            })
            return false
        }

        if (isNaN(productStock) || productStock <= 0) {
            notification.error({
                message: "El stock debe ser un número mayor a 0",
                showProgress: true,
                pauseOnHover: false,
                duration: 3
            })
            return false
        }

        return true
    }

    const handleVerifyFields = async(e) => {
        e.preventDefault()
        const editorInstance = editorRef.current.getInstance();
        const content = editorInstance.getHTML().replace(/<.*?>/g, "").trim();

        const formFields = formFieldsRef.current.querySelectorAll('input')
        let hasError = false;

        if (!content || content.length === 0) {
            notification.error({
                message: "La descripción no puede estar vacia",
                showProgress: true,
                pauseOnHover: false,
                duration: 3
            })
            hasError = true;
            return;
        }

        formFields.forEach((field) => {
            const referenceNameToValues = {
                product_name: {
                    name: "nombre del producto",
                    message: "El nombre del producto no puede estar vacio"

                },
                product_price: {
                    name: "precio del producto",
                    message: "El precio del producto no puede estar vacio"
                },
                product_stock: {
                    name: "stock del producto",
                    message: "El stock del producto no puede estar vacio"
                },
                product_images: {
                    name: "imagenes del producto",
                    message: "Introduce al menos una imagen."
                },
            }

            if (field.value.length === 0 && field.name !== "product_images_span") {
                if (!hasError) {
                    notification.error({
                        message: "Error al guardar el producto",
                        description: referenceNameToValues[field.name].message,
                        showProgress: true,
                        pauseOnHover: false,
                        duration: 3
                    })
                    hasError = true;
                    return;
                }
            }
        })

        const typeVerificationResult = !hasError && handleVerifyValues()

        const formData = new FormData()
        for (const element of formFields) {

            if(element.name === "product_images_span") continue
            formData.append(element.name, element.value)
        }
        fileList.forEach((file) => {
            formData.append("product_images", file.originalFile)
        })
        
        formData.append("product_description", editorInstance.getHTML())
        setSavingProduct(true)
        const result = typeVerificationResult && await saveProducts(formData)
        setSavingProduct(false)

        if(result) {
            getInitialProducts()
            editorInstance.setHTML('')
            setFileList([])
            formFields.forEach((field) => {
                field.value = ""
            })
        }
    }
    return {
        fileList,
        uploadImages,
        deleteImage,
        formFieldsRef,
        handleVerifyFields,
        savingProduct
    }
}

export default AddStockValidation
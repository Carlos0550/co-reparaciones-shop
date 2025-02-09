import { message, notification } from "antd"
import { useEffect, useRef, useState } from "react"
import { v4 } from "uuid"
import { compressImage } from "./CompressImages"
import { useAppContext } from "../../Context/AppContext"
import { apis, urls } from "../../../apis"

function AddStockValidation(editorRef, productToEdit) {

    const [fileList, setFileList] = useState([])
    const [savingProduct, setSavingProduct] = useState(false)
    const [hasOptionsShop, setHasOptionsShop] = useState(false)
    const [optionsShop, setOptionsShop] = useState([])
    const {
        saveProducts, getInitialProducts,
        setEditStockArguments
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
                editing: false,
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

    const handleVerifyFields = async (e) => {
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

            if (["product_images_span", "title_option_shop", "product_options_shop"].includes(field.name)) return
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

            if (field.value.length === 0) {
                if (!hasError) {
                    notification.error({
                        message: "Error al guardar el producto",
                        description: referenceNameToValues[field?.name]?.message || "El campo " + referenceNameToValues[field.name].name + " no puede estar vacio",
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

            if (["product_images_span", "title_option_shop"].includes(element.name)) continue
            formData.append(element.name, element.value)
        }

        const imagesToMaintain = []; 

        fileList.forEach((file) => {
            if (file.editing) {
                const urlSinBase = file.thumbUrl.replace(urls.development.baseUrl, "");
                imagesToMaintain.push(urlSinBase);
                formData.append("images_to_maintain", urlSinBase);
            } else {
                formData.append("product_images", file.originalFile || "");
            }
        });
        let imagesToDelete = [];
        if(productToEdit){
            imagesToDelete = productToEdit.images.filter(
                (img) => !imagesToMaintain.includes(img)
            );
    
            formData.append("images_to_delete", JSON.stringify(imagesToDelete));
        }

        formData.append("product_description", editorInstance.getHTML())
        if (hasOptionsShop) {
            const allOptionsShop = []
            Object.entries(optionsShop).map(([title, option]) => {
                allOptionsShop.push({ title, option });
            })
            formData.append("options_shop", JSON.stringify(allOptionsShop));
        }
        if(productToEdit) {
            formData.append("product_id", productToEdit.product_id)
            formData.append("is_editing", true)
        }else{
            formData.append("is_editing", false)
        }
        
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
            setHasOptionsShop(false)
            setEditStockArguments({editing: false, productID: null})
        }
    }


    const titleOptionShopRef = useRef(null)
    const optionsShopRef = useRef(null)
    const handleSetOptionsShop = () => {
        const title = titleOptionShopRef.current.value.trim()
        const options = optionsShopRef.current.value

        if (title.trim() === "") return message.error("El titulo no puede estar vacio")
        if (options.trim() === "") return message.error("Las opciones no pueden estar vacias")

        const capitalizeWords = (str) => {
            return str
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        const parsedOptions = options.split(/\r?\n|,/g).map(option => capitalizeWords(option.trim()))

        const formattedTitle = capitalizeWords(title);
        if (optionsShop[formattedTitle]) {
            return message.error("Ya existe una opción con ese título");
        }

        setOptionsShop((prevOptions) => ({
            ...prevOptions,
            [formattedTitle]: parsedOptions,
        }));

        optionsShopRef.current.value = ""
        titleOptionShopRef.current.value = ""
        message.success("Opciones agregadas correctamente")
    }

    const deleteOptionShop = (title) => {
        setOptionsShop((prevOptions) => {
            const updatedOptions = { ...prevOptions };
            delete updatedOptions[title];
            return updatedOptions;
        });
    };

    useEffect(() => {
        if (productToEdit && Object.keys(productToEdit).length > 0) {
            const formFields = Array.from(formFieldsRef.current.querySelectorAll('input'))
            const { images, product_description, product_options } = productToEdit
            editorRef.current.getInstance().setHTML(product_description)

            formFields.forEach((field) => {
                if (
                    [
                        "product_images",
                        "product_images_span",
                        "title_option_shop",
                        "product_options_shop",
                        "title_option_shop"
                    ]
                        .includes(field.name)) return;
                field.value = productToEdit[field.name];
            });

            setFileList(images.map(image => ({
                uid: v4(),
                name: `editing-image-${image}`,
                editing: true,
                status: 'done',
                type: `image/${image.split(".").pop()}`,
                thumbUrl: `${apis.products}/${image}`.replace("/products/", "")
            })));

            let parsedOptionsShop = []
            try {
                if (product_options !== "[]") {
                    parsedOptionsShop = JSON.parse(product_options);
                    if (parsedOptionsShop.length > 0) {
                        setHasOptionsShop(true);

                        const formattedOptions = parsedOptionsShop.reduce((acc, option) => {
                            acc[option.title] = option.option;
                            return acc;
                        }, {});

                        setOptionsShop((prevOptions) => ({
                            ...prevOptions,
                            ...formattedOptions,
                        }));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [productToEdit, editorRef, formFieldsRef])

    return {
        fileList,
        uploadImages,
        deleteImage,
        formFieldsRef,
        handleVerifyFields,
        savingProduct,
        hasOptionsShop,
        setHasOptionsShop,
        optionsShop,
        handleSetOptionsShop,
        titleOptionShopRef,
        optionsShopRef,
        deleteOptionShop
    }
}

export default AddStockValidation
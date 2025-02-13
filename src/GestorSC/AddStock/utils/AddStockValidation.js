import { message } from "antd"
import { useEffect, useRef, useState } from "react"
import { v4 } from "uuid"

import { useAppContext } from "../../../Context/AppContext"
import { apis, urls } from "../../../../apis"
import handleUpload from "./ImageUploader"
import { handleVerifyFields, handleVerifyValues } from "./VerifyStockFields"

function AddStockValidation(editorRef, productToEdit) {

    const [fileList, setFileList] = useState([])
    const [savingProduct, setSavingProduct] = useState(false)
    const [hasOptionsShop, setHasOptionsShop] = useState(false)
    const [optionsShop, setOptionsShop] = useState([])
    const {
        saveProducts, getInitialProducts,
        setEditStockArguments, categories
    } = useAppContext()
    

    const uploadImages = async (e) => {
        const newFiles = await handleUpload(e)
        setFileList((prev) => [...prev, ...newFiles].slice(0, 4))
    }

    const deleteImage = (uid) => {
        setFileList((prev) => prev.filter((file) => file.uid !== uid))
    }

    const formFieldsRef = useRef(null)

    const onFinishStock = async (e) => {
        e.preventDefault()
        const editorInstance = editorRef.current.getInstance();
        const content = editorInstance.getHTML().replace(/<.*?>/g, "").trim();

        const formFields = formFieldsRef.current.querySelectorAll('input, select')
        
        const hasError = handleVerifyFields(content, formFields)
        const typeVerificationResult = !hasError && handleVerifyValues(formFieldsRef)

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
            const formFields = Array.from(formFieldsRef.current.querySelectorAll('input, select'))
            const { images, product_description, product_options, product_category } = productToEdit
            editorRef.current.getInstance().setHTML(product_description)
            console.log(product_category)
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

                if (field.name === "product_category") {
                    const selectedCategory = categories.find(cat => cat.category_id === product_category);
                    if (selectedCategory) {
                        field.value = selectedCategory.category_id; 
                    }
                }
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
    }, [productToEdit, editorRef, formFieldsRef, categories])

    

    return {
        fileList,
        uploadImages,
        deleteImage,
        formFieldsRef,
        onFinishStock,
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
import { notification } from "antd"

function handleVerifyValues(formFieldsRef) {
    const formFields = Array.from(formFieldsRef.current.querySelectorAll('input, select'))

    const productPriceInput = formFields.find(element => element.name === "product_price")
    const productStockInput = formFields.find(element => element.name === "product_stock")
    const categoriesSelector = formFields.find(element => element.name === "product_category")

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

    if (!categoriesSelector) {
        notification.error({
            message: "No hay ninguna categoría seleccionada",
            showProgress: true,
            pauseOnHover: false,
            duration: 3
        })
        return false
    }

    return true
}

function handleVerifyFields(content, formFields) {
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
            product_category: {
                name: "categoria del producto",
                message: "La categoria del producto no puede estar vacia"
            }
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

    return hasError
}

export { handleVerifyValues, handleVerifyFields }
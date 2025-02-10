import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { apis } from '../../apis'
import { message, notification } from 'antd'

function useProducts(isOnline) {
    
    interface Product {
        product_id: string,
        product_name: string,
        product_price: number,
        product_stock: number,
        product_description: string,
        product_options: string,
        product_category: string,
        images: string[]
    }

    interface ApiResponse {
        products: Product[]
    }
    const [products, setProducts] = useState<Product[]>([])
    
    const getInitialProducts = useCallback(async () => {
        if (!isOnline) return notification.error({
            message: "No tienes conexión a internet.",
            description: "Verifica tu red e intenta nuevamente más tarde.",
            duration: 4,
            showProgress: true,
            pauseOnHover: false
        })

        const hiddenMessage = message.loading("Un momento...", 0)

        const url = apis.products
        const newUrl = new URL(`${url}/get-products`)
        try {
            const response = await fetch(newUrl)

            if (!response.ok) {
                const errorMessage = await response.json()
                throw new Error(errorMessage.message)
            }
            const responseData: ApiResponse = await response.json()
            setProducts(responseData.products)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: error.message,
                showProgress: true,
                pauseOnHover: false,
                duration: 3
            })
            return false
        } finally {
            hiddenMessage()
        }

    }, [isOnline])

    const saveProducts = useCallback(async (productsValues) => {
        if (!isOnline) return notification.error({
            message: "No tienes conexión a internet.",
            description: "Verifica tu red e intenta nuevamente más tarde.",
            duration: 4,
            showProgress: true,
            pauseOnHover: false
        })

        const url = apis.products
        const newUrl = new URL(`${url}/save-product`)
        try {
            const response = await fetch(newUrl, {
                method: "POST",
                body: productsValues
            })

            if (!response.ok) {
                const errorMessage = await response.json()
                throw new Error(errorMessage.message)
            }
            await getInitialProducts()
            message.success("Producto guardado con exito")
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: error.message,
                showProgress: true,
                pauseOnHover: false,
                duration: 3
            })
            return false
        }

    }, [getInitialProducts, isOnline])

    const deleteProduct = useCallback(async (productId) => {
        if (!isOnline) return notification.error({
            message: "No tienes conexión a internet.",
            description: "Verifica tu red e intenta nuevamente más tarde.",
            duration: 4,
            showProgress: true,
            pauseOnHover: false
        })

        const url = apis.products
        const newUrl = new URL(`${url}/delete-product/${productId}`)
        try {
            const response = await fetch(newUrl, {
                method: "DELETE"
            })

            if (response.status === 404) {
                throw new Error("Producto no encontrado o ya fué eliminado")
            }
            if (!response.ok) {
                const errorMessage = await response.json()
                throw new Error(errorMessage.message)
            }
            await getInitialProducts()
            const sameProduct = products.find(p => p.product_id === productId)
            if (sameProduct) setProducts((prevProducts) =>
                prevProducts.filter(p => p.product_id !== productId)
            )
            message.success("Producto eliminado con exito")
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: error.message,
                showProgress: true,
                pauseOnHover: false,
                duration: 3
            })
            return false
        }

    }, [getInitialProducts, isOnline, products])

    const alreadyFetched = useRef(false)
    useEffect(()=>{
        if(alreadyFetched.current) return
        alreadyFetched.current = true
        getInitialProducts()
    },[])

    return useMemo(() => ({
        saveProducts,
        getInitialProducts,
        products,
        setProducts, deleteProduct
    }), [
        saveProducts,
        getInitialProducts,
        products,
        setProducts, deleteProduct
    ])
}

export default useProducts
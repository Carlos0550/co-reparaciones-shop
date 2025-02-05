import { useCallback, useMemo, useState } from 'react'
import { apis } from '../../apis'
import { message, notification } from 'antd'

function useProducts() {
    const [products, setProducts] = useState([])
    const getAllProducts = useCallback(async() => {

        const url = apis.products
        const newUrl = new URL(`${url}/get-products`)
        try {
            const response = await fetch(newUrl)

            if(!response.ok){
                const errorMessage = await response.json()
                throw new Error(errorMessage.message)
            }
            const responseData = await response.json()
            console.log(responseData)
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
        }
    },[])

    const saveProducts = useCallback(async (productsValues) => {
        const url = apis.products
        const newUrl = new URL(`${url}/save-product`)
        try {
            const response = await fetch(newUrl,{
                method: "POST",
                body: productsValues
            })

            if(!response.ok){
                const errorMessage = await response.json()
                throw new Error(errorMessage.message)
            }
            await getAllProducts()
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
    
    },[getAllProducts])

    
  return useMemo(() => ({
    saveProducts,
    getAllProducts,
    products
  }),[
    saveProducts,
    getAllProducts,
    products
  ])
}

export default useProducts
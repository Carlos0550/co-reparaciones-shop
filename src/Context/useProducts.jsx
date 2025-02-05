import { useCallback, useMemo } from 'react'
import { apis } from '../../apis'
import { message, notification } from 'antd'

function useProducts() {
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
    
    },[])

  return useMemo(() => ({
    saveProducts
  }),[
    saveProducts
  ])
}

export default useProducts
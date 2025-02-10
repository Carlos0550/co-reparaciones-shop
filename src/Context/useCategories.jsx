import { message, notification } from "antd"
import { apis } from "../../apis"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

function useCategories() {
    const [categories, setCategories] = useState([])

    const getCategories = useCallback(async () => {
        try {
            const url = new URL(`${apis.categories}/get-categories`)
            const response = await fetch(url)
            const responseData = await response.json()
            if(response.status === 404) return message.error(responseData.msg)
            if (!response.ok) throw new Error(responseData.msg)
            setCategories(responseData.categories)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: error.msg,
                showProgress: true,
                pauseOnHover: false,
                duration: 3
            })
            return false
        }
    },[])

    const saveCategory = useCallback(async (category_name) => {
        try {
            const url = new URL(`${apis.categories}/insert-category?category_name=${category_name}`)
            const response = await fetch(url, { method: "POST" })
            const responseData = await response.json()
            if (!response.ok) throw new Error(responseData.message)
            message.success("Categoría guardada con éxito.")
            getCategories()
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
    }, [getCategories])

    const deleteCategory = useCallback(async (category_id) => {
        try {
            const url = new URL(`${apis.categories}/delete-category?category_id=${category_id}`)
            const response = await fetch(url, { method: "DELETE" })
            const responseData = await response.json()
            if (!response.ok) throw new Error(responseData.message)
            getCategories()
            message.success("Categoría eliminada con éxito.")
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
    },[getCategories])

    const alreadyFetched = useRef(false)
        useEffect(()=>{
            if(alreadyFetched.current) return;
            alreadyFetched.current = true
            getCategories()
        },[getCategories])

        
    return useMemo(() => ({
        saveCategory,
        getCategories,
        categories,
        deleteCategory
    }),[
        saveCategory,
        getCategories,
        categories,
        deleteCategory
    ])
}

export default useCategories
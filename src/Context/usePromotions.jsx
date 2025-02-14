import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { apis } from "../../apis"
import { message, notification } from "antd"

function usePromotions() {

  const [promotions, setPromotions] = useState([])
  const getAllPromotions = useCallback(async () => {
    const baseUrl = new URL(apis.promotions + "/get-all-promotions")
    try {
      const response = await fetch(baseUrl)
      const responseData = await response.json()

      if(response.status === 404) return;
      if (!response.ok) throw new Error(responseData.msg || "Error desconocido");
      setPromotions(responseData.promotions)
      return true
    } catch (error) {
      console.log(error)
      notification.error({
        message: "No se pudieron obtener las promociones",
        description: error.message,
        duration: 3,
        showProgress: true
      })
    }

    return false
  }, [])

  const createPromotion = useCallback(async (promotionValues) => {
    const baseUrl = new URL(apis.promotions + "/create-promotion")
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        body: promotionValues
      })

      const responseData = await response.json()
      if (!response.ok) throw new Error(responseData.msg || "Error desconocido.")
      message.success("Promoción creada con éxito")
      await getAllPromotions()
      return true
    } catch (error) {
      console.log(error)
      notification.error({
        message: "No fué posible crear la promoción.",
        description: error.message,
        duration: 4,
        showProgress: true
      })

      return false
    }
  }, [getAllPromotions])

  const updatePromotion = useCallback(async (promotionValues) => {
    const baseUrl = new URL(apis.promotions + "/update-promotion")
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        body: promotionValues
      })

      const responseData = await response.json()
      if (!response.ok) throw new Error(responseData.msg || "Error desconocido.")
      message.success("Promoción actualizada con éxito")
      await getAllPromotions()
      return true
    } catch (error) {
      console.log(error)
      notification.error({
        message: "No fué posible actualizar la promoción.",
        description: error.message,
        duration: 4,
        showProgress: true
      })

      return false
    }
  }, [getAllPromotions])


  const alreadyFetched = useRef(false)
  useEffect(()=>{
    if(alreadyFetched.current) return
    alreadyFetched.current = true
    getAllPromotions()
  },[getAllPromotions])


  return useMemo(() => ({
    createPromotion,
    promotions, getAllPromotions,
    updatePromotion
  }), [
    createPromotion,
    promotions, getAllPromotions,
    updatePromotion
  ])
}

export default usePromotions
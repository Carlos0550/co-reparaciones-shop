import { createContext,useContext, useEffect, useMemo, useState } from "react";
import useProducts from "./useProducts.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import useCategories from "./useCategories.jsx";
import usePromotions from "./usePromotions.jsx";

const AppContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within a AppContextProvider");
    }
    return context;
}

// eslint-disable-next-line react/prop-types
export const AppContextProvider = ({ children }) => {
    const [width, setWidth] = useState(window.innerWidth)
    const navigate = useNavigate()
    const location = useLocation().pathname

    useEffect(() => {

        if (location === "/") {
            navigate("/dashboard")
        }
    }, [location, navigate])
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const [isOnline, setIsOnline] = useState(navigator.onLine)

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const [editStockArguments, setEditStockArguments] = useState({
        editing: false,
        productID: null
    })

    const [editPromotionArguments, setEditPromotionArguments] = useState<{
        editing: boolean,
        promotionID: string
    }>({
        editing: false,
        promotionID: ""
    })

    const productsHook = useProducts(isOnline)
    const categoriesHook = useCategories()
    const promotionsHook = usePromotions()
    const contextValues = useMemo(() => ({
        width,
        ...productsHook,
        isOnline,
        editStockArguments, setEditStockArguments,
        ...categoriesHook,
        ...promotionsHook,
        editPromotionArguments, setEditPromotionArguments
    }), [
        width,
        productsHook,
        isOnline,
        editStockArguments, setEditStockArguments,
        categoriesHook,
        promotionsHook,
        editPromotionArguments, setEditPromotionArguments
    ])

    return (
        <AppContext.Provider value={contextValues}>
            {children}
        </AppContext.Provider>
    )
}
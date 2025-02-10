import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useProducts from "./useProducts.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import useCategories from "./useCategories";

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within a AppContextProvider");
    }
    return context;
}

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

    const productsHook = useProducts(isOnline)
    const categoriesHook = useCategories()
    const contextValues = useMemo(() => ({
        width,
        ...productsHook,
        isOnline,
        editStockArguments, setEditStockArguments,
        ...categoriesHook
    }), [
        width,
        productsHook,
        isOnline,
        editStockArguments, setEditStockArguments,
        categoriesHook
    ])

    return (
        <AppContext.Provider value={contextValues}>
            {children}
        </AppContext.Provider>
    )
}
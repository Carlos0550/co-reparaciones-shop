import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useProducts from "./useProducts";

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within a AppContextProvider");
    }
    return context;
}

export const AppContextProvider = ({children}) => {
    const [width, setWidth] = useState(window.innerWidth)
    useEffect(()=>{
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    },[])

    const productsHook = useProducts()
    const contextValues = useMemo(() => ({
        width,
        ...productsHook
    }),[
        width,
        productsHook
    ])

    return (
        <AppContext.Provider value={contextValues}>
            {children}
        </AppContext.Provider>
    )
}
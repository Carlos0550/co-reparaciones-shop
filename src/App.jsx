import React, { useEffect } from 'react'
import "./App.css"
import { Routes, Route } from "react-router-dom"
import AdminLayout from './Layout/AdminLayout/AdminLayout'
import StockAndCategoriesManager from './StockAndCategoriesManager/StockAndCategoriesManager'
import PromotionsManager from './PromotionsManager/PromotionsManager'
function App() {
  return (
    <Routes>
      <Route path='/dashboard' element={<AdminLayout renderContent={<PromotionsManager/>}/>}/>
      <Route path='/products-management' element={<AdminLayout renderContent={<StockAndCategoriesManager/>}/>}/>
    </Routes>
  )
}

export default App
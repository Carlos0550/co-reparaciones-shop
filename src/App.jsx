import React, { useEffect } from 'react'
import "./App.css"
import { Routes, Route } from "react-router-dom"
import AdminLayout from './Layout/AdminLayout/AdminLayout'
import PromotionsManager from './PromotionsManager/PromotionsManager'
import GestorSC from './GestorSC/GestorSC'
function App() {
  return (
    <Routes>
      <Route path='/dashboard' element={<AdminLayout renderContent={<PromotionsManager/>}/>}/>
      <Route path='/products-management' element={<AdminLayout renderContent={<GestorSC/>}/>}/>
    </Routes>
  )
}

export default App
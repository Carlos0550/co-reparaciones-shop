import React from 'react'
import "./App.css"
import { Routes, Route } from "react-router-dom"
import AdminLayout from './Layout/AdminLayout/AdminLayout'
import StockManager from './StockManager/StockManager'
function App() {
  return (
    <Routes>
      <Route path='/' element={<AdminLayout renderContent={<StockManager/>}/>}/>
    </Routes>
  )
}

export default App
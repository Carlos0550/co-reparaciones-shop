import { Table } from 'antd'
import React from 'react'
import "./stockList.css"
import { useAppContext } from '../../Context/AppContext'
function StockList() {
    const { 
        getAllProducts
     } = useAppContext()
  return (
    <React.Fragment>
        <button 
            onClick={() => getAllProducts()}
            className='update-stock-btn'
        >
            Actualizar stock
        </button>
        <Table/>
    </React.Fragment>
  )
}

export default StockList
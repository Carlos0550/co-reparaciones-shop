import React from 'react'
import "./StockManager.css"
import { Collapse } from "antd"
import AddStock from './AddStock/AddStock'
import StockList from './StockList/StockList'
function StockManager() {
  return (
    <React.Fragment>
        <div className='stock-manager-container'>
            <p className='stock-manager-title'>Gestión de stock</p>
            <div className="stock-manager-options">
                <Collapse
                    accordion
                    items={[
                        {
                            key: "1",
                            label: "Inventario",
                            children: <StockList/>,
                        },
                        {
                            key: "2",
                            label: "Añadir un producto",
                            children: <AddStock/>
                        },
                    ]}
                />
            </div>
        </div>
    </React.Fragment>
  )
}

export default StockManager
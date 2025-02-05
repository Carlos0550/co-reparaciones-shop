import React from 'react'
import "./StockManager.css"
import { Collapse } from "antd"
import AddStock from './AddStock/AddStock'
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
                            children: "Inventario",
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
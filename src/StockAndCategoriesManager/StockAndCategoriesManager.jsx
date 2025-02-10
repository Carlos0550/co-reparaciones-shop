import React, { useState } from 'react'
import "./StockManager.css"
import { Collapse } from "antd"
import AddStock from './AddStock/AddStock'
import StockList from './StockList/StockList'
import AddCategoryForm from './AddCategories/AddCategoryForm'
import ListCategories from './ListCategories/ListCategories'
function StockAndCategoriesManager() {
    const [activeKeys, setActiveKeys] = useState([]);
  return (
    <React.Fragment>
        <div className='stock-manager-container'>
            <h1>Gestión de stock</h1>
            <div className="stock-manager-options">
                <Collapse
                    accordion
                    destroyInactivePanel
                    activeKey={activeKeys}
                    onChange={(keys) => setActiveKeys(keys)}
                    items={[
                        {
                            key: "1",
                            label: "Inventario",
                            children: <StockList/>,
                        },
                        {
                            key: "2",
                            label: "Añadir un producto",
                            children: activeKeys.includes("2") && <AddStock/>,
                        },
                        {
                            key: "3",
                            label: "Categorías",
                            children: <ListCategories/>
                        },{
                            key: "4",
                            label: "Añadir categoría",
                            children: activeKeys.includes("4") && <AddCategoryForm/>,
                        }
                    ]}
                />
            </div>
        </div>
    </React.Fragment>
  )
}

export default StockAndCategoriesManager
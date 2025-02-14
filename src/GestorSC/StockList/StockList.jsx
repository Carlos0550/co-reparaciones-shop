import { Table } from 'antd'
import React, { useEffect, useRef } from 'react'
import "./stockList.css"
import { useAppContext } from '../../Context/AppContext.tsx'
import useStockList from './utils/useStockList.jsx'
import { SearchOutlined } from '@ant-design/icons'

import EditStockModal from "./utils/EditStockModal.jsx"
function StockList() {
    const { 
        getInitialProducts, products, isOnline,
        editStockArguments
     } = useAppContext()

    const { 
        stockListColumns,
        handleSearch, setSearchText,
        searchText
     } = useStockList()


    useEffect(()=>{
        const handleKeyDown = (e) => {
            if(e.key === "Enter"){
                handleSearch()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    },[handleSearch])

  return (
    <React.Fragment>
        <button 
            onClick={() => getInitialProducts()}
            className='update-stock-btn'
        >
            Actualizar stock
        </button>
        <label htmlFor="input_search" className='stock-list-search-label'>
            <input
                className='stock-list-search-input'
                onChange={(e) => setSearchText(e.target.value)}
            />
            <SearchOutlined 
                onClick={() => {
                    searchText.trim() !== "" && handleSearch()
                }}
                className='cross-icon-stock-list'
            />
        </label>
        <Table
            columns={stockListColumns}
            dataSource={products}
            rowKey={(k) => k.product_id}
            rowHoverable
            scroll={{x: 500}}
        />
        {editStockArguments.editing && (
            <EditStockModal/>
        )}

    
    </React.Fragment>
  )
}

export default StockList
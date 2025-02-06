import { Table } from 'antd'
import React, { useEffect, useRef } from 'react'
import "./stockList.css"
import { useAppContext } from '../../Context/AppContext'
import useStockList from './useStockList.jsx'
import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
function StockList() {
    const { 
        getInitialProducts, products
     } = useAppContext()

    const { 
        stockListColumns,
        handleSearch, setSearchText
     } = useStockList()

    const initialCall = useRef(false)

    useEffect(() => {
        if (!initialCall.current) {
            getInitialProducts()
            initialCall.current = true;
        }
    }, [getInitialProducts]);

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
                onClick={() => handleSearch()}
                className='cross-icon-stock-list'/>
        </label>
        <Table
            columns={stockListColumns}
            dataSource={products}
            rowKey={(k) => k.product_id}
            rowHoverable
            scroll={{x: 500}}
        />
    </React.Fragment>
  )
}

export default StockList
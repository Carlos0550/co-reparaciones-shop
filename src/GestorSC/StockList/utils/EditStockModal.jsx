import { CloseOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../Context/AppContext.tsx'
import EditStock from "../../AddStock/AddStock"

function StockListModal() {
  const { products, 
    editStockArguments, 
    setEditStockArguments } = useAppContext()
  
  const [productToEdit, setProductToEdit] = useState(null)

  useEffect(()=>{
    if(editStockArguments.productID && products?.length > 0){
      const productFound = products.find(pr => pr.product_id === editStockArguments.productID)
      setProductToEdit(productFound)

    }
  },[editStockArguments, products])
  return (
    <Modal
        open={true} 
        onCancel={() => setEditStockArguments({editing: false, productID: null})}
        footer={[
            <Button key="cerrar" onClick={() => setEditStockArguments({editing: false, productID: null})} danger icon={<CloseOutlined/>}>Cerrar</Button>
        ]}
        width={1000}
    >
        <EditStock productToEdit={productToEdit}/>
    </Modal>
  )
}

export default StockListModal
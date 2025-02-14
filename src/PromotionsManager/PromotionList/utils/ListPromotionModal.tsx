import { CloseCircleOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { ListPromotionModalProps } from '../../../Context/Typescript/PromotionTypes'
import { useAppContext } from '../../../Context/AppContext.tsx'

function ListPromotionModal({ renderType, closeModal, renderData }: ListPromotionModalProps) {

  const renderComponent = {
    "specific_products": {
      name: "Productos seleccionados",
      children: <div className='render-data-promotion-modal-container'>
        <ul className='render-data-promotion-list'>
          {renderData.map((pr: any) => (
            <li key={pr.product_id}>
              {pr.product_name} - {parseFloat(pr.product_price)
                .toLocaleString("es-AR", { style: "currency", "currency": "ARS" })
              }
            </li>
          ))}
        </ul>
      </div>
    },
    "specific_categories": {
      name: "Categorías afectadas",
      children: <div className='render-data-promotion-modal-container'>
        <ul className='render-data-promotion-list'>
          {renderData.map((pr: any) => (
            <li key={pr.category_id}>
              {pr.category_name}
            </li>
          ))}
        </ul>
      </div>
    }
  }
  return (
    <Modal
      open={true}
      footer={[
        <Button danger icon={<CloseCircleOutlined />} onClick={closeModal}>Cerrar</Button>
      ]}
      title={renderComponent[renderType].name}
      onCancel={() => closeModal()}
    >
      {renderComponent[renderType].children}
    </Modal>
  )
}

export default ListPromotionModal
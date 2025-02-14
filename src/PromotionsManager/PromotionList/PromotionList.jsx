import { Table } from 'antd'
import React from 'react'
import { useAppContext } from '../../Context/AppContext.tsx'
import usePromotionList from './utils/usePromotionList'

function PromotionList() {
    const { 
        promotions
     } = useAppContext()
    const { 
        promotionColumns
     } = usePromotionList()
     
  return (
    <React.Fragment>
        <Table
            columns={promotionColumns}
            dataSource={promotions}
        />
    </React.Fragment>
  )
}

export default PromotionList
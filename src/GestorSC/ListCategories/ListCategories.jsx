import { Table } from 'antd'
import React from 'react'
import useListCategories from './utils/useListCategories'

import { useAppContext } from '../../Context/AppContext.tsx'
function ListCategories() {
    const { 
        categoryColumns
    } = useListCategories()
    const {
        categories
    } = useAppContext()
  return (
    <React.Fragment>
        <Table
            columns={categoryColumns}
            dataSource={categories}
            rowKey={record => record.category_id}
            scroll={{x: 500}}
            pagination={{pageSize: 10}}
        />
    </React.Fragment>
  )
}

export default ListCategories
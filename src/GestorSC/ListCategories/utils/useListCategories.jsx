import { DeleteOutlined, EditOutlined, SettingOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Popover, Space } from "antd"
import { useAppContext } from "../../../Context/AppContext"

function useListCategories() {
    const { 
        deleteCategory
    } = useAppContext()
    const categoryColumns = [
        {
          title: 'Categoría',
          dataIndex: 'category_name',
          key: 'category_name',
          render: (_, record) => (
            <strong>{record.category_name}</strong>
          )
        },{
            render:(_,record) => (
                    <Popover
                        content={
                            <Space
                                direction="vertical"
                            >
                                <Button icon={<EditOutlined/>}/>

                                <Popconfirm
                                    title="¿Eliminar categoría?"
                                    description="¿Seguro que desea eliminar esta categoría?"
                                    okText="Si"
                                    okButtonProps={{danger: true}}
                                    cancelText="No"
                                    overlayStyle={{maxWidth: 300}}
                                    onConfirm={() => deleteCategory(record.category_id)}
                                >
                                    <Button icon={<DeleteOutlined/>} danger/>
                                </Popconfirm>
                            </Space>
                        }
                    >
                        <Button><SettingOutlined/></Button>
                    </Popover>
            )
        }
    ]
  return {
    categoryColumns
  }
}

export default useListCategories
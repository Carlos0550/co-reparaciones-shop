
import { Button, Space } from "antd"
import { useAppContext } from "../../../Context/AppContext.tsx"
import { Column } from "../../../Context/Typescript/PromotionTypes"
import dayjs from "dayjs"
import React, { useState } from "react"
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons"
import ListPromotionModal from "./ListPromotionModal"
function usePromotionList() {
    const [openModalId, setOpenModalId] = useState("")
    const {
        editPromotionArguments, setEditPromotionArguments
    } = useAppContext()

    const promotionColumns: Column[] = [
        {
            title: "Promoción",
            render:(_,record) => {
                return (
                    <strong>{record.promotion_name}</strong>
                )
            } 
        },{
            title: "",
            render:(_,record) => {
                const createdAt = dayjs(record.created_at).format("DD/MM")
                const endsDate = dayjs(record.end_date).format("DD/MM")
                const startDate = dayjs(record.start_date).format("DD/MM")
                const promotionStatus = {
                    "active": "Activo",
                    "inactive:": "Inactivo"
                }
                return(
                    <Space direction="vertical">
                        <p>
                            <strong>Creado: </strong> {createdAt}
                        </p>
                        <p>
                            <strong>Empieza: </strong> {startDate}
                            {" | "}
                            <strong>Termina: </strong> {endsDate}
                        </p>

                        <p>
                            <strong>Estado: </strong>
                            {promotionStatus[record.promotion_status]}
                        </p>
                    </Space>
                )
            }
        },{
            title: "Tipo y condiciones",
            render: (_,record) => {
                const promotionCondition = record.promotion_conditions

                const promotionConditionTraduction = {
                    "specific_products": {
                        name: "Productos seleccionados",
                        data: record.selected_products
                    },
                    "specific_categories": {
                        name: "Categorías especificas",
                        data: record.selected_categories
                    },
                    "all_products": {
                        name: "Todos los productos",
                        data: []
                    }
                }

                const formatedPromotionTypes = (pr_type: String) => {
                    return pr_type
                    .split(/[ _]/g)
                    .map((word:String) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ")

                }

                const promotionValue = record.promotion_value || ""
                const promotionValueFormatted = {
                    "porcentaje": `${promotionValue}%`,
                    "monto_fijo": `${promotionValue.toLocaleString("es-AR", { style: 'currency', currency: "ARS" })}`
                }
                
                return(
                    <React.Fragment>
                        <p>
                            <strong>Tipo de promoción: </strong> 
                            <em>{formatedPromotionTypes(record.promotion_type)}{promotionValue && `: ${promotionValueFormatted[record.promotion_type]}`}</em>
                        </p>
                        <Space direction="vertical">
                            <p><strong>Aplica a: </strong>{promotionConditionTraduction[promotionCondition].name}</p>
                            <Button
                                disabled={promotionCondition==="all_products"}
                                onClick={()=> setOpenModalId(record.promotion_id)}
                            >Ver afectados</Button>
                        </Space>
                        {
                            record.promotion_id === openModalId && <ListPromotionModal
                            closeModal={() => setOpenModalId("")}
                            renderType={
                                promotionCondition
                            }
                            renderData={promotionConditionTraduction[promotionCondition].data}
                        />
                        }
                    </React.Fragment>
                )
            }
        },{
            title: "Codigo de promoción",
            render: (_,record)=> (
                <React.Fragment>
                {
                    record.promotion_code 
                    ? <strong>{record.promotion_code} <CopyOutlined/></strong>
                    : "No hay código"
                }
                </React.Fragment>
            )
        },{
            title: "",
            render(_, record) {
                return (
                    <Space>
                        <Button icon={<EditOutlined/>}
                            onClick={()=> setEditPromotionArguments({
                                
                            })}
                        ></Button>
                        <Button danger icon={<DeleteOutlined/>}></Button>
                    </Space>
                )
            },
        }
    ]
  return {
    promotionColumns
  }
}

export default usePromotionList
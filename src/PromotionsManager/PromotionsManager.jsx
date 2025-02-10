import React from 'react'
import "./promotionsManager.css"
import { Collapse } from 'antd'
import UpsertPromotionForm from './components/Promotions/PromotionEditor/UpsertPromotionForm'
function PromotionsManager() {
    return (
        <React.Fragment>
            <div className="promotions-manager-container">
                <h1>Gestión de promociones</h1>
                <Collapse
                    accordion
                    destroyInactivePanel
                    items={[
                        {
                            key: "1",
                            label: "Promociones",
                            children: <div>hola</div>,
                        },
                        {
                            key: "2",
                            label: "Añadir promociones",
                            children: <UpsertPromotionForm/>,
                        }
                    ]}
                />
            </div>
        </React.Fragment>
    )
}

export default PromotionsManager
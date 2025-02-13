import React, { useEffect, useState } from 'react';
import './upsertPromotionForm.css';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';
import usePromotionEditor from './utils/usePromotionEditor';
import { useAppContext } from "../../Context/AppContext"
function UpsertPromotionForm() {
    const {
        promotionEditorRef, editorRef, handleChange, formData,
        handleAddProduct,
        handleRemoveProduct,
        handleAddCategory,
        handleRemoveCategory,
        errors,
        validateForm,
        selectedProducts,
        selectedCategories,
    } = usePromotionEditor();
    const { 
        products, categories
    } = useAppContext()


    return (
        <div className='promotion-form-container'>
            <form className='promotion-form' ref={promotionEditorRef} onChange={handleChange}>
                <div className="promotion-form-group-options">
                    <label htmlFor="promotion_name" className='promotion-form-label'>
                        <div className='promotion-form-text'>
                            <p className='text-label'>Nombre de la promoción</p>
                            <p className='required-asterisk'>*</p>
                        </div>
                        <input
                            type="text"
                            id='promotion_name'
                            className='promotion-form-input'
                            placeholder="Ej: Descuento de Verano 2023"
                            required
                        />
                        {errors.promotion_name && <p className="error-message">{errors.promotion_name}</p>}
                    </label>
                    <label htmlFor="promotion_code" className='promotion-form-label'>
                        <p>Código de promoción</p>
                        <input
                            type="text"
                            id='promotion_code'
                            className='promotion-form-input'
                            placeholder="Ej: VERANO20"
                        />
                    </label>
                </div>

                <label htmlFor="promotion_description" className='promotion-form-label'>
                    <div className='promotion-form-text'>
                        <p className='text-label'>Descripción</p>
                        <p className='required-asterisk'>*</p>
                    </div>
                    <Editor
                        ref={editorRef}
                        initialValue="Escribe una descripción aquí"
                        previewStyle="vertical"
                        height="350px"
                        initialEditType="wysiwyg"
                        hideModeSwitch
                        toolbarItems={[
                            ['heading', 'bold', 'italic', 'strike'],
                            ['link'],
                            ['quote'],
                            ['ul', 'ol'],
                        ]}
                    />
                    {errors.description && <p className="error-message">{errors.description}</p>}
                </label>

                <div className="promotion-form-group-options">
                    <label htmlFor="promotion_type" className='promotion-form-label'>
                        <p>Tipo de descuento</p>
                        <select id="promotion_type" className='promotion-form-input'>
                            <option value="porcentaje">Porcentaje %</option>
                            <option value="monto_fijo">Monto fijo $</option>
                            <option value="envio_gratis">Envío Gratis</option>
                            <option value="2x1">2x1</option>
                            <option value="compra_por_volumen">Compra por volumen</option>
                        </select>
                    </label>

                    <label htmlFor="promotion_value" className='promotion-form-label'>
                        <p>Valor del descuento</p>
                        <input
                            type="number"
                            id='promotion_value'
                            className='promotion-form-input'
                            placeholder="Ej: 20"
                            required
                            disabled={formData.promotion_type !== 'porcentaje' && formData.promotion_type !== 'monto_fijo'}
                        />
                        {["porcentaje", "monto_fijo"].includes(formData.promotion_type) && errors.promotion_value && <p className="error-message">{errors.promotion_value}</p>}
                    </label>

                    <label htmlFor="promotion_conditions" className='promotion-form-label'>
                        <p>Condiciones de aplicación</p>
                        <select id="promotion_conditions" className='promotion-form-input'>
                            <option value="all_products">Todos los productos</option>
                            <option value="specific_products">Productos específicos</option>
                            <option value="specific_categories">Categorías específicas</option>
                        </select>
                    </label>
                </div>

                {formData.promotion_conditions === 'specific_products' && (
                    <div>
                        <p>Seleccionar productos:</p>
                        <select onChange={handleAddProduct}>
                            <option value="">Seleccionar...</option>
                            {products.map(p => (
                                <option key={p.product_id} value={p.product_id}>{p.product_name}</option>
                            ))}
                        </select>
                        <div>
                            {selectedProducts.map(product => (
                                <span key={product.product_id} onClick={() => handleRemoveProduct(product)}>
                                    {product.product_name} ❌
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {formData.promotion_conditions === 'specific_categories' && (
                    <div>
                        <p>Seleccionar categorías:</p>
                        <select onChange={handleAddCategory}>
                            <option value="">Seleccionar...</option>
                            {categories.map(c => (
                                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                            ))}
                        </select>
                        <div>
                            {selectedCategories.map(category => (
                                <span key={category.catergory_id} onClick={() => handleRemoveCategory(category)}>
                                    {category.category_name} ❌
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="promotion-form-group-options">
                    <label htmlFor="start_date" className='promotion-form-label'>
                        <div className='promotion-form-text'>
                            <p className='text-label'>Fecha de inicio</p>
                            <p className='required-asterisk'>*</p>
                        </div>
                        <input type="date" id='start_date' className='promotion-form-input' required />
                        {errors.start_date && <p className="error-message">{errors.start_date}</p>}
                    </label>

                    <label htmlFor="end_date" className='promotion-form-label'>
                        <div className='promotion-form-text'>
                            <p className='text-label'>Fecha de finalización</p>
                            <p className='required-asterisk'>*</p>
                        </div>
                        <input type="date" id='end_date' className='promotion-form-input' required />
                        {errors.end_date && <p className="error-message">{errors.end_date}</p>}
                    </label>

                    <label htmlFor="promotion_status" className='promotion-form-label'>
                        <p>Estado de la promoción</p>
                        <select id="promotion_status" className='promotion-form-input'>
                            <option value="active">Activa</option>
                            <option value="inactive">Inactiva</option>
                        </select>
                    </label>
                </div>

                <button type="submit" className='promotion-form-button'
                    onClick={validateForm}
                >
                    Guardar promoción
                </button>
            </form>
        </div>
    );
}

export default UpsertPromotionForm;

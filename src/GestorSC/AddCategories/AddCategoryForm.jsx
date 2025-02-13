import React from 'react'
import useCategoryForm from './utils/useCategoryForm'
import { PlusOutlined } from "@ant-design/icons"
import "./categoryForm.css"
import { Spin } from 'antd'
function AddCategoryForm() {
    const { 
        categoryFormRef,
        handleInputChange,
        handleSaveCategory,
        saving
     } = useCategoryForm()
  return (
    <React.Fragment>
        <form ref={categoryFormRef} onChange={handleInputChange} className='category-form'
         onSubmit={(e) => handleSaveCategory(e)}
         >
            <label htmlFor="category_name" className='category-form-label'>
                <p>Nombre de la categoría</p>
                <input 
                    type="text" 
                    className='category-form-input'
                    id='category_name'
                    name='category_name'
                    required
                />
            </label>
            <button className='add-category-button' type='submit'>Agregar {saving ? <Spin/> : <PlusOutlined/>}</button>
        </form>
    </React.Fragment>
  )
}

export default AddCategoryForm
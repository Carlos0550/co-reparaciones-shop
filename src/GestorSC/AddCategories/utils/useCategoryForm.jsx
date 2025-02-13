import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../../Context/AppContext'
import { notification } from 'antd'

function useCategoryForm() {
    const [formData, setFormData] = useState({
        category_name: '',
    })
    const categoryFormRef = useRef(null)
    const { 
        saveCategory
    } = useAppContext()

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }))
    }

    const [saving, setSaving] = useState(false)
    const handleSaveCategory = async(e) => {
        e.preventDefault()
        if(formData.category_name === "") return notification.error({
            message: "El nombre de la categoría no puede estar vacio",
            showProgress: true,
            pauseOnHover: false,
            duration: 3
        })
        setSaving(true)
        const response = await saveCategory(formData.category_name)
        setSaving(false)
        if(response){
            setFormData({category_name: ''})
            const inputs = Array.from(categoryFormRef.current.querySelectorAll('input'))
            inputs.forEach(input => {
                input.value = ''
            })
            
        }
    }
    
    useEffect(() => {
        if(categoryFormRef.current){
            const inputs = Array.from(categoryFormRef.current.querySelectorAll('input'))
            inputs.forEach(input => {
                input.addEventListener("change", handleInputChange)
            })
            return () => {
                inputs.forEach(input => {
                    input.removeEventListener('change', handleInputChange);
                });
            };
        }
    },[])

  return {
      formData,
      setFormData,
      categoryFormRef,
      handleInputChange,
      handleSaveCategory,
      saving
  }
}

export default useCategoryForm
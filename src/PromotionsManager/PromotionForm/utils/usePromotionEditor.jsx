import { useEffect, useRef, useState } from 'react';
import { notification } from "antd"
import { useAppContext } from "../../../Context/AppContext.tsx"
function usePromotionEditor() {
    const promotionEditorRef = useRef(null);
    const editorRef = useRef(null);
    const { 
        products, categories, createPromotion
    } = useAppContext()

    const [formData, setFormData] = useState({
        promotion_name: '',
        promotion_code: '',
        promotion_type: 'porcentaje',
        promotion_value: 0,
        promotion_conditions: 'all_products',
        selectedProducts: [],
        selectedCategories: [],
        start_date: '',
        end_date: '',
        promotion_status: 'active',
    });

    const [isDiscountEnabled, setIsDiscountEnabled] = useState(false);
    const [showProductCategorySelector, setShowProductCategorySelector] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));

        if (id === 'promotion_type') {
            setIsDiscountEnabled(value !== 'porcentaje' || value !== 'monto_fijo');
        }

        if (id === 'promotion_conditions') {
            setShowProductCategorySelector(value === 'specific_products' || value === 'specific_categories');
        }
    };


    useEffect(() => {
        if (promotionEditorRef.current) {
            const inputs = Array.from(promotionEditorRef.current.querySelectorAll('input, select'));

            inputs.forEach(input => {
                input.addEventListener('change', handleInputChange);
            });

            return () => {
                inputs.forEach(input => {
                    input.removeEventListener('change', handleInputChange);
                });
            };
        }
    }, []);

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleAddProduct = (event) => {
        const product = event.target.value;
        const completeProduct = products.find(p => p.product_id === product);
        if (product && !selectedProducts.includes(product)) {
            setSelectedProducts([...selectedProducts, completeProduct]);
        }
    };

    const handleRemoveProduct = (product) => {
        setSelectedProducts(selectedProducts.filter(item => item.product_id !== product.product_id));
    };

    const handleAddCategory = (event) => {
        const category = event.target.value;
        const realCategory = categories.find(c => c.category_id === category);
        if (category && !selectedCategories.includes(category)) {
            setSelectedCategories([...selectedCategories, realCategory]);
        }
    };

    const handleRemoveCategory = (category) => {
        setSelectedCategories(selectedCategories.filter(item => item.category_id !== category.category_id));
    };

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false)
    
    const validateForm = async(e) => {
        e.preventDefault()
        setSaving(true)
       try {
        setErrors({});
        let newErrors = {}
        const descriptionData = editorRef.current.getInstance().getHTML().replace(/<.*?>/g, "").trim();

        if (!formData.promotion_name?.trim()) newErrors.promotion_name = "Este campo es obligatorio.";
        if (!descriptionData) newErrors.description = "La descripción no puede estar vacia.";
        if (!formData.start_date) newErrors.start_date = "Debes seleccionar una fecha de inicio.";
        if (!formData.end_date) newErrors.end_date = "Debes seleccionar una fecha de finalización.";

        if (["porcentaje", "monto_fijo"].includes(formData.promotion_type)) {
            if (!formData.promotion_value || formData.promotion_value <= 0) {
                newErrors.promotion_value = "Debes completar este campo.";
            }
        }

        setErrors(newErrors);
        let numbersOfErrors = Object.keys(newErrors).length
        if(numbersOfErrors > 0){
            notification.error({
                message: `Se ${numbersOfErrors === 1 ? "ha" : "han"} ${numbersOfErrors} error${numbersOfErrors === 1 ? "" : "es"} en la promoción`,
                description: "Reviselos antes de guardar la promoción",
                duration: 3,
                pauseOnHover: false,
                showProgress: true
            })
        }else{
            const formValues = new FormData()
            for (const key in formData) {
                if(key === "selectedProducts" || key === "selectedCategories") continue
                formValues.append(key, formData[key]);
            }

            if(formData.promotion_conditions === "specific_products"){
                formValues.append("selectedProducts", JSON.stringify({
                    products_ids: selectedProducts.map(p => p.product_id),
                }))
            }else if(formData.promotion_conditions === "specific_categories"){
                formValues.append("selectedCategories", JSON.stringify(selectedCategories))
            }

            formValues.append("promotion_description", editorRef.current.getInstance().getHTML())
            console.log(formValues)
            const result = await createPromotion(formValues)
            if(result){
                editorRef.current.getInstance().setHTML("");
                setFormData({
                    promotion_name: '',
                    promotion_code: '',
                    promotion_type: 'porcentaje',
                    promotion_value: 0,
                    promotion_conditions: 'all_products',
                    selectedProducts: [],
                    selectedCategories: [],
                    start_date: '',
                    end_date: '',
                    promotion_status: 'active',
                });
                setSelectedProducts([]);
                setSelectedCategories([]);
                promotionEditorRef.current.reset()
            }
        }
       } catch (error) {
        console.log(error)
       }finally{
        setSaving(false)
       }
    }

    useEffect(() => {
        editorRef.current.getInstance().setHTML("");
    }, []);

    return {
        promotionEditorRef,
        editorRef,
        formData,
        isDiscountEnabled,
        showProductCategorySelector,
        handleAddProduct,
        handleRemoveProduct,
        handleAddCategory,
        handleRemoveCategory,
        selectedProducts,
        selectedCategories,
        errors,
        validateForm,
    };
}

export default usePromotionEditor;

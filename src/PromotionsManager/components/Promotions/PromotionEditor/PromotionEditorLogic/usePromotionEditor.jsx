import { useEffect, useRef, useState } from 'react';
import { notification } from "antd"
function usePromotionEditor() {
    const promotionEditorRef = useRef(null);
    const editorRef = useRef(null);

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

    const availableProducts = ['Producto A', 'Producto B', 'Producto C'];
    const availableCategories = ['Categoría X', 'Categoría Y', 'Categoría Z'];

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

    const dummyProducts = ['Producto 1', 'Producto 2', 'Producto 3', 'Producto 4'];
    const dummyCategories = ['Categoría A', 'Categoría B', 'Categoría C', 'Categoría D'];

    const handleAddProduct = (event) => {
        const product = event.target.value;
        if (product && !selectedProducts.includes(product)) {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    const handleRemoveProduct = (product) => {
        setSelectedProducts(selectedProducts.filter(item => item !== product));
    };

    const handleAddCategory = (event) => {
        const category = event.target.value;
        if (category && !selectedCategories.includes(category)) {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleRemoveCategory = (category) => {
        setSelectedCategories(selectedCategories.filter(item => item !== category));
    };

    const [errors, setErrors] = useState({});
    
    const validateForm = (e) => {
        e.preventDefault()
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
            notification.success({
                message: "Promoción creada con exito",
            })
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
        availableProducts,
        availableCategories,
        handleAddProduct,
        handleRemoveProduct,
        handleAddCategory,
        handleRemoveCategory,
        selectedProducts,
        selectedCategories,
        dummyCategories,
        dummyProducts,
        errors,
        validateForm,
    };
}

export default usePromotionEditor;

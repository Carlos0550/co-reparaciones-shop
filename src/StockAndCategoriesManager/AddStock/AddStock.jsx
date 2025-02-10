import React, { useEffect, useRef } from 'react'
import "./addStock.css"

import { Editor } from "@toast-ui/react-editor"
import "@toast-ui/editor/toastui-editor.css"
import AddStockValidation from './utils/AddStockValidation'
import { Switch } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useAppContext } from '../../Context/AppContext'
function AddStock({ productToEdit }) {
    const editorRef = useRef(null)
    const { 
        categories,
        getCategories
    } = useAppContext()

    useEffect(() => {
        const editorInstance = editorRef.current.getInstance();
        editorInstance.setHTML('');
    }, [editorRef]);

    const alreadyFetched = useRef(false)
    useEffect(()=>{
        if(alreadyFetched.current || categories.length > 0) return;
        alreadyFetched.current = true
        getCategories()

    },[getCategories, categories])

    const {
        fileList,
        uploadImages,
        deleteImage,
        formFieldsRef,
        onFinishStock,
        savingProduct,
        hasOptionsShop, setHasOptionsShop,
        optionsShop,
        handleSetOptionsShop,
        titleOptionShopRef,
        optionsShopRef,
        deleteOptionShop
    } = AddStockValidation(editorRef, productToEdit)
    return (
        <React.Fragment>
            <div className='add-stock-container'>
                <form className='add-stock-form'>
                    <div className="form-layout" ref={formFieldsRef}>

                        <div className="label-stock-layout">
                            <label htmlFor="product_name" className='add-stock-label'>Nombre del producto
                                <input name='product_name' type="text" className='add-stock-input'
                                    placeholder='Ingresa un nombre de producto'
                                />
                            </label>
                            <label htmlFor="product_price" className='add-stock-label'>Precio del producto $
                                <input name='product_price' type="text" className='add-stock-input'
                                    placeholder='Ingresa el precio del producto'
                                />
                            </label>
                        </div>

                        <div className="label-stock-layout">
                            <label htmlFor="product_stock" className='add-stock-label'>Stock disponible
                                <input name='product_stock' type="text" className='add-stock-input'
                                    placeholder='Ingresa el stock disponible'
                                />
                            </label>

                            <label htmlFor="product_category" className='add-stock-label'>
                                Categoría
                            <select name="product_category" id="product_category" className='add-stock-input'>
                                {
                                    categories.map((category, index) => (
                                        <option key={index} value={category.category_id}>{category.category_name}</option>
                                    ))
                                }
                            </select>
                            </label>
                        </div>
                        <label htmlFor="product_options_shop" className='product_options_shop-label'>Opciones de compra

                            <Switch
                                checkedChildren="Si"
                                unCheckedChildren="No"
                                className='product_options_shop-switch'
                                onChange={setHasOptionsShop}
                                checked={hasOptionsShop}
                            />

                            {
                                hasOptionsShop && (
                                    <>
                                        <button
                                            type='button'
                                            className='add-stock-button add-stock-button-options'
                                            onClick={handleSetOptionsShop}
                                        >
                                            Agregar <PlusOutlined />
                                        </button>
                                        <p>Que nombre le quieres dar a las opciones</p>
                                        <input
                                            placeholder='Ingresá un titulo'
                                            ref={titleOptionShopRef}
                                            name='title_option_shop'
                                            type="text" className='add-stock-input add-stock-input-options' />

                                        <p>Opciones (Separados por comas o saltos de linea):</p>
                                        <textarea
                                            ref={optionsShopRef}
                                            name="product_options_shop"
                                            placeholder='Ingresa las opciones de compra'
                                            className='add-options-textarea'
                                        />

                                        {
                                            Object.keys(optionsShop).length > 0 && (
                                                <>
                                                    <p style={{
                                                        color: "red"
                                                    }}>Clickea una opcion para eliminar</p>
                                                    <div className='add-options-list'>

                                                        {
                                                            Object.entries(optionsShop).map(([title, options], index) => (
                                                                <div key={title} className='option-list' onClick={() => deleteOptionShop(title)}>
                                                                    <strong>{index + 1} - {title}</strong>
                                                                    {
                                                                        options.map((option, index) => (
                                                                            <ul key={`option-${index + 1}`}>
                                                                                <li>{option}</li>
                                                                            </ul>
                                                                        ))
                                                                    }
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </>
                                            )
                                        }
                                    </>
                                )
                            }
                        </label>
                        <label htmlFor="description" className='add-stock-label'>Descripción del producto
                            <Editor
                                ref={editorRef}
                                initialValue="Escribe una descripción de tu producto aquí"
                                previewStyle="vertical"
                                height="350px"

                                initialEditType="wysiwyg"
                                customStyle={{
                                    wordBreak: 'break-word',
                                }}
                                hideModeSwitch
                                toolbarItems={[
                                    ['heading', 'bold', 'italic', 'strike'],
                                    ['link'],
                                    ['quote'],
                                    ['ul', 'ol'],
                                ]}

                            />
                        </label>

                        <label
                            htmlFor="product_images"
                            style={{
                                width: fileList.length > 0 ? "auto" : "",
                                height: fileList.length > 0 ? "auto" : "",
                            }}
                            className={fileList.length >= 4 ? "add-stock-label-image disabled" : "add-stock-label-image"}>
                            {fileList.length === 0 && (
                                <input
                                    type="file"
                                    id="product_images"
                                    name='product_images'
                                    className="add-stock-images"
                                    multiple
                                    accept='image/*'
                                    disabled={fileList.length >= 4}
                                    onChange={uploadImages}
                                />
                            )}
                            {fileList && fileList.length > 0 ? (
                                <div className="add-stock-images-container">
                                    {fileList.map((file) => (
                                        <>
                                            <picture key={file.uid} className="add-stock-image-item" onClick={() => deleteImage(file.uid)}>
                                                <img src={file.thumbUrl} alt={file.name} />
                                            </picture>
                                        </>
                                    ))}
                                    {fileList.length < 4 && (
                                        <label
                                            style={{
                                                height: "100px",
                                                width: "90px",
                                            }}
                                            htmlFor='product_images-span'
                                            className="add-stock-label-image upload-text">
                                            <input
                                                type="file"
                                                id="product_images-span"
                                                className="add-stock-images"
                                                name='product_images_span'
                                                multiple
                                                accept='image/*'
                                                disabled={fileList.length >= 4}
                                                onChange={uploadImages}
                                            />
                                            📷 Subir una imagen

                                        </label>
                                    )}
                                </div>
                            )
                                : (
                                    <span className="upload-text">📷 Subir imágenes (hasta 4)</span>
                                )
                            }
                        </label>

                    </div>

                    <button
                        className='add-stock-button'
                        type='submit'
                        disabled={savingProduct}
                        onClick={(e) => onFinishStock(e)}
                    >
                        Guardar producto
                    </button>
                </form>
            </div>
        </React.Fragment>
    )
}

export default AddStock
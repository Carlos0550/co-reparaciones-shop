import React, { useEffect, useRef } from 'react'
import "./addStock.css"

import { Editor } from "@toast-ui/react-editor"
import "@toast-ui/editor/toastui-editor.css"
import AddStockValidation from './AddStockValidation'
function AddStock() {
    const editorRef = useRef(null)

    useEffect(() => {
        const editorInstance = editorRef.current.getInstance();
        editorInstance.setHTML('');
    }, []);

    const { 
        fileList,
        uploadImages,
        deleteImage,
        formFieldsRef,
        handleVerifyFields,
        savingProduct
     } = AddStockValidation(editorRef)

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

                            <label htmlFor="product_stock" className='add-stock-label'>Stock disponible
                                <input name='product_stock' type="text" className='add-stock-input'
                                    placeholder='Ingresa el stock disponible'
                                />
                            </label>
                        </div>

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
                                    ['bold', 'italic', 'strike'],
                                    ['link'],
                                    ['quote'],
                                    ['ul', 'ol'],
                                    ['table'],

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
                        onClick={(e) => handleVerifyFields(e)}
                    >
                        Guardar producto
                    </button>
                </form>
            </div>
        </React.Fragment>
    )
}

export default AddStock
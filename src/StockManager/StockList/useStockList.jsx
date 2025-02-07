import { Button, Modal, notification, Popconfirm, Popover, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { apis } from '../../../apis'
import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons'
import { useAppContext } from '../../Context/AppContext'

function useStockList() {

  const {
    products, setProducts,
    getInitialProducts,
    deleteProduct
  } = useAppContext()
  const [openModalId, setOpenModalId] = useState(null)
  const [openImagesModalId, setOpenImagesModalId] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [searching, setSearching] = useState(false)

  const alreadySearched = useRef(false)
  useEffect(() => {
    if (searchText.trim() === "" && !alreadySearched.current) {
      alreadySearched.current = true
      getInitialProducts()
    }
  }, [getInitialProducts, searchText])

  const normalizedText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  }
  const localeSearch = () => {
    const productFound = products.find(pr =>
      normalizedText(pr.product_name).includes(normalizedText(searchText))
    );

    if (productFound) {
      return setProducts([productFound]);
    }

    return null;
  };

  const handleSearch = async () => {
    alreadySearched.current = false
    try {
      setSearching(true);

      const foundProduct = localeSearch();

      if (!foundProduct) {
        const url = apis.products
        const newUrl = new URL(`${url}/search-product/${searchText}`)
        const response = await fetch(newUrl)
        const responseData = await response.json()
        if (!response.ok) return notification.error({
          message: responseData.message,
          showProgress: true,
          pauseOnHover: false,
          duration: 3
        })

        setProducts(responseData.products);
        return;
      }

    } catch (error) {
      console.log("Error en la búsqueda:", error);
    } finally {
      setSearching(false);
    }
  };


  const stockListColumns = [
    {
      title: "Producto",
      render: (_, record) => {
        return (
          <strong>{record.product_name}</strong>
        )
      }
    }, {
      title: "Descripción",
      render: (_, record) => {
        const isOpen = openModalId === record.product_id
        const product_options = JSON.parse(record?.product_options) || []
        return (
          <>
            <Button onClick={() => setOpenModalId(record.product_id)}>Ver descripción</Button>
            <Modal
              key={record.product_id}
              open={isOpen}
              title={record.product_name}
              onCancel={() => setOpenModalId(null)}
              footer={[
                <Button
                  key={record.product_id}
                  onClick={() => setOpenModalId(null)}
                  danger
                >
                  Cerrar
                </Button>
              ]}
            >

              <div dangerouslySetInnerHTML={{ __html: record.product_description }}></div>
              {product_options && product_options.length > 0 && (
                <>
                <h4>Opciones de compra</h4>
                  <div className='add-options-list'>
                  {product_options && product_options.map((item, index) => (
                    <div key={index} style={{ marginBottom: '20px' }} className='option-list'>
                      <h3>{item.title}</h3>
                      <ul>
                        {item.option.map((option, idx) => (
                          <li key={idx}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                </>
              )}
            </Modal>
          </>
        )
      }
    }, {
      title: "Precio y stock",
      render: (_, record) => {
        const stock = record.product_stock;
        const price = parseFloat(record.product_price).toLocaleString("es-AR", { style: 'currency', currency: "ARS" })
        return (
          <div>
            <p><strong>Precio: </strong>{price} c/u</p>
            <p><strong>Stock: </strong>{stock}</p>
          </div>
        )
      }
    }, {
      title: "Imágenes",
      render: (_, record) => {
        if (!record.images || record.images.length === 0) {
          return "No hay imágenes";
        }

        const imagesArray = record.images.map(img => {
          const fullUrl = `${apis.products}${img}`;
          return fullUrl.replace("/products/", "/");
        });

        const isOpen = openImagesModalId === record.product_id
        return (
          <div >
            <Button onClick={() => setOpenImagesModalId(record.product_id)}>Ver imagenes</Button>

            <Modal
              key={record.product_id}
              open={isOpen}
              title={record.product_name}
              onCancel={() => setOpenImagesModalId(null)}
              footer={[
                <Button
                  key={record.product_id}
                  onClick={() => setOpenImagesModalId(null)}
                  danger
                >
                  Cerrar
                </Button>
              ]}
            >
              <div className='minified-stock-list-images-container'>
                {imagesArray.map((image, index) => (
                  <picture key={index} className='minified-stock-list-images'>
                    <img src={image} alt={`Imagen ${index + 1}`} />
                  </picture>
                ))}
              </div>
            </Modal>
          </div>
        );
      }
    }, {
      render: (_, record) => (
        <Popover
          key={record.product_id}
          content={
            <Space direction='vertical'>
              <Button icon={<EditOutlined />} />
              <Popconfirm
                title="Eliminar producto"
                description="Estas seguro de eliminar el producto?"
                onConfirm={() => deleteProduct(record.product_id)}
                okText="Si"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            </Space>
          }
        >
          <Button icon={<SettingOutlined />} variant='outlined' />
        </Popover>
      )
    }

  ]


  return {
    stockListColumns,
    handleSearch,
    setSearchText,
    searchText
  }
}

export default useStockList

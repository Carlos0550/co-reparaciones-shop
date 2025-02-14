export interface PromotionInterface {
    promotion_id: string,
    promotion_name: string,
    start_date: string,
    end_date: string,
    created_at: string,
    promotion_status: string,
    promotion_type: string,
    promotion_value: number,
    selected_categories: Category[],
    selected_products: Product[],
    promotion_code: string,
    promotion_conditions: string,
    promotion_description: string
}

export interface Column {
    title: string,
    render: (_:any, record: PromotionInterface) => JSX.Element;
}


export interface Category {
    category_id:string,
    category_name:string
}

export interface Product {
    product_id: string,
    product_name: string,
    product_price: number,
    product_stock: number,
    product_description: string,
    product_options: string,
    product_category: string,
    images: string[]
}

export interface ListPromotionModalProps{
    closeModal: () => void,
    renderType: string,
    renderData: Product[] | Category[]
}

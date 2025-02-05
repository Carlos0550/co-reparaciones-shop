const urls = {
    production: {
        baseUrl: ""
    },
    development: {
        baseUrl: "http://localhost:5000"
    }
}

export const apis = {
    products: `${urls.development.baseUrl}/products`
}
/* eslint-disable no-undef */
import axios from 'axios'

export const createProduct = async (product, authtoken) => {
    return await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/product/create`,
        product,
        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
                'Content-type': 'multipart/form-data',
            },
        }
    )
}
export const getProductsByCount = async (count) => {
    return await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/${count}`
    )
}
export const fetchProductsByFilter = async (arg) => {
    return await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/search/filters`,
        arg
    )
}
export const getProduct = async (id, authtoken) => {
    return await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/product/${id}`,
        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
            },
        }
    )
}
export const getRelated = async (productId) => {
    return await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/product/related/${productId}`
    )
}
export const removeProduct = async (slug, authtoken) => {
    return await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/product/${slug}`,

        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
            },
        }
    )
}
export const updateProduct = async (id, product, authtoken) => {
    return await axios.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/product/update/${id}`,
        product,
        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
            },
        }
    )
}
export const getProducts = async (sort, order, page, authtoken) => {
    // console.log("TOKEEEEEE", authtoken);
    return await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/products`,
        {
            sort,
            order,
            page,
        },
        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
            },
        }
    )
}
export const getProductTotal = async (authtoken) => {
    return await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/productCount`,
        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
            },
        }
    )
}
export const productStar = async (productId, star, authtoken) => {
    return await axios.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/product/star/${productId}`,
        { star },
        {
            headers: {
                authtoken,
            },
        }
    )
}

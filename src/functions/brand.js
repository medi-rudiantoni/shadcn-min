/* eslint-disable no-undef */
import axios from 'axios'

export const getBrands = async (authtoken) => {
    return await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/brand/all`,
        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
            },
        }
    )
}
export const getBrand = async (id, authtoken) => {
    return await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/brand/${id}`,
        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
            },
        }
    )
}
export const removeBrand = async (id, authtoken) => {
    return await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/brand/${id}`,

        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
            },
        }
    )
}
export const updateBrand = async (id, brand, authtoken) => {
    return await axios.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/brand/update/${id}`,
        brand,
        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
            },
        }
    )
}
export const createBrand = async (brand, authtoken) => {
    console.log('BANK', brand)
    return await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/brand/create`,
        brand,
        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
            },
        }
    )
}

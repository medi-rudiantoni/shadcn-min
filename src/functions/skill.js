/* eslint-disable no-undef */
import axios from 'axios'

export const getCategories = async () => {
    return await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/categories`
    )
}
export const getSkills = async () => {
    return await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/skills`
    )
}
export const getSkill = async (id, authtoken) => {
    return await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/skill/${id}`,
        {
            headers: {
                Authorization: `Bearear ${authtoken}`,
            },
        }
    )
}
export const removeSkill = async (id, authtoken) => {
    return await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/skill/delete/${id}`,

        {
            headers: {
                Authorization: `Bearear ${authtoken}`,
            },
        }
    )
}
export const updateSkill = async (id, values, authtoken) => {
    return await axios.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/skill/update/${id}`,
        values,
        {
            headers: {
                Authorization: `Bearear ${authtoken}`,
            },
        }
    )
}

export const createSkill = async (skill, authtoken) => {
    return await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/skill/create`,
        skill,
        {
            headers: {
                Authorization: `Bearer ${authtoken}`,
            },
        }
    )
}

export const getSkillSubs = async (_id) => {
    return await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/skill/subskill/${_id}`
    )
}
export const getSubCategories = async () => {
    return await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/subcategories`
    )
}

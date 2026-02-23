/* eslint-disable no-undef */
import axios from "axios";

export const getSubCategories = async () => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/subcategories`);
};

export const getSubCategory = async (id) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/subcategory/${id}`
  );
};
export const removeSubCategory = async (id, authtoken) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/subcategory/delete/${id}`,

    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const updateSubCategory = async (id, category, authtoken) => {
  return await axios.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/subcategory/update/${id}`,
    category,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const createSubCategory = async (category, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/subcategory/create`,
    category,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getSubCategorySubs = async (_id) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/category/subcategory/${_id}`
  );
};

/* eslint-disable no-undef */
import axios from "axios";

export const getCategories = async () => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/maincategory/list`);
};

export const getCategory = async (id, authtoken) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/maincategory/${id}`, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
};
export const removeCategory = async (id, authtoken) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/maincategory/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const updateCategory = async (id, category, authtoken) => {
  return await axios.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/maincategory/${id}`,
    category,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const createCategory = async (category, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/maincategory/create`,
    category,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getCategorySubs = async (_id) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/maincategory/category/${_id}`
  );
};

/* eslint-disable no-undef */
import axios from "axios";

export const getCities = async () => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/city/list`);
};
export const getCity = async (id) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/city/${id}`);
};
export const removeCity = async (slug, authtoken) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/city/${slug}`,

    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const updateCity = async (id, city, authtoken) => {
  return await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/city/${id}`, city, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
};

export const createCity = async (city, authtoken) => {
  console.log("BANK", city);
  return await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/city/create`, city, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
};

export const getCitySubs = async (_id) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/city/subcity/${_id}`);
};

/* eslint-disable no-undef */
import axios from "axios";

export const getCategories = async () => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/categories`);
};
export const getBanks = async () => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/banks`);
};
export const getBank = async (id) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/bank/${id}`);
};
export const removeBank = async (slug, authtoken) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/bank/${slug}`,

    {
      headers: {
        authtoken,
      },
    }
  );
};
export const updateBank = async (id, bank, authtoken) => {
  return await axios.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/bank/${id}`,
    bank,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const createBank = async (bank, authtoken) => {
  console.log("BANK", bank);
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/bank/create`,
    bank,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getBankSubs = async (_id) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/bank/subbank/${_id}`
  );
};

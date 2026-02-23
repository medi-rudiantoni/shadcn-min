/* eslint-disable no-undef */
import axios from "axios";

export const createAdmin = async (admin, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/register`,
    admin,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getAdminsByCount = async (count) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/list/${count}`);
};
export const getAllAdmins = async (sort, order, page, authtoken) => {
  // console.log(authtoken, sort, order, page);
  const data = { sort, order, page };
  return await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/getAll`, data, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
};
export const fetchAdminsByFilter = async (arg) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/search/filters`,
    arg
  );
};
export const getAdmin = async (id, authtoken) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/detail/${id}`, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
};
export const getRelated = async (productId) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/product/related/${productId}`
  );
};
export const removeAdmin = async (id, authtoken) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/remove/${id}`,

    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const updateAdmin = async (id, data, authtoken) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/update/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const updateDataAdmin = async (id, data, authtoken) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/update-data/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getAdmins = async (sort, order, page) => {
  return await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/products`, {
    sort,
    order,
    page,
  });
};
export const getAdminTotal = async (authtoken) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/adminCount`, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
};
export const productStar = async (productId, star, authtoken) => {
  return await axios.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/product/star/${productId}`,
    { star },
    {
      headers: {
        authtoken,
      },
    }
  );
};

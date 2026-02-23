/* eslint-disable no-undef */
import axios from "axios";

export const getCustomersByCount = async (count) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/listCustomer/${count}`
  );
};
export const getAllCustomers = async ({
  authtoken,
  page,
  limit,
  search,
  sort,
  order
}) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);

  return await axios.get(
    `${
      process.env.NEXT_PUBLIC_API_ENDPOINT
    }/admin/allCustomer?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const fetchCustomersByFilter = async (arg) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/search/filters`,
    arg
  );
};

export const getCustomer = async (id, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/customer/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getRelated = async (productId) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/product/related/${productId}`
  );
};
export const removeCustomer = async (slug, authtoken) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/product/${slug}`,

    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const updateCustomer = async (id, data, authtoken) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/customer/update/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getCustomers = async (sort, order, page) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/products`,
    {
      sort,
      order,
      page,
    }
  );
};
export const getCustomerTotal = async (authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/customerCount`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
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
export const searchCustomerByName = async (name, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/customer/search/${name}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

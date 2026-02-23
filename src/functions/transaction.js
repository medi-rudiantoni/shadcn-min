/* eslint-disable no-undef */
import axios from "axios";

export const createTransaction = async (product, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/product`,
    product,
    {
      headers: {
        authtoken,
      },
    }
  );
};
export const getTransactionsByCount = async (count) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/listTransaction/${count}`
  );
};
export const fetchTransactionsByFilter = async (arg) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/search/filters`,
    arg
  );
};
export const getTransaction = async (id, authtoken) => {
  // console.log("ID & TOKEN", id, authtoken);
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/transaction/detail/${id}`,
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
export const removeTransaction = async (id, authtoken) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/transaction/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const updateTransaction = async (id, transaction, authtoken) => {
  return await axios.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/transaction/update/${id}`,
    transaction,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getTransactions = async (
  page,
  filter,
  authtoken,
  startDate,
  endDate
) => {
  console.log(startDate);
  console.log(endDate);
  let body = JSON.stringify({
    dateStart: startDate,
    dateEnd: endDate,
  });
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/transactions?limit=10&page=${page}&type=${filter}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
        "Content-type": "application/json",
      },
    }
  );
};
export const getTransactionTotal = async (authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/transactionCount`,
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
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const productSearch = async (search, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/product/search/${search}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const chartTransaction = async (authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/transaction-chart`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const searchTransaction = async (authtoken, order_id) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/transaction-search?order_id=${order_id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getBruto = async (authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/total-bruto-revenue`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

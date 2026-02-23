/* eslint-disable no-undef */
import axios from "axios";

export const createEngineer = async (engineer, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/engineer`,
    engineer,
    {
      headers: {
        authtoken,
      },
    }
  );
};
export const getEngineersByCount = async (count) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/listEngineer/${count}`
  );
};
export const fetchEngineersByFilter = async (arg) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/search/filters`,
    arg
  );
};
export const getEngineer = async (id, authtoken) => {
  // console.log("ID & TOKEN", id, authtoken);
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/engineer/detail/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getRelated = async (engineerId) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/engineer/related/${engineerId}`
  );
};
export const removeEngineer = async (id, authtoken) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/engineer/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const updateEngineer = async (id, formData, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/engineer/update/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
        "Content-type": "multipart/form-data",
      },
    }
  );
};

// GET ENGINEERS
export const getEngineers = async ({
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
    }/admin/engineers?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getEngineerTotal = async (authtoken) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/engineerCount`, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
};
export const engineerStar = async (engineerId, star, authtoken) => {
  return await axios.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/engineer/star/${engineerId}`,
    { star },
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const searchEngineerByName = async (
  sort,
  order,
  page,
  search,
  authtoken
) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/engineer/search/${search}`,
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
  );
};

export const searchEngineerByFilter = async (
  sort,
  order,
  page,
  id,
  city,
  status,
  authtoken
) => {
  const st = status ? `status=${status}&` : "";
  const sk = id ? `skills=${id}&` : "";
  const ct = city ? `city=${city}` : "";
  const query = st || sk || ct ? `?${sk}${st}${ct}` : "";
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/engineer/search${query}`,
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
  );
};

/* eslint-disable no-undef */
import axios from "axios";

export const createPartner = async (partner, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/createPartner`,
    partner,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getPartner = async (id, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/partner/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getPartnerById = async (id, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/partner/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const updatePartner = async (id, partner, authtoken) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/partner/update/${id}`,
    partner,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getPartners = async ({
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
    }/admin/allPartner?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getProvinces = async (authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/partner/province`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getCities = async (id, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/partner/city/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getSubdistricts = async (id, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/partner/subdistrict/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getSubById = async (id, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/partner/subdistrict/get/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const deletePartner = async (id, authtoken) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/partner/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

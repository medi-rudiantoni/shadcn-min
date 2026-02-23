/* eslint-disable no-undef */
import axios from "axios";

export const createContract = async (contract, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/contract/create`,
    contract,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const addDeviceToContract = async (device, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/contract/device/add`,
    device,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getAllContracts = async ({
  authtoken,
  page,
  limit,
  search,
  sort,
  order,
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
    }/admin/contract/list?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getContractSelect = async (authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/contract/list-select`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getContractDetail = async (id, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/contract/detail/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getContractDevices = async (id, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/contract/devices/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getContract = async (id, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/contract/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const updateContract = async (id, data, authtoken) => {
  // const counter = cntr;
  //console.log("UPDATE CONTRACT DETAIL NIH");
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/contract/update/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const searchDevice = async (name, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/product/search/${name}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const nonactiveContract = async (id, contractStatus, authtoken) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/contract/setActive`,
    contractStatus,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const removeContract = async (id, authtoken) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/contract/remove/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const bulkUploadcontract = async (customer, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/contract/bulkcreate`,
    customer,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
        Accept: "multipart/form-data",
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getContractTotal = async (authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/engineerCount`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getContractByNumber = async (number, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/get-contract-by-number/${number}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getServicePartner = async (authtoken) => {
  console.log("AUTH TOKEN", authtoken);
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/contract/get-service-partner`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const updateServicePartner = async (id, data, authtoken) => {
  // const counter = cntr;
  //console.log("UPDATE CONTRACT DETAIL NIH");
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/contract/update-service-partner/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

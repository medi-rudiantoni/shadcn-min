import axios from "axios";

export const createPriceList = async (authtoken, body) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/price-list/create`,
    body,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
        "Content-type": "application/json",
      },
    }
  );
};

export const getPriceList = async (authtoken) => {
  console.log("TOKEN", authtoken);
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/price-list`, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
};

export const updatePriceList = async (authtoken, body, id, name) => {
  return await axios.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/price-list/update/${id}/${name}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
        "Content-type": "application/json",
      },
    }
  );
};

export const deleteContentPriceList = async (authtoken, id, name) => {
  console.log(authtoken);
  return await axios.put(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/price-list/delete/${id}/${name}`,
    JSON.stringify({}),
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const deletePriceList = async (authtoken, id) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/price-list/delete-all/${id}`,
    JSON.stringify({}),
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

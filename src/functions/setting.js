import axios from "axios";

export const createNewSettings = async (authtoken, data) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/settings/new`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const saveSetting = async (authtoken, data) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/settings`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const getSettings = async (authtoken, type) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/get-settings/${type}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

import axios from "axios";

export const getAllCities = async (authtoken) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/cities`, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
};

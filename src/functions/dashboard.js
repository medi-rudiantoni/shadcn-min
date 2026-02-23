/* eslint-disable no-undef */
import axios from "axios";

export const listTechnician = async (authtoken) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/listTechnician`, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
};
export const OverviewData = async (authtoken) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/overviewData`, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });
}

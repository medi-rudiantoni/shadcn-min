import axios from "axios";

export const getAllTickets = async (authtoken, sort, order, page, status) => {
  console.log("cek", authtoken, sort, order, page, status);
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/ticket/list`,
    { sort, order, page, status },
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
        "Content-type": "application/json",
      },
    }
  );
};
export const getTicket = async (authtoken, id) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/ticket/getone/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
        "Content-type": "application/json",
      },
    }
  );
};
export const updateTicket = async (authtoken, id, data) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/ticket/update/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
        "Content-type": "application/json",
      },
    }
  );
};

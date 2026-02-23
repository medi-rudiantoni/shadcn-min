import axios from "axios";

export const getAllBpaysUser = async (authtoken, body) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/bpay-all-user`,
    body,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
        "Content-type": "application/json",
      },
    }
  );
};

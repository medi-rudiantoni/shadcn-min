import axios from "axios";
export const broadcast = async (data, authtoken) => {
  console.log("BROADCAST");
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/notification/broadcast`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

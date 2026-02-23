import axios from "axios";

export const createInvoice = async (data, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/invoice/create`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const updateInvoice = async (id, data, authtoken) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/invoice/update/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getInvoiceList = async ({
  authtoken,
  month,
  year,
  page,
  limit,
  search,
  sort,
  order,
}) => {
  const params = new URLSearchParams();

  if (month) params.append("month", month);
  if (year) params.append("year", year);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);

  return await axios.get(
    `${
      process.env.NEXT_PUBLIC_API_ENDPOINT
    }/admin/invoice/list?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getInvoiceById = async (id, authtoken) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/invoice/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

// export const updateInvoice = async (req, res) => {
//   try {
//     const response = await axios.put(
//       `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/invoice/update/${req.body.id}`,
//       req.body,
//       {
//         headers: {
//           Authorization: `Bearer ${req.headers.authorization}`,
//         },
//       }
//     );
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error("Error updating invoice:", error);
//     res.status(500).json({ error: "Failed to update invoice" });
//   }
// };

export const deleteInvoice = async (id, token) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/invoice/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

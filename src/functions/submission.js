/* eslint-disable no-undef */
import axios from "axios";

export const getSubmissionsList = async ( authtoken, page ) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/submission/list?limit=10${page && '&page=' + page}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getSubmissionDetail = async (id, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/submission/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const confirmSubmission = async (id, data, authtoken) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/submission/confirm/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const hardDeleteSubmission = async (id, authtoken) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/submission/hard-delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

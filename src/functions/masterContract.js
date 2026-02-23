import axios from "axios";

export const createMasterContract = async ({ contractType, contractName, content }, authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/master-contract/create`,
    { contractType, contractName, content },
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getAllMasterContracts = async (authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/master-contract`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getMasterContractBP = async (authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/master-contract/BP`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getMasterContractSP = async (authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/master-contract/SP`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const getMasterContractById = async (id, authtoken) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/master-contract/${id}`,
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};

export const updateMasterContract = async (id, { contractType, contractName, content }, authtoken) => {
  return await axios.patch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/master-contract/update/${id}`,
    { contractType, contractName, content },
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
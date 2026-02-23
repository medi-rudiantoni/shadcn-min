import axios from "axios";

export const createOrUpdateUser = async (authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/create-or-update-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const loginWithEmail = async (auth, email, password) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/login`,
    { email, password },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};

export const currentUser = async (authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/current-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentAdmin = async (authtoken) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/check-admin`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    }
  );
};
export const onAuthStateChanged = (callback) => {
  return async (dispatch) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await fetch("/api/validate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.isValid) {
          dispatch(authCheck(true, data.user));
          callback(true, data.user); // Mirip dengan `onAuthStateChanged` Firebase
        } else {
          localStorage.removeItem("authToken");
          dispatch(authCheck(false, null));
          callback(false, null); // Jika token tidak valid
        }
      } catch (error) {
        console.error("Token validation failed", error);
        dispatch(authCheck(false, null));
        callback(false, null); // Jika terjadi error
      }
    } else {
      dispatch(authCheck(false, null));
      callback(false, null); // Tidak ada token
    }
  };
};

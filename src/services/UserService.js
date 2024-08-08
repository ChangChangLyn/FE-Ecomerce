import axios from "axios";
export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-in`,
    data
  );
  return res.data;
};
export const signupUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-up`,
    data
  );
  return res.data;
};
export const forgotPassword = async (email) => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/forgot`, {
    email: email,
  });
  return res.data;
};
export const vetifyOTP = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/vetify-otp`,
    data
  );

  return res.data;
};

export const resetPassword = async (data) => {
  try {
    const res = await axiosJWT.put(
      `${process.env.REACT_APP_API_URL}/user/reset-password`,
      data
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response from server:", error.response.data);
      throw error.response.data;
    } else {
      console.error("Error resetting password:", error.message);
    }
    throw error;
  }
};

export const getDetailsUser = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/user/get-details/${id}`,
    {
      headers: { token: `Bearer ${access_token}` },
    }
  );
  return res.data;
};
export const getAllUser = async (access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/user/getAll`,
    {
      headers: { token: `Bearer ${access_token}` },
    }
  );
  return res.data;
};
export const deleteUser = async (id, access_token, data) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/user/delete-user/${id}`,
    data,
    {
      headers: { token: `Bearer ${access_token}` },
    }
  );
  return res.data;
};

export const refreshToken = async (refreshToken) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/refresh-token`,
    {},
    {
      headers: {
        token: `Bearer ${refreshToken}`,
      },
    }
  );
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`);
  return res.data;
};

export const updateUser = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/user/update-user/${id}`,
    data,
    {
      headers: { token: `Bearer ${access_token}` },
    }
  );
  return res.data;
};
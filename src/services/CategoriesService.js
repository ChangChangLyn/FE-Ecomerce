import axios from "axios";
import { axiosJWT } from "./UserService";

export const createCategories = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/categories/create-categories`,
    data
  );
  return res.data;
};
export const getAllCategories = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/categories/get-all-categories`
  );
  return res.data;
};
export const deleteCategories = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/categories/delete-categories/${id}`,
    {
      headers: { token: `Bearer ${access_token}` },
    }
  );

  return res.data;
};

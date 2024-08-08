import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  avatar: "",
  id: "",
  access_token: "",
  isAdmin: false,
  city: "",
  refreshToken: "",
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        name = "",
        email = "",
        phone = "",
        address = "",
        avatar = "",
        _id = "",
        isAdmin,
        access_token = "",
        city = "",
        refreshToken = "",
      } = action.payload;
      state.name = name ? name : state.name;
      state.email = email ? email : state.email;
      state.phone = phone ? phone : state.phone;
      state.address = address ? address : state.address;
      state.avatar = avatar ? avatar : state.avatar;
      state.id = _id ? _id : state.id;
      state.isAdmin = isAdmin ? isAdmin : state.isAdmin;
      state.access_token = access_token ? access_token : state.access_token;
      state.city = city ? city : state.city;
      state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
    },
    resetUser: (state, action) => {
      state.name = "";
      state.email = "";
      state.phone = "";
      state.address = "";
      state.avatar = "";
      state.id = "";
      state.isAdmin = false;
      state.access_token = "";
      state.city = "";
      state.refreshToken = "";
    },
  },
});

export const { updateUser, resetUser } = userSlide.actions;

export default userSlide.reducer;

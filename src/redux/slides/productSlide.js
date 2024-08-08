import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  products: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.search = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    // Lọc sản phẩm dựa trên từ khóa tìm kiếm
    getFilteredProducts: (state) => {
      const normalizedSearch = state.search.toLowerCase();
      return state.products.filter((product) =>
        product.name.toLowerCase().includes(normalizedSearch)
      );
    },
  },
});

export const { searchProduct } = productSlice.actions;

export default productSlice.reducer;

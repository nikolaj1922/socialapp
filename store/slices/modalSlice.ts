import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IModal {
  isOpen: boolean;
  postId: string;
}

const initialState: IModal = {
  isOpen: false,
  postId: "",
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal(state) {
      state.isOpen = true;
    },
    closeModal(state) {
      state.isOpen = false;
    },
    setId(state, action: PayloadAction<string>) {
      state.postId = action.payload;
    },
  },
});

export const { openModal, closeModal, setId } = modalSlice.actions;
export default modalSlice.reducer;

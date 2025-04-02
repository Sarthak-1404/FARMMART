import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    allNews: [],
    loadingNews: false,
    categories: [],
    selectedCategory: ""
}

const newsSlice = createSlice({
    name: 'news',
    initialState: initialValue,
    reducers: {
        setAllNews: (state, action) => {
            state.allNews = [...action.payload];
        },
        setLoadingNews: (state, action) => {
            state.loadingNews = action.payload;
        },
        setCategories: (state, action) => {
            state.categories = [...action.payload];
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        }
    }
});

export const { setAllNews, setLoadingNews, setCategories, setSelectedCategory } = newsSlice.actions;

export default newsSlice.reducer;

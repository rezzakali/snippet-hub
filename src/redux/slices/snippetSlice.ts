import { CodeSnippet } from '@/@types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
interface SnippetState {
  searchTerm: string;
  tags: string[];
  selectedTags: string[];
  snippets: CodeSnippet[];
  selectedSnippet: CodeSnippet | null;
  editData: {
    isEditMode: boolean;
    snippet: CodeSnippet | null;
  };
  filter: 'all' | 'favourite' | 'trash';
  currentPage: number;
  totalPages: number;
}

// Define the initial state using that type
const initialState: SnippetState = {
  searchTerm: '',
  tags: [],
  selectedTags: ['all'],
  snippets: [],
  selectedSnippet: null,
  editData: {
    isEditMode: false,
    snippet: null,
  },
  filter: 'all',
  currentPage: 1,
  totalPages: 1,
};

export const snippetSlice = createSlice({
  name: 'snippets',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
    },
    setSelectedSnippet: (state, action: PayloadAction<CodeSnippet | null>) => {
      state.selectedSnippet = action.payload;
    },
    setEditData: (
      state,
      action: PayloadAction<{
        isEditMode: boolean;
        snippet: CodeSnippet | null;
      }>
    ) => {
      state.editData = action.payload;
    },
    updateSnippet: (state, action: PayloadAction<CodeSnippet>) => {
      // Update in snippets array
      state.snippets = state.snippets.map((snippet) =>
        snippet._id === action.payload._id ? action.payload : snippet
      );

      // Update selected snippet if it matches
      if (state.selectedSnippet?._id === action.payload._id) {
        state.selectedSnippet = action.payload;
      }

      // Update edit data if snippet matches
      if (state.editData.snippet?._id === action.payload._id) {
        state.editData.snippet = action.payload;
      }
    },
    toggleFavourite: (
      state,
      action: PayloadAction<{ snippetId: string; userId: string }>
    ) => {
      const { snippetId, userId } = action.payload;

      const snippet = state.snippets.find(
        (snippet) => snippet._id === snippetId
      );

      if (!snippet) return;

      const isAlreadyFavourite = snippet.favouriteBy.includes(userId);

      if (isAlreadyFavourite) {
        snippet.favouriteBy = snippet.favouriteBy.filter(
          (id: { toString: () => string }) => id.toString() !== userId
        );
      } else {
        snippet.favouriteBy.push(userId);
      }

      state.snippets = state.snippets.map((snippet) =>
        snippet._id === snippetId ? snippet : snippet
      );

      // Toggle in selectedSnippet (if the toggled snippet is currently selected)
      if (state.selectedSnippet && state.selectedSnippet._id === snippetId) {
        const isAlreadyFavourite =
          state.selectedSnippet.favouriteBy.includes(userId);
        if (isAlreadyFavourite) {
          state.selectedSnippet.favouriteBy =
            state.selectedSnippet.favouriteBy.filter(
              (id: { toString: () => string }) => id.toString() !== userId
            );
        } else {
          state.selectedSnippet.favouriteBy.push(userId);
        }
      }
      if (state.filter === 'favourite') {
        state.snippets = state.snippets.filter((s) => s._id !== snippetId);
        state.selectedSnippet = null;
      }
    },

    // ✅ Optimistically delete snippet
    deleteSnippet: (state, action: PayloadAction<string>) => {
      state.snippets = state.snippets.filter(
        (snippet) => snippet._id !== action.payload
      );
      if (state.selectedSnippet?._id === action.payload) {
        state.selectedSnippet = null;
      }
    },

    // ✅ Rollback if API fails
    restoreSnippet: (state, action: PayloadAction<CodeSnippet>) => {
      state.snippets.unshift(action.payload);
    },

    addSnippet: (state, action: PayloadAction<CodeSnippet>) => {
      state.snippets.unshift(action.payload); // Adds new snippet to the start
    },
    setFilter: (
      state,
      action: PayloadAction<'all' | 'favourite' | 'trash'>
    ) => {
      state.filter = action.payload;
    },

    // Optimistic Archive Snippet (Move to Trash)
    archiveSnippetOptimistically: (state, action: PayloadAction<string>) => {
      state.snippets = state.snippets.filter((s) => s._id !== action.payload);

      if (state.selectedSnippet?._id === action.payload) {
        state.selectedSnippet = null;
      }
    },

    // Rollback Snippet if API Fails
    rollbackSnippet: (state, action: PayloadAction<string>) => {
      const snippet = state.snippets.find((s) => s._id === action.payload);
      if (snippet) {
        snippet.isArchived = false;
      }

      if (state.selectedSnippet?._id === action.payload) {
        state.selectedSnippet = null;
      }
    },

    restoreSnippetOptimistically: (state, action: PayloadAction<string>) => {
      // Find the index of the snippet in the array
      state.snippets = state.snippets.filter((s) => s._id !== action.payload);

      // If the restored snippet was selected, clear it
      if (state.selectedSnippet?._id === action.payload) {
        state.selectedSnippet = null;
      }
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    clearStateByFilter: (
      state,
      action: PayloadAction<'all' | 'favourite' | 'trash'>
    ) => {
      state.filter = action.payload;

      // Clear state based on filter
      if (
        action.payload === 'all' ||
        action.payload === 'trash' ||
        action.payload === 'favourite'
      ) {
        state.snippets = [];
        state.selectedSnippet = null;
      }
    },
    updateSnippetsData: (
      state,
      action: PayloadAction<{
        snippets: CodeSnippet[];
        totalPages: number;
        currentPage: number;
      }>
    ) => {
      state.snippets = action.payload.snippets;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
  },
});

export const {
  setSearchTerm,
  setTags,
  setSelectedTags,
  setSelectedSnippet,
  setEditData,
  updateSnippet,
  deleteSnippet,
  restoreSnippet,
  addSnippet,
  toggleFavourite,
  setFilter,
  archiveSnippetOptimistically,
  rollbackSnippet,
  restoreSnippetOptimistically,
  setCurrentPage,
  clearStateByFilter,
  updateSnippetsData,
} = snippetSlice.actions;

export default snippetSlice.reducer;

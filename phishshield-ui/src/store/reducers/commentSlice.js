import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    commentSection: [],
};

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        setCommentSection: (state, action) => {
            state.commentSection = action.payload;
        },
        addComment: (state, action) => {
          state.commentSection.comments.unshift(action.payload);
        },
        deleteComment: (state, action) => {
            state.commentSection.comments = state.commentSection.comments.filter(
                (comment) => comment._id !== action.payload
            );
        },
        addReply: (state, action) => {
            const commentsIdx = state.commentSection.comments.findIndex(comment =>
                comment._id === action.payload.id
            );

            state.commentSection.comments[commentsIdx].replies.push(action.payload.reply);
        }
    },
});

export const {
    setCommentSection,
    addComment,
    deleteComment,
    deleteReply,
} = commentSlice.actions;

export default commentSlice.reducer;

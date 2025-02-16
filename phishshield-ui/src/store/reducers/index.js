import { combineReducers } from "redux";

import menu from "./menu";
import authReducer from "./authSlice";
import commentReducer from "./commentSlice";

const reducers = combineReducers({
  menu,
  auth: authReducer,
  comment: commentReducer,
});

export default reducers;

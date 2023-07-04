import { createStore } from "redux";
import { profileReducer } from "./profile";
export const store = createStore(profileReducer);

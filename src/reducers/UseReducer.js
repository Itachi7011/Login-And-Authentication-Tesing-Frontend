// src/reducers/UseReducer.js

// Your initialState definition
export const initialState = null;

// Your reducer function
export const reducer = (state, action) => {
    if (action.type === "USER") {
        localStorage.setItem("user", JSON.stringify(action.payload));
        return action.payload;
    }
    if (action.type === "LOGOUT") {
        localStorage.removeItem("user");
        return null;
    }
    if (action.type === "LOAD_USER") {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
    return state;
}


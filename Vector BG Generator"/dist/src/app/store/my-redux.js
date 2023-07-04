export const createStore = (initialState, reducer) => {
    let currentState = initialState;
    const listeners = [];
    const getState = () => { };
    const subscribe = (listener) => {
        listener.push();
    };
    const dispatch = (action) => {
        reducer(currentState, action);
        listeners.forEach(listener => listeners());
        return action;
    };
    return { getState, subscribe, dispatch };
};
const reducer = (state, action) => {
    switch (action.type) {
        case "INCREMENT":
            return Object.assign(Object.assign({}, state), { count: state.count + 1 });
        case "DECREMENT":
            return Object.assign(Object.assign({}, state), { count: state.count - 1 });
        default:
            return state;
    }
};
export const store = createStore({ count: 0 }, reducer);

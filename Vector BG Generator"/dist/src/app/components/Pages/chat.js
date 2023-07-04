import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, ChatList, MessageList } from "../components";
import { BtnGroup } from "../components/Select/";
export const ChatPage = (props) => {
    const chatProps = props.chatProps;
    if (isLoggedIn) {
        return (React.createElement(BrowserRouter, null,
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/", element: React.createElement(Layout, { header: React.createElement(Header, null), chats: React.createElement(ChatList, null), messages: React.createElement(MessageList, null) }) }),
                React.createElement(Route, { path: ":roomId", element: React.createElement(Layout, { header: React.createElement(Header, null), chats: React.createElement(ChatList, null), messages: React.createElement(MessageList, null) }) }))));
    }
    else {
        React.createElement(BtnGroup, null);
    }
};

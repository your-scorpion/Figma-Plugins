import { Link } from "react-router-dom";
import '../styles/ui.css';
export const Head = () => {
    return (React.createElement("nav", null,
        React.createElement(Link, { to: "/" }, "Home"),
        " ",
        React.createElement("br", null),
        React.createElement(Link, { to: "/chat" }, "Chat"),
        " ",
        React.createElement("br", null),
        React.createElement(Link, { to: "/profile" }, "Profile"),
        " ",
        React.createElement("br", null)));
};

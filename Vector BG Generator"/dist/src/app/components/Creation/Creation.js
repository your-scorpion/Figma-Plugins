import * as React from 'react';
export const Creation = ({}) => {
    React.useEffect(() => {
        window.onmessage = (event) => {
            const { type, message } = event.data.pluginMessage;
            if (type === 'create-rectangles') {
                console.log(`Figma Says: ${message}`);
            }
        };
    }, []);
    return (React.createElement("div", null));
};
export default Creation;

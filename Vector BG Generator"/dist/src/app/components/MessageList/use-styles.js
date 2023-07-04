import { makeStyles } from '@mui/styles';
export const useStyles = makeStyles(() => {
    return {
        wrapper: {
            padding: "24px",
        },
        input: {
            color: "#234564",
            fontSize: "22px",
        },
        icon: {
            cursor: "pointer",
            color: "var(--main-color)",
        },
        field2: {
            padding: "24px 0px 24px 0px",
        }
    };
});

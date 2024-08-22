import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => {
  return {
    wrapper: {
      //border: "1px solid red",
      padding:
        "4px 24px" /* top and bottom are 10px, left and right are 24px */,
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
    },
    field3: {
      padding: "8 0px 8 0px",
    },
  };
});

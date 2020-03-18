import makeStyles from "@mui/styles/makeStyles";

export const useChatStyles = () => {
  const theStyles = makeStyles(() => ({}));
  const classes = theStyles();

  return {
    classes,
  };
};

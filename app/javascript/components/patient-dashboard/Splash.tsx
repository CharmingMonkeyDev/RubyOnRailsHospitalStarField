/* eslint-disable prettier/prettier */
import * as React from "react";
import makeStyles from '@mui/styles/makeStyles';

interface Props {
  splash_src: string;
  user_name: string;
}

const useStyles = makeStyles(() => ({
  croppedContainer: {
    height: "100vh",
    overflow: "hidden",
    position: "relative",
  },
  croppedSplash: {
    height: "100%",
    minWidth: "100%",
    left: "50%",
    position: "relative",
    transform: "translateX(-50%)",
    zIndex: 1,
  },
  userName: {
    position: "absolute",
    top: 70,
    left: 30,
    right: 30,
    color: "#ffffff",
    font: "44px QuicksandBold",
    zIndex: 20,
  },
  logoContainer: {
    font: "20px QuicksandMedium",
    width: 190,
    height: 110,
    backgroundColor: "#FFFFFF",
    opacity: 0.7,
    zIndex: 20,
    position: "absolute",
    bottom: 150,
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "50%",
    color: "#C1B7B3",
    textAlign: "center",
    paddingTop: 80,
  },
}));

const Splash: React.FC<Props> = (props: any) => {
  const classes = useStyles();

  return (
    <div className={classes.croppedContainer}>
      <h1 className={classes.userName}>
        Hi, <br />
        {props.user_name}
      </h1>
      <img
        src={props.splash_src}
        alt="Starfield Splash"
        className={classes.croppedSplash}
      />
      <div className={classes.logoContainer}>Welcome to Starfield</div>
    </div>
  );
};

export default Splash;

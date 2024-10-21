import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff890a",
    },
    secondary: {
      main: "#777",
    },
  },
  typography: {
    fontFamily: "QuicksandMedium, Roboto, Helvetica, Arial, sans-serif",
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-checked": {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-checked": {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: "bottom", horizontal: "center" },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#ff890a",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
          },
          backgroundColor: "#bbb9b7",
          color: "inherit",
          marginRight: "10px",
          borderTopRightRadius: "5px",
          borderTopLeftRadius: "5px",
          marginTop: "5px",
          fontweight: "bold",
          textTransform: "none",
          fontSize: "16px",
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
      styleOverrides: {
        root: {
          borderRadius: "4px",
          textTransform: "none",
          color: "white",
          paddingY: "10px",
          paddingX: "30px",
        },
        containedPrimary: {
          backgroundColor: "#ff890a",
          "&:hover": {
            backgroundColor: "#e07c08",
          },
        },
        containedSecondary: {
          backgroundColor: "#777",
          "&:hover": {
            backgroundColor: "#666",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // this is styles for the new variants
          "&.subvariant-hovered": {
            "& fieldset": {
              border: "none",
              backgroundColor: "white",
            },
            "& .MuiInputBase-input:hover + fieldset": {
              border: `2px solid blue`,
            },
            "& .MuiInputBase-input:focus + fieldset": {
              border: `2px solid blue`,
            },
          },
        },
      },
    },
  },
});

export default theme;

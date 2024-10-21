import { createContext } from "react";

export const ChatContext = createContext<any>({});
export const AuthenticationContext = createContext<any>({
  csrfToken: "",
  userRole: "patient",
  userId: null,
});
export const NewPatientModalContext = createContext<any>({});
export const ImagesContext = createContext<any>({});
export const BackContext = createContext<any>({
  backPath: "",
  setBackPath: () => {},
});

export const FlashContext = createContext<any>({
  message: { text: "", type: "error" },
  setMessage: (message: any) => {},
});

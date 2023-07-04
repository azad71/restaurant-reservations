"use client";

import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
}

export interface IState {
  loading: boolean;
  data: IUser | null;
  error: string | null;
}

export interface IAuthState extends IState {
  setAuthState: Dispatch<
    SetStateAction<{
      loading: boolean;
      data: null;
      error: null;
    }>
  >;
}

export const AuthenticationContext = createContext<IAuthState>({
  loading: false,
  data: null,
  error: null,
  setAuthState: () => {},
});

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState({
    loading: true,
    data: null,
    error: null,
  });

  const getUserInfo = async () => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const token = getCookie("jwt");

      if (!token) {
        return setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      }

      const response = await axios.get(
        "http://localhost:3000/api/auth/userInfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

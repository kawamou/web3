import React from "react";
import { UseAuthReturnType, useAuth } from "@/hooks/useAuth";

export const AuthContext = React.createContext<{
  auth: ReturnType<typeof useAuth> | null;
}>({ auth: null });

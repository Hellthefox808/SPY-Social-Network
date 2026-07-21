"use client";

import { AuthProvider } from "./AuthContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/services/firebase";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Safety timeout: stop blocking loading after 1 second even if Firebase is unreachable
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 1000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (mounted) {
          setCurrentUser(user);
          setLoading(false);
          clearTimeout(timeout);
        }
      },
      (error) => {
        console.warn("Firebase Auth state listener warning:", error);
        if (mounted) {
          setLoading(false);
          clearTimeout(timeout);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

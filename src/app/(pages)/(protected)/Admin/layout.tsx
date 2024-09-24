"use client";
import appwriteService from "@/appwrite/config";
import { AuthProvider } from "@/context/authContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const [authStatus, setAuthStatus] = useState(false);
  const [loader, setLoader] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    appwriteService
      .isAdmin()
      .then(setAuthStatus)
      .finally(() => setLoader(false));
  }, []);

  useEffect(() => {
    if (!loader && !authStatus) {
      router.push("/"); // Redirect to home if not admin
    }
  }, [loader, authStatus, router]); // Add dependencies

  return (
    <AuthProvider value={{ authStatus, setAuthStatus }}>
      {!loader &&
        authStatus && ( // Only render if admin
          <>
            <main className="px-2 py-4">{children}</main>
          </>
        )}
    </AuthProvider>
  );
};

export default ProtectedLayout;

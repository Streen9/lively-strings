import React, { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import useAuth from "@/context/useAuth";
import appwriteService from "@/appwrite/config";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Input,
  Label,
} from "@/components/UIComponents";
import Image from "next/image";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthStatus } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const session = await appwriteService.login(formData);
      if (session) {
        setAuthStatus(true);
        const redirect = searchParams.get("redirect") || "/";
        router.push(redirect);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full bg-white">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-10 py-12">
            <div className="mb-6 flex justify-center">
              <span className="inline-block w-full max-w-[60px]">
                <Image
                  src="/favicon.ico"
                  alt="Logo"
                  className="w-full h-auto"
                  height="100"
                  width="100"
                />
              </span>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-center text-sm text-gray-600 mb-8">
              Sign in to your account
            </p>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={login} className="space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </form>
          </div>
          <div className="px-10 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">
              Don&apos;t have an account?
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

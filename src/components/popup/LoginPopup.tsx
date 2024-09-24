import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="mb-6">Please log in to add items to your cart.</p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleLogin}>Log In</Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;

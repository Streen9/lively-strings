"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useAuth from "@/context/useAuth";
import Logo from "./Logo";

const menuItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default function Header() {
  const { authStatus } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItems = () => (
    <>
      {menuItems.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className="text-sm font-semibold text-white border border-transparent hover:border-white p-2 rounded transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </>
  );

  const AuthButtons = () => (
    <>
      {authStatus && (
        <Link href="/cart" className="mr-2">
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </Link>
      )}
      <Link
        href={authStatus ? "/profile" : "/signup"}
        className="rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-white hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {authStatus ? "Profile" : "Sign up"}
      </Link>
      <Link
        href={authStatus ? "/logout" : "/login"}
        className="rounded-md border border-white px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {authStatus ? "Logout" : "Log In"}
      </Link>
    </>
  );

  return (
    <header className="relative w-full bg-black py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8">
          <Link href="/" className="inline-block w-full max-w-[150px]">
            <Logo />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-1">
              <NavItems />
            </ul>
          </nav>
        </div>

        {/* Auth Buttons and Cart */}
        <div className="hidden lg:flex items-center space-x-2">
          <AuthButtons />
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-black"
            >
              <nav className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <Link
                    href="/"
                    className="inline-block w-full max-w-[150px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Logo />
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <ul className="space-y-4 mb-8">
                  <NavItems />
                </ul>
                <div className="mt-auto space-y-4">
                  <AuthButtons />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { FeatureRequestModal } from "./FeatureRequestModal";

const userMenuList = [
  { id: 0, name: "Create", path: "/create" },
  { id: 1, name: "My Forms", path: "/my-forms" },
  { id: 2, name: "Responses", path: "/responses" },
  { id: 3, name: "Templates", path: "/templates" },
];

export const Navbar = () => {
  const { isSignedIn } = useUser();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [mounted, setMounted] = useState(false);

  const isHomePage = path === "/";
  const shouldHideNavbar = path.includes("aiform") || path.includes("success");

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(theme === "system" ? systemTheme : theme);
  }, [theme, systemTheme]);

  if (!mounted || shouldHideNavbar) return null;

  const toggleTheme = () =>
    setTheme(currentTheme === "dark" ? "light" : "dark");

  return (
    <nav className="w-full fixed top-0 left-0 z-50 border-b bg-background h-18">
      <div className="max-w-[1376px] mx-auto w-full px-4 md:px-8 py-4">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image
              src={
                currentTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"
              }
              width={118}
              height={36}
              alt="logo"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 w-full">
            {isSignedIn ? (
              <>
                <div className="flex items-center w-full gap-6">
                  {!isHomePage &&
                    userMenuList.map((menu) => (
                      <Link
                        key={menu.id}
                        href={menu.path}
                        className={`text-sm font-semibold text-muted-foreground hover:text-foreground ${
                          path === menu.path && "text-primary"
                        }`}
                      >
                        {menu.name}
                      </Link>
                    ))}
                </div>

                {isHomePage && (
                  <div className="flex-grow">
                    <Link href="/create">
                      <Button variant="outline">
                        Create a Form
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Feature request button with link */}
                <FeatureRequestModal />

                <UserButton
                  appearance={{ elements: { avatarBox: "w-9 h-9" } }}
                />
              </>
            ) : (
              <>
                <div className="flex w-full gap-6 justify-end">
                  <SignInButton>
                    <Button>Sign in</Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button variant="outline">Sign up</Button>
                  </SignUpButton>
                </div>
              </>
            )}

            {/* Theme Toggle (Desktop) */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9 p-0 shrink-0"
            >
              {currentTheme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4 w-full justify-end">
            {/* Theme Toggle (Mobile) */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9"
            >
              {currentTheme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full w-9 h-9"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>

            {isSignedIn && (
              <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}>
            <div
              className="fixed top-[69px] h-lvh left-1/2 -translate-x-1/2 w-full bg-background shadow-lg px-6 py-8 flex flex-col items-center gap-4 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {isSignedIn ? (
                <>
                  {!isHomePage ? (
                    userMenuList.map((menu) => (
                      <Link
                        key={menu.id}
                        href={menu.path}
                        className="text-lg font-semibold text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        {menu.name}
                      </Link>
                    ))
                  ) : (
                    <Link
                      href="/create"
                      className="text-lg font-semibold w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Create a Form
                      </Button>
                    </Link>
                  )}
                  <div className="w-full">
                    {/* Mobile feature request button with link */}
                    <FeatureRequestModal />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-4 w-full">
                    <SignInButton>
                      <Button
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign in
                      </Button>
                    </SignInButton>
                    <SignUpButton>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign up
                      </Button>
                    </SignUpButton>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

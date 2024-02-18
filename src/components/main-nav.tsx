"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import ThemeSwitch from "./theme-switch";
import { Button } from "./ui/button";

export default function MainNav() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between h-full w-full md:w-2/3">
      <ThemeSwitch />

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>

      <SignedOut>
        <Button onClick={() => router.push("/sign-in")}>Sign in</Button>
      </SignedOut>
    </div>
  );
}

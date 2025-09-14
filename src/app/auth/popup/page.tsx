"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import React from "react";
import { Spinner } from "@/components/Spinner/Spinner";

export default function AuthPopupPage() {
  useEffect(() => {
    // Ask NextAuth to redirect (in the popup) and then send the user back to /auth/popup/callback
    const callback = `${window.location.origin}/auth/popup/callback`;
    signIn("google", { callbackUrl: callback }); // will navigate the popup to the provider
  }, []);

  return (
    <h1>
      Opening provider — please wait…
      <Spinner />
    </h1>
  );
}

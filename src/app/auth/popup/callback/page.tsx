"use client";
import { Spinner } from "@/components/Spinner/Spinner";
import { useEffect } from "react";

export default function AuthPopupCallback() {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const error = query.get("error"); // NextAuth may append error in query
    const message = error
      ? { type: "next-auth-popup", status: "error", error }
      : { type: "next-auth-popup", status: "success" };

    try {
      window.opener?.postMessage(message, window.location.origin);
    } catch (e) {
      console.error("Failed to postMessage to opener", e);
    }

    // close the popup (some browsers may block window.close() unless window was opened by script)
    setTimeout(() => window.close(), 200);
  }, []);

  return (
    <h1>
      Finishing authentication… you can close this window.
      <Spinner />
    </h1>
  );
}

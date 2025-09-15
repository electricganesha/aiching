"use client";

import ProfilePicture from "@/components/ProfilePicture/ProfilePicture";
import { useSession } from "next-auth/react";
import React from "react";

const ProfilePage = () => {
  const session = useSession();
  const username = session.data?.user?.name || "Guest";
  const email = session.data?.user?.email || "No email";
  const image = session.data?.user?.image || "/default_profile.png";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        gap: "18px",
      }}
    >
      <h1>Profile Page</h1>
      <ProfilePicture src={image} alt="Profile Picture" size={100} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: 0,
          padding: 0,
        }}
      >
        <p>
          <strong>Username:</strong> {username}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
      </div>
      <p></p>
    </div>
  );
};

export default ProfilePage;

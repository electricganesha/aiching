"use client";

import ProfilePicture from "@/components/ProfilePicture/ProfilePicture";
import { useSession } from "next-auth/react";
import React from "react";

import styles from "./page.module.css";
import Image from "next/image";

const ProfilePage = () => {
  const session = useSession();
  const username = session.data?.user?.name || "Guest";
  const email = session.data?.user?.email || "No email";
  const image = session.data?.user?.image || "/default_profile.png";

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <Image
          src="/logo/logo_white.png"
          alt="aiChing Logo"
          width={128}
          height={128}
        />
        <h1>Profile</h1>
      </div>
      <div className={styles.profileContent}>
        <ProfilePicture src={image} alt="Profile Picture" size={100} />
        <div className={styles.profileInfo}>
          <p>
            <strong>Username:</strong> {username}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
        </div>
        <p></p>
      </div>
    </div>
  );
};

export default ProfilePage;

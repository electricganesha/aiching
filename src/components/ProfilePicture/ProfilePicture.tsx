import Image from "next/image";
import React from "react";

import styles from "./ProfilePicture.module.css";

interface ProfilePictureProps {
  src: string;
  alt: string;
  size?: number;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  alt,
  size = 50,
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={styles.profilePicture}
    />
  );
};

export default ProfilePicture;

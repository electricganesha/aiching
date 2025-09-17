import { FC } from "react";

import styles from "./Footer.module.css";

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <small>Built with respect for ancient wisdom and modern technology</small>
    </footer>
  );
};

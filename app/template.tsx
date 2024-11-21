"use client"
import styles from "@/app/page.module.css";
import Topo from "@/app/ui/topo";
import { SessionProvider } from "next-auth/react";


export default function Template({ children }: { children: React.ReactNode }) {

  return (
    <main className={styles.main}>
      <SessionProvider>

        <Topo />
        <div className={styles.centro}>
          {children}
        </div>


      </SessionProvider>
    </main>
  );
}
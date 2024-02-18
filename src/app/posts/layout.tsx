import React from "react";
import Image from "next/image";

import Footer from "@/components/footer";
import MainNav from "@/components/main-nav";
import ContactPage from "@/components/contact";
import socialmedia from "@/public/socialmedia.svg";

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="relative z-50 ">
        <div
          className="flex top-0 justify-between px-4 w-full fixed border
       bg-white bg-opacity-80 shadow-2xl shadow-black/[0.03] backdrop-blur-[0.5rem] dark:bg-gray-950/75"
        >
          <div className="mr-32 block md:h-24 dark:bg-gray-600">
            <Image
              src={socialmedia}
              width={100}
              height={100}
              alt="social media image"
            />
          </div>
          <div className="md:h-20 border-b w-2/5">
            <MainNav />
          </div>
        </div>
      </header>
      <main className="pt-24">{children}</main>
      <footer>
        <ContactPage />
        <Footer />
      </footer>
    </>
  );
}

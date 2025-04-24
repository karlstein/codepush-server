"use client";

import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { logout, setCookie } from "@/api/fetch";
import ChevronBottom from "@/assets/svgs/chevron-bottom";
import { getSession } from "@/lib/auth";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { toast, ToastContainer } from "react-toastify";

interface HeaderProps {
  authTokenCookie?: RequestCookie;
  hostnameCookie?: RequestCookie;
}

const Header = (props: HeaderProps) => {
  const { authTokenCookie, hostnameCookie } = props;

  const [session, setSession] = useState<{
    loading: boolean;
    data?: Session | null;
  }>({ loading: true });
  const router = useRouter();

  const setAuthTokenCookie = (token: string) => {
    setCookie(token, hostnameCookie?.value || "http://localhost:3004")
      .then((res: any) => {
        if (res.status !== 200) throw res;
      })
      .catch((err) => {
        console.error("cp-server - Header - err", err);
        toast(`Something wrong! ${err.statusText}`, { type: "error" });

        if (err.statusText === "token is expired") signOut();
      });
  };

  useEffect(() => {
    getSession().then((data) => {
      if (
        data?.authToken &&
        (!authTokenCookie?.value || authTokenCookie?.value !== data?.authToken)
      ) {
        setAuthTokenCookie(data?.authToken);
      }

      setSession({ loading: false, data });
    });
  }, []);

  useEffect(() => {
    if (!session.loading && !session.data) {
      router.replace("/");
    }
  }, [session, router]);

  return (
    <header className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-10 bg-opacity-80 bg-bg-dark backdrop-blur">
      <div className="text-accent font-bold text-xl">
        <span className="text-white">Code Push Server</span>
      </div>
      <ToastContainer />
      <nav>
        <ul className="flex gap-8 items-center">
          <li>
            <a
              href="#projects"
              className="text-white hover:text-accent transition-colors"
            >
              Projects
            </a>
          </li>
          <li>
            <AccountGroup />
          </li>
        </ul>
      </nav>
    </header>
  );
};

interface AccountRowProps {
  title: string;
  onClick: () => void;
}

const AccountGroup = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative group">
      <div
        className="text-white hover:text-accent transition-colors flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen((state) => !state)}
      >
        Account
        <ChevronBottom />
      </div>
      {/* <div className="absolute right-0 mt-2 w-48 bg-card-bg rounded-md shadow-lg py-1 hidden group-hover:block"> */}
      <div
        className={`absolute right-0 mt-2 w-48 bg-card-bg rounded-md shadow-lg py-1 ${
          open ? "block" : "hidden"
        }`}
      >
        <AccountRow
          title={"Profile"}
          onClick={() => {
            console.log("Profile not yet implemeneted");
          }}
        />
        <AccountRow
          title={"Settings"}
          onClick={async () => {
            // console.log("Setting not yet implemeneted");
            await setCookie("asdada", "http://localhost:3004");
          }}
        />
        <AccountRow title={"Sign out"} onClick={() => signOut().then(logout)} />
      </div>
    </div>
  );
};

const AccountRow = (props: AccountRowProps) => {
  const { title, onClick } = props;

  return (
    <div
      className="block px-4 py-2 text-sm text-white hover:bg-accent hover:text-bg-dark cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {title}
    </div>
  );
};

export default Header;

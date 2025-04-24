import { type ClassValue, clsx } from "clsx";
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCookie = async (key: string) => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);

  return cookie;
};

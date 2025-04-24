"use server";

import { authOptions } from "@/constants";
import { getServerSession } from "next-auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

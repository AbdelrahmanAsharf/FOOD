"use server";

import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅
import { revalidatePath } from "next/cache";

export const deleteUser = async (id: string) => {
  try {

    const user = await db.user.findUnique({
      where: { id },
      select: { clerkId: true },
    });

    if (!user || !user.clerkId) {
      return {
        status: 404,
        message: "User not found.",
      };
    }

    await db.user.delete({
      where: { id },
    });

    await clerkClient.users.deleteUser(user.clerkId);

    
    revalidatePath("/admin/users");

    return {
      status: 200,
      message: "User deleted successfully.",
    };
  } catch (error) {
    console.error("Delete user error:", error);
    return {
      status: 500,
      message: "An unexpected error occurred.",
    };
  }
};

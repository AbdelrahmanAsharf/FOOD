import React from "react";
import { db } from "@/lib/prisma";
import Form from "./_components/Form";
import BranchItem from "./_components/BranchItem";

async function page() {
  const branches = await db.branch.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <Form />

      {branches.length > 0 ? (
        <ul className="flex flex-col gap-4 ">
          {branches.map((branch) => (
            <BranchItem key={branch.id} branch={branch} />
          ))}
        </ul>
      ) : (
        <p className="text-accent text-center py-10">No Branches Found</p>
      )}
    </main>
  );
}

export default page;
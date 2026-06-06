import { db } from "@/lib/prisma";
import Form from "./_components/Form";
import ExtraItem from "./_components/ExtraItem";

export default async function ExtrasPage() {
  const extras = await db.extra.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <Form />
      {extras.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {extras.map((extra) => (
            <ExtraItem key={extra.id} extra={extra} />
          ))}
        </ul>
      ) : (
        <p className="text-accent text-center py-10">لا توجد إضافات بعد</p>
      )}
    </main>
  );
}
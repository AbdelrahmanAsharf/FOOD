import Link from "next/link";

export default function CashSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full">
        <div className="text-6xl mb-6">✅</div>

        <h1 className="text-3xl font-bold text-orange-600 mb-3">
          تم تسجيل طلبك!
        </h1>

        <p className="text-gray-600 mb-4">
          سيتم التواصل معك قريباً لتأكيد الطلب
        </p>

        <div className="bg-orange-50 rounded-2xl p-4 mb-6 text-right space-y-2">
          <p className="text-gray-600">📞 للتواصل والاستفسار:</p>
          <p className="font-bold text-lg">01xxxxxxxxx</p>
        </div>

        <Link
          href="/"
          className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl text-lg"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

export default function LoadingPaymentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto" />

        <h1 className="text-2xl font-bold mt-6">
          جاري تحويلك للدفع...
        </h1>

        <p className="text-gray-500 mt-2">
          انتظر قليلاً
        </p>
      </div>
    </div>
  );
}
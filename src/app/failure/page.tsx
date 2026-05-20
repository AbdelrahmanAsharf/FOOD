'use client';

export default function FailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md">
        <h1 className="text-6xl mb-6">❌</h1>
        <h2 className="text-4xl font-bold text-red-600 mb-4">فشل عملية الدفع</h2>
        <p className="text-gray-600 text-lg">
          للأسف، لم تتم عملية الدفع بنجاح.<br />
          برجاء المحاولة مرة أخرى.
        </p>

        <button 
          onClick={() => window.location.href = '/cart'}
          className="mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-lg"
        >
          العودة للسلة والمحاولة مرة أخرى
        </button>
      </div>
    </div>
  );
}
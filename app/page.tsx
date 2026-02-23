
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-blue-900 to-gray-900 text-white">
      <h1 className="mb-4 text-5xl font-extrabold tracking-tight">Samridhdhi Admin Portal</h1>
      <p className="mb-8 text-xl text-gray-300">Comprehensive Business Management System</p>

      <div className="flex gap-4">
        <Link href="/dashboard">
          <button className="rounded-full bg-white px-8 py-3 font-bold text-blue-600 transition hover:bg-gray-100">
            Access Dashboard
          </button>
        </Link>
        <button className="rounded-full border border-gray-500 px-6 py-3 font-semibold text-gray-300 transition hover:bg-gray-800">
          Documentation
        </button>
      </div>
    </div>
  );
}

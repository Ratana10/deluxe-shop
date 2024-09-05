import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-[#660404] mt-32">404</h1>
      <p className="text-xl text-gray-600 mt-4">Oops! Page not found.</p>
      <Link
        href="/"
        className="mt-4 bg-[#AB8529] text-white px-3 py-2 rounded-md text-sm hover:bg-[#AB8529] transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;

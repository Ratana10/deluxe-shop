const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 m-auto w-10 h-10 rounded-full border-4 border-solid border-transparent  border-b-[#AB8529] animate-spin"></div>
        <div className="w-10 h-10 rounded-full border-4 border-solid border-[#AB8529] opacity-50"></div>
      </div>
      <p className="mt-4 text-lg text-gray-700">Loading...</p>
    </div>
  );
};

export default Loading;

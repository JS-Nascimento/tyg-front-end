export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-700/20 border-t-blue-700 rounded-full animate-spin" />
        <p className="text-gray-500 animate-pulse">Carregando cotações...</p>
      </div>
    </div>
  );
}
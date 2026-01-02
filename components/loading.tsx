export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/0">
      <span
        className="inline-block w-12 h-12 border-4 border-white border-b-purple-600 rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

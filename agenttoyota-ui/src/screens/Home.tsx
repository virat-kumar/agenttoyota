const TOYOTA_RED = "#EB0A1E";
const TOYOTA_GRAY = "#222";

export default function Home({
  goProfile,
  goChat,
}: {
  goProfile: () => void;
  goChat: () => void;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-start">
        <h3 className="text-xl font-semibold mb-2" style={{ color: TOYOTA_GRAY }}>Customize Your Financing</h3>
        <p className="text-gray-600 mb-6">Enter your details to get personalized loan & lease options.</p>
        <button onClick={goProfile} className="rounded-xl px-4 py-2.5 font-medium text-white" style={{ backgroundColor: TOYOTA_RED }}>
          Continue
        </button>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-start">
        <h3 className="text-xl font-semibold mb-2" style={{ color: TOYOTA_GRAY }}>Ask chatbot</h3>
        <p className="text-gray-600 mb-6">Chat with an assistant to explore vehicles, financing, and leasing.</p>
        <button onClick={goChat} className="rounded-xl px-4 py-2.5 font-medium text-white" style={{ backgroundColor: TOYOTA_RED }}>
          Open chatbot
        </button>
      </div>
    </div>
  );
}
export default function OrderTabs({ activeTab, onTabChange }) {
  const tabs = ["Semua", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-6">
      {tabs.map(tab => (
        <button key={tab} onClick={() => onTabChange(tab)}
          className={`px-4 py-2.5 border-none bg-transparent text-sm cursor-pointer transition-colors -mb-px border-b-2
            ${activeTab === tab
              ? "text-blue-600 font-semibold border-blue-600"
              : "text-gray-500 font-medium border-transparent hover:text-gray-800"}`}>
          {tab}
        </button>
      ))}
    </div>
  );
}
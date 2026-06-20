function KpiCard({ label, color, value, icon }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 flex gap-4 items-center">
      <div
        className={`${color} rounded-xl p-3 flex items-center justify-center shrink-0`}
      >
        <img src={icon} alt="" className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {label}
        </span>
        <span className="text-2xl font-semibold text-gray-800 mt-1">
          {value}
        </span>
      </div>
    </div>
  );
}

export default KpiCard;

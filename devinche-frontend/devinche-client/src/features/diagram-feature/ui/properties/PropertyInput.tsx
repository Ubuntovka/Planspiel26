import { Info } from "lucide-react";

interface PropertyInputProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  placeholder?: string;
  type?: "text" | "select";
  options?: string[];
  description?: string;
}
export const PropertyInput = ({
  label,
  icon,
  value,
  onChange,
  onSave,
  placeholder,
  type = "text",
  options = [],
  description,
}: PropertyInputProps) => (
  <div className="group relative">
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2 text-xs font-medium mb-2.5 text-(--editor-text-secondary)">
        {icon}
        <span className="uppercase tracking-wide">{label}</span>
      </label>
      {description && (
        <div className="relative flex items-center group/tooltip">
          <Info
            size={13}
            className="text-(--editor-text-secondary) opacity-50 hover:opacity-100 transition-opacity cursor-help"
          />

          {/* Tooltip Popup */}
          <div className="absolute bottom-full right-0 mb-2 w-56 p-2 bg-gray-900 text-white text-[11px] leading-relaxed rounded-md shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none border border-white/10">
            {description}
            <div className="absolute top-full right-1.5 border-[5px] border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
    {type === "select" ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-(--editor-border) bg-(--editor-surface) text-sm text-(--editor-text) appearance-none focus:border-(--editor-accent) focus:outline-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,...")' }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSave()}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-(--editor-border) bg-(--editor-surface) text-sm text-(--editor-text) transition-all focus:border-(--editor-accent) focus:ring-4 focus:ring-(--editor-accent)/10 focus:outline-none"
      />
    )}
  </div>
);
import { useMemo } from "react";
import type { BannerKind } from "../types";

export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  name,
}: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  name,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  name?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200 bg-white"
      >
        <option value="" disabled>
          {placeholder || "Select an option"}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

const TOYOTA_RED = "#EB0A1E";

export function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "relative px-5 py-2 text-sm font-medium transition-colors " +
        (active ? "text-white" : "text-gray-600 hover:text-gray-900")
      }
      style={{ backgroundColor: active ? TOYOTA_RED : "transparent", borderRadius: 9999 }}
    >
      {children}
    </button>
  );
}

export function Banner({
  kind = "success",
  children,
  onClose,
}: {
  kind?: BannerKind;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const styles = useMemo(() => {
    if (kind === "success") return { bg: "bg-green-50", text: "text-green-800", ring: "ring-green-200" };
    if (kind === "error") return { bg: "bg-red-50", text: "text-red-800", ring: "ring-red-200" };
    return { bg: "bg-gray-50", text: "text-gray-800", ring: "ring-gray-200" };
  }, [kind]);
  return (
    <div className={`${styles.bg} ${styles.text} ring-1 ${styles.ring} rounded-xl px-3 py-2 flex items-start gap-3`}>
      <span className="mt-0.5">✅</span>
      <div className="text-sm flex-1">{children}</div>
      {onClose && (
        <button className="text-xs opacity-70 hover:opacity-100" onClick={onClose}>
          Dismiss
        </button>
      )}
    </div>
  );
}

export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center" role="alert" aria-busy>
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-10 w-10 rounded-full border-4 border-gray-300 animate-spin"
          style={{ borderTopColor: TOYOTA_RED }}
          aria-hidden="true"
        />
        <div className="text-sm text-gray-700">{message}</div>
      </div>
    </div>
  );
}
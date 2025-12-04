"use client";

import React, { useState } from "react";

type PasswordInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
};

const EyeOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 4c-3.5 0-6.5 2.1-8 6 1.5 3.9 4.5 6 8 6s6.5-2.1 8-6c-1.5-3.9-4.5-6-8-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3.2 3.2a1 1 0 0 1 1.4 0l12.2 12.2a1 1 0 1 1-1.4 1.4l-2-2c-1.1.46-2.34.7-3.4.7-3.5 0-6.5-2.1-8-6a12 12 0 0 1 3.1-4.5L3.2 4.6a1 1 0 0 1 0-1.4zm6.8 3a4 4 0 0 1 4 4c0 .36-.05.72-.14 1.06l-1.55-1.55a1.5 1.5 0 0 0-1.82-1.82l-1.55-1.55c.34-.09.7-.14 1.06-.14zm-3.06.94L8.2 9.4a1.5 1.5 0 0 0 2.4 2.4l1.26 1.26a4 4 0 0 1-5.92-5.92z" />
  </svg>
);

export function PasswordInput({ id, name, value, onChange, placeholder, label = "Password" }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
      >
        {show ? <EyeClosedIcon /> : <EyeOpenIcon />}
      </button>
    </div>
  );
}

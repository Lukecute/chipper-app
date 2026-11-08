import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import BASE_URL from "../components/urls";


const schema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  complaintMessage: yup
    .string()
    .min(10, "Must be at least 10 characters")
    .max(1000, "Cannot exceed 1000 characters")
    .required("Please describe your complaint"),
});

const Complaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const msgVal = watch("complaintMessage") || "";

  const submitForm = (data) => {
    setLoading(true);
    setServerError("");
    axios
      .post(`${BASE_URL}/complaint`, {
        name: data.name,
        email: data.email,
        message: data.complaintMessage,
        timestamp: new Date().toISOString(),
      })
      .then(() => {
        localStorage.setItem("complaintMessage", data.complaintMessage);
        localStorage.setItem("complaintName", data.name);
        localStorage.setItem("complaintEmail", data.email);
        navigate("/home");
      })
      .catch(() => {
        setServerError("Something went wrong. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full bg-white flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col">
        {/* Logo bar */}
        <div className="flex items-center px-5 pt-10 pb-4">
          <img src="/logo.png" alt="Chipper Cash" style={{ height: "120px", width: "auto" }} />
        </div>

        {/* Hero */}
        <div className="px-5 pb-5">
          <h1 className="text-[28px] font-extrabold text-gray-900 leading-tight">
            Submit a<br />
            Complaint
          </h1>
          <p className="mt-2 text-[14px] text-gray-500">
            Tell us what happened. We'll resolve it quickly.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-1 flex-col px-5"
        >
          {/* Name */}
          <div className="mb-4">
            <div
              className={`flex items-center bg-gray-50 border rounded-2xl px-4 py-[14px] gap-3 ${errors.name ? "border-red-400" : "border-gray-200"}`}
            >
              <svg
                className="w-5 h-5 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                type="text"
                placeholder="Full name"
                className="flex-1 bg-transparent text-[15px] text-gray-900 placeholder-gray-400 outline-none"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-[12px] text-red-500 pl-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <div
              className={`flex items-center bg-gray-50 border rounded-2xl px-4 py-[14px] gap-3 ${errors.email ? "border-red-400" : "border-gray-200"}`}
            >
              <svg
                className="w-5 h-5 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent text-[15px] text-gray-900 placeholder-gray-400 outline-none"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[12px] text-red-500 pl-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="mb-2">
            <div
              className={`bg-gray-50 border rounded-2xl px-4 pt-[14px] pb-3 ${errors.complaintMessage ? "border-red-400" : "border-gray-200"}`}
            >
              <textarea
                placeholder="Describe your complaint in detail…"
                rows={6}
                className="w-full bg-transparent text-[15px] text-gray-900 placeholder-gray-400 outline-none resize-none"
                {...register("complaintMessage")}
              />
              <p className="text-right text-[11px] text-gray-400">
                {msgVal.length}/1000
              </p>
            </div>
            {errors.complaintMessage && (
              <p className="mt-1 text-[12px] text-red-500 pl-1">
                {errors.complaintMessage.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-[13px] text-red-500 text-center my-2">
              {serverError}
            </p>
          )}

          {/* CTA */}
          <div className="mt-auto pb-10 pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-[18px] rounded-full text-[17px] font-bold transition-all duration-200 ${loading ? "bg-[#a78bfa] text-white cursor-not-allowed" : "bg-[#6B4EFF] text-white active:scale-[0.98]"}`}
            >
              {loading ? "Submitting…" : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Complaint;

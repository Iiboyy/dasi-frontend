import { useState } from "react";
import logoDasi from "../../assets/logo_dasi.jpeg";

const SERVICE_ID = "service_zply0pj";
const TEMPLATE_ID = "template_q8a2uw1";
const PUBLIC_KEY = "vrP8Ms_59e1dTGNUI";

const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const EyeIcon = ({ show }) =>
  show ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

// Generate OTP 4 digit
const generateOTP = () => String(Math.floor(1000 + Math.random() * 9000));

export default function ForgotPassword({ onNavigate }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [passwords, setPasswords] = useState({ newPw: "", confirmPw: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputCls =
    "w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm outline-none bg-white transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  // Kirim OTP via EmailJS
  const sendOTP = async (targetEmail) => {
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setOtpExpiry(Date.now() + 5 * 60 * 1000); // expired 5 menit

    const payload = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: {
        to_email: targetEmail,
        to_name: targetEmail.split("@")[0],
        otp_code: newOtp,
      },
    };

    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Gagal mengirim email");
    return newOtp;
  };

  // Step 1 — kirim email
  const handleSendEmail = async () => {
    setError("");
    if (!email) {
      setError("Masukkan alamat email kamu.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }
    setLoading(true);
    try {
      await sendOTP(email);
      setOtp(["", "", "", ""]);
      setStep("otp");
    } catch (e) {
      setError("Gagal mengirim OTP. Cek koneksi atau email kamu.");
    }
    setLoading(false);
  };

  // Step 2 — verifikasi OTP
  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val.slice(-1);
    setOtp(updated);
    if (val && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleVerifyOtp = () => {
    setError("");
    const inputOtp = otp.join("");
    if (inputOtp.length < 4) {
      setError("Masukkan 4 digit kode OTP.");
      return;
    }
    if (Date.now() > otpExpiry) {
      setError("Kode OTP sudah kadaluarsa. Kirim ulang.");
      return;
    }
    if (inputOtp !== generatedOtp) {
      setError("Kode OTP salah. Coba lagi.");
      return;
    }
    setStep("reset");
  };

  // Step 3 — reset password
  const handleResetPassword = async () => {
    setError("");
    if (!passwords.newPw || !passwords.confirmPw) {
      setError("Lengkapi semua field.");
      return;
    }
    if (passwords.newPw.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (passwords.newPw !== passwords.confirmPw) {
      setError("Password tidak cocok.");
      return;
    }
    setLoading(true);
    try {
      // Cari user by email dulu, lalu reset password via endpoint khusus
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: passwords.newPw }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("success");
      } else {
        setError(data.message || "Gagal mereset password");
      }
    } catch (err) {
      setError("Gagal mereset password. Coba lagi.");
    }
    setLoading(false);
  };

  const stepIndex = { email: 0, otp: 1, reset: 2, success: 2 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-6 relative">
      {/* Tombol kembali */}
      <button
        onClick={() => {
          if (step === "email") onNavigate("login");
          else if (step === "otp") setStep("email");
          else if (step === "reset") setStep("otp");
          else onNavigate("login");
        }}
        className="absolute top-6 left-6 flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-600 cursor-pointer shadow-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        <BackIcon />
        {step === "email" ? "Masuk" : "Kembali"}
      </button>

      <div className="bg-white rounded-2xl px-9 py-10 w-full max-w-sm shadow-xl border border-gray-100">
        {/* Logo + step indicator */}
        <div className="flex flex-col items-center mb-7">
          <img
            src={logoDasi}
            alt="DASI"
            className="w-14 h-14 object-contain mb-4"
          />

          {step !== "success" && (
            <div className="flex items-center gap-2 mb-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                    ${
                      stepIndex[step] === i
                        ? "bg-blue-600 text-white"
                        : stepIndex[step] > i
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {stepIndex[step] > i ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 2 && (
                    <div
                      className={`w-8 h-0.5 rounded ${stepIndex[step] > i ? "bg-green-400" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <h1
            className="font-extrabold text-xl text-gray-900 mb-1.5 text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {step === "email" && "Lupa Password"}
            {step === "otp" && "Verifikasi Email"}
            {step === "reset" && "Buat Password Baru"}
            {step === "success" && "Password Berhasil Diubah!"}
          </h1>
          <p className="text-gray-500 text-sm text-center leading-relaxed">
            {step === "email" &&
              "Masukkan email untuk menerima kode verifikasi"}
            {step === "otp" && (
              <span>
                Kode OTP dikirim ke{" "}
                <strong className="text-gray-700">{email}</strong>
              </span>
            )}
            {step === "reset" && "Buat password baru yang kuat"}
            {step === "success" &&
              "Kamu bisa masuk dengan password baru sekarang"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* ── Step 1: Email ── */}
        {step === "email" && (
          <>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Alamat Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                className={inputCls}
              />
            </div>
            <button
              onClick={handleSendEmail}
              disabled={loading}
              className={`w-full py-3 rounded-xl text-sm font-bold border-none mb-5 transition-colors ${loading ? "bg-blue-300 cursor-not-allowed text-white" : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"}`}
            >
              {loading ? "Mengirim OTP..." : "Kirim Kode OTP"}
            </button>
          </>
        )}

        {/* ── Step 2: OTP ── */}
        {step === "otp" && (
          <>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 mb-3 text-center">
                Masukkan 4 digit kode OTP
              </label>
              <div className="flex gap-3 justify-center">
                {otp.map((val, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !val && idx > 0)
                        document.getElementById(`otp-${idx - 1}`)?.focus();
                    }}
                    className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">
                Kode berlaku 5 menit
              </p>
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-blue-700 transition-colors mb-4"
            >
              Verifikasi OTP
            </button>
            <p className="text-center text-sm text-gray-500">
              Tidak menerima kode?{" "}
              <button
                onClick={handleSendEmail}
                disabled={loading}
                className="bg-transparent border-none text-blue-600 font-semibold cursor-pointer text-sm hover:underline"
              >
                {loading ? "Mengirim..." : "Kirim ulang"}
              </button>
            </p>
          </>
        )}

        {/* ── Step 3: Reset password ── */}
        {step === "reset" && (
          <>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  value={passwords.newPw}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, newPw: e.target.value }))
                  }
                  className={`${inputCls} pr-11`}
                />
                <button
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-400 cursor-pointer hover:text-gray-600 p-0.5"
                >
                  <EyeIcon show={showPw} />
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="Ulangi password baru"
                  value={passwords.confirmPw}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, confirmPw: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  className={`${inputCls} pr-11`}
                />
                <button
                  onClick={() => setShowConfirmPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-400 cursor-pointer hover:text-gray-600 p-0.5"
                >
                  <EyeIcon show={showConfirmPw} />
                </button>
              </div>
            </div>
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className={`w-full py-3 rounded-xl text-sm font-bold border-none transition-colors ${loading ? "bg-blue-300 cursor-not-allowed text-white" : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"}`}
            >
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </>
        )}

        {/* ── Step 4: Success ── */}
        {step === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => onNavigate("login")}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Masuk Sekarang
            </button>
          </>
        )}
      </div>
    </div>
  );
}

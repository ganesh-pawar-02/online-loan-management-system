import API_BASE_URL from "../config/api";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // STEP 1 - Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email!");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/users/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      console.error("Send OTP error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 - Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter the OTP!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/users/verify-reset-otp`,
        {
          email,
          otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResetToken(response.data.resetToken);

      toast.success("OTP verified successfully!");
      setStep(3);
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 - Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      toast.error("Please enter a new password!");
      return;
    }

    if (!confirmPassword.trim()) {
      toast.error("Please confirm your password!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/users/reset-password`,
        {
          email,
          resetToken,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        "Password reset successfully!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster />

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mb-6">
          {step === 1 &&
            "Enter your registered email address"}

          {step === 2 &&
            "Enter the OTP sent to your email"}

          {step === 3 &&
            "Create your new password"}
        </p>

        {/* STEP 1 - Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-md"
            />

            <div className="mt-8">
              <center>
                <button
                  className="px-7 py-2 text-white bg-blue-950 hover:bg-blue-900 rounded-md"
                  type="submit"
                  disabled={loading}
                >
                  <span className="text-sm">
                    {loading
                      ? "Sending OTP..."
                      : "Send OTP"}
                  </span>
                </button>
              </center>
            </div>
          </form>
        )}

        {/* STEP 2 - OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <label className="block text-gray-700 font-medium mb-2">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full px-3 py-2 border rounded-md"
            />

            <div className="mt-8">
              <center>
                <button
                  className="px-7 py-2 text-white bg-blue-950 hover:bg-blue-900 rounded-md"
                  type="submit"
                  disabled={loading}
                >
                  <span className="text-sm">
                    {loading
                      ? "Verifying..."
                      : "Verify OTP"}
                  </span>
                </button>
              </center>
            </div>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-blue-600"
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 - New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <label className="block text-gray-700 font-medium mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="Enter new password"
              className="w-full px-3 py-2 border rounded-md"
            />

            <label className="block text-gray-700 font-medium mb-2 mt-4">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border rounded-md"
            />

            <div className="mt-8">
              <center>
                <button
                  className="px-7 py-2 text-white bg-blue-950 hover:bg-blue-900 rounded-md"
                  type="submit"
                  disabled={loading}
                >
                  <span className="text-sm">
                    {loading
                      ? "Resetting..."
                      : "Reset Password"}
                  </span>
                </button>
              </center>
            </div>
          </form>
        )}

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}


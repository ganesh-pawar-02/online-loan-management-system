import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ""; // Retrieve email passed from login page
  const [otp, setOtp] = useState("");

  // API endpoint for verifying OTP
  const API_URL_VERIFY_OTP = "http://65.2.80.0:8080/users/verify-otp";

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.trim() === "") {
      toast.error("Please enter the OTP!");
      return;
    }

    try {
      toast.loading("Verifying OTP...", { id: "otpVerify" });
      const response = await axios.post(
        API_URL_VERIFY_OTP,
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.dismiss("otpVerify");

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        navigate("/dashboard"); // Redirect to dashboard after successful OTP verification
      }
    } catch (error) {
      toast.dismiss("otpVerify");
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <Toaster />
      <form
        className="w-full max-w-2xl p-10 space-y-6 bg-white shadow-md rounded-2xl"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="text-3xl font-bold mb-7 text-center text-blue-900">
          VERIFY OTP
        </h2>

        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-semibold">
            Enter OTP
          </label>
          <input
            id="otp"
            className="w-full px-3 py-2 border rounded"
            type="text"
            placeholder="Enter the OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="px-4 py-2 text-white bg-blue-950 hover:bg-blue-900 rounded-md"
            type="button"
            onClick={handleVerifyOTP}
          >
            Verify OTP
          </button>
        </div>
      </form>
    </div>
  );
}

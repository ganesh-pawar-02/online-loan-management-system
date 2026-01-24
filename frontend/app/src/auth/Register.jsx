import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  // Form fields
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setMail] = useState("");
  const [password, setPass] = useState("");
  const [confirmPassword, setConfPass] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // OTP state: otpSent indicates that an OTP has been sent,
  // and isOtpVerified indicates that the entered OTP is verified.
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // API endpoints (adjust as needed)
  const API_URL_REGISTER = "http://65.2.80.0:8080/users/register";
  const API_URL_SEND_OTP = "http://65.2.80.0:8080/users/send-otp";
  const API_URL_VERIFY_OTP = "http://65.2.80.0:8080/users/verify-otp";

  // Send OTP to the user's email
  const handleSendOTP = async () => {
    if (email.trim() === "") {
      toast.error("Please enter an email!");
      return;
    }

    try {
      toast.loading("Sending OTP...", { id: "otpSend" });
      const response = await axios.post(
        API_URL_SEND_OTP,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.dismiss("otpSend");
      if (response.status === 200) {
        setOtpSent(true);
        toast.success("OTP has been sent to your email!");
      }
    } catch (error) {
      toast.dismiss("otpSend");
      toast.error(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    }
  };

  // Verify the OTP entered by the user using the email field (as in your previous code)
  const handleVerifyOTP = async () => {
    if (otp.trim() === "") {
      toast.error("Please enter the OTP!");
      return;
    }

    try {
      toast.loading("Verifying OTP...", { id: "otpVerify" });
      // Here we send the email and otp to the verification endpoint
      const response = await axios.post(
        API_URL_VERIFY_OTP,
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.dismiss("otpVerify");
      if (response.status === 200) {
        setIsOtpVerified(true);
        toast.success("OTP verified successfully!");
      }
    } catch (error) {
      toast.dismiss("otpVerify");
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    }
  };

  // Handle form submission (registration)
  const onRegister = async (e) => {
    e.preventDefault();

    // Prevent submission unless OTP is verified
    if (!isOtpVerified) {
      toast.error("Please verify the OTP sent to your email first!");
      return;
    }

    // Basic validations
    if (firstName.trim() === "") {
      toast.error("First Name is required!");
      return;
    }
    if (lastName.trim() === "") {
      toast.error("Last Name is required!");
      return;
    }
    if (email.trim() === "") {
      toast.error("Email is required!");
      return;
    }
    if (password.trim() === "") {
      toast.error("Password is required!");
      return;
    }
    if (confirmPassword.trim() === "") {
      toast.error("Please confirm your password!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (phone.trim() === "") {
      toast.error("Phone number is required!");
      return;
    }

    // Prepare the payload (OTP is already verified so need not be sent)
    const payload = {
      firstName,
      lastName,
      email,
      password,
      phone,
    };

    try {
      toast.loading("Registering...", { id: "registerToast" });
      const response = await axios.post(API_URL_REGISTER, payload, {
        headers: { "Content-Type": "application/json" },
      });
      toast.dismiss("registerToast");

      if (response.status === 201) {
        toast.success("You are registered successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.dismiss("registerToast");
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <Toaster />
      <form
        className="w-full max-w-2xl p-10 space-y-6 bg-white shadow-md rounded-2xl"
        onSubmit={onRegister}
      >
        <h2 className="text-3xl font-bold mb-7 text-center text-blue-900">
          REGISTER
        </h2>

        {/* Row 1: First Name & Last Name */}
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="firstName" className="text-sm font-semibold mb-1 block">
              First Name
            </label>
            <input
              id="firstName"
              className="w-full px-3 py-2 border rounded"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirst(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="lastName" className="text-sm font-semibold mb-1 block">
              Last Name
            </label>
            <input
              id="lastName"
              className="w-full px-3 py-2 border rounded"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLast(e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: Email (with OTP button) & Password */}
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="email" className="text-sm font-semibold mb-1 block">
              Email
            </label>
            <div className="flex items-center gap-2">
              <input
                id="email"
                className="w-full px-3 py-2 border rounded"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setMail(e.target.value)}
              />
              <button
                className="px-4 py-2 text-white bg-blue-950 hover:bg-blue-900 rounded-md"
                type="button"
                onClick={handleSendOTP}
              >
                Send OTP
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="password" className="text-sm font-semibold mb-1 block">
              Password
            </label>
            <input
              id="password"
              className="w-full px-3 py-2 border rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
        </div>

        {/* Row 3: Confirm Password & Mobile (phone) field */}
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-semibold mb-1 block"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              className="w-full px-3 py-2 border rounded"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfPass(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="phone" className="text-sm font-semibold mb-1 block">
              Phone Number
            </label>
            <input
              id="phone"
              className="w-full px-3 py-2 border rounded"
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
            />
          </div>
        </div>

        {/* OTP Input Row (shown if OTP is sent and not yet verified) */}
        {otpSent && !isOtpVerified && (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label htmlFor="otp" className="text-sm font-semibold mb-1 block">
                Enter OTP
              </label>
              <input
                id="otp"
                className="w-full px-3 py-2 border rounded"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              className="px-4 py-2 mt-5 text-white bg-blue-950 hover:bg-blue-900 rounded-md"
              type="button"
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <center>
            <button
              className={`px-4 py-2 text-white rounded-md ${
                isOtpVerified
                  ? "bg-blue-950 hover:bg-blue-900"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              type="submit"
              disabled={!isOtpVerified}
            >
              <span className="text-sm">SIGN UP</span>
            </button>
          </center>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[13px] cursor-pointer text-slate-400">
            Already have an account?
            <span
              className="ml-1 font-semibold hover:text-blue-900 text-slate-700"
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

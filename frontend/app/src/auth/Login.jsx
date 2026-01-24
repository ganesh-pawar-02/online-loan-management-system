import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const API_URL = 'http://65.2.80.0:8080/users/login';

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      const role = sessionStorage.getItem('userRole');
      navigate(role === 'ROLE_ADMIN' ? '/AdminDashboard' : '/dashboard');
    }
  }, [navigate]);

  const onLogin = async (e) => {
    e.preventDefault();

    // Input validation
    if (email.trim() === '') {
      toast.error("Please Enter a Valid Email!");
      return;
    }
    if (pass.trim() === '') {
      toast.error("Please Enter the Password!");
      return;
    }

    const payload = { email, password: pass };

    try {
      // Show loading toast
      toast.loading("Logging in...", { id: "loginToast" });

      // Make API call using axios
      const response = await axios.post(API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Dismiss loading toast
      toast.dismiss("loginToast");

      // Check if the request was successful
      if (response.status === 200) {
        // Extract token and role from the response data
        const { jwt: token, role } = response.data;

        if (!token) {
          throw new Error("Token not found in response.");
        }

        // Store token and role in sessionStorage
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userRole', role);

        toast.success("Login Successful!");

        // Redirect based on user role
        if (role === 'ROLE_ADMIN') {
          navigate('/AdminDashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (error) {
      // Dismiss loading toast in case of error
      toast.dismiss("loginToast");

      // Extract error message from response if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred. Please try again.";
      toast.error(errorMessage);

      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <Toaster />
      <form
        className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-2xl"
        onSubmit={onLogin}
      >
        <h2 className="text-3xl font-bold mb-7 text-center text-blue-900">
          LOGIN
        </h2>
        <div className="mt-5">
          <label htmlFor="email" className="text-sm font-semibold mb-1">
            Email
          </label>
          <input
            className="w-full px-3 py-2 border rounded"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            id="email"
          />
        </div>
        <div className="mt-5">
          <label htmlFor="password" className="text-sm font-semibold mb-1">
            Password
          </label>
          <input
            className="w-full px-3 py-2 border rounded"
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="Password"
            id="pass"
          />
        </div>
        <div className="mt-8">
          <center>
            <button
              className="px-7 py-2 text-white bg-blue-950 hover:bg-blue-900 rounded-md"
              type="submit"
            >
              <span className="text-sm">LOGIN</span>
            </button>
          </center>
        </div>
        <div className="mt-5 text-center">
          <p className="text-[13px] cursor-pointer text-slate-400 mt-1">
            Don't Have an Account?
            <span
              className="ml-1 font-semibold hover:text-blue-900 text-slate-700"
              onClick={() => navigate('/register')}
            >
              Register
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

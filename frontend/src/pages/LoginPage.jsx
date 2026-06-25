import { TextField, Stack, Typography, Button, Alert } from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { useState } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import AuthLayout from "../layouts/AuthLayout";

import { useAuth } from "../context/useAuth";

import { loginUser } from "../services/authService";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [forgotMode, setForgotMode] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  // LOGIN
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await loginUser(data);

      login(response.token, response.user);

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // SEND RESET OTP
  const sendOtpHandler = async () => {
    try {
      if (!email) {
        return toast.error("Please enter your email");
      }

      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          email,
        },
      );

      toast.success(data.message);

      setOtpSent(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const resetPasswordHandler = async () => {
    try {
      if (!otp || !newPassword || !confirmPassword) {
        return toast.error("All fields are required");
      }

      if (newPassword !== confirmPassword) {
        return toast.error("Passwords do not match");
      }

      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          email,
          otp,
          password: newPassword,
        },
      );

      toast.success(data.message);

      setForgotMode(false);

      setOtpSent(false);

      setEmail("");

      setOtp("");

      setNewPassword("");

      setConfirmPassword("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={forgotMode ? "Reset Password" : "Welcome Back"}
      subtitle={
        forgotMode ? "Reset your account password" : "Sign in to continue"
      }
    >
      {!forgotMode ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField label="Email" fullWidth {...register("email")} />

            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password")}
            />

            <LoadingButton
              loading={loading}
              variant="contained"
              size="large"
              type="submit"
            >
              Sign In
            </LoadingButton>

            <Button onClick={() => setForgotMode(true)}>
              Forgot Password?
            </Button>

            <Typography textAlign="center">
              Don't have an account? <Link to="/register">Register</Link>
            </Typography>
          </Stack>
        </form>
      ) : (
        <Stack spacing={2}>
          {!otpSent ? (
            <>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <LoadingButton
                loading={loading}
                variant="contained"
                size="large"
                onClick={sendOtpHandler}
              >
                Send OTP
              </LoadingButton>
            </>
          ) : (
            <>
              <Alert severity="success">OTP sent to {email}</Alert>

              <TextField
                label="Enter OTP"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <LoadingButton
                loading={loading}
                variant="contained"
                size="large"
                onClick={resetPasswordHandler}
              >
                Reset Password
              </LoadingButton>
            </>
          )}

          <Button
            onClick={() => {
              setForgotMode(false);

              setOtpSent(false);

              setEmail("");

              setOtp("");

              setNewPassword("");

              setConfirmPassword("");
            }}
          >
            Back to Login
          </Button>
        </Stack>
      )}
    </AuthLayout>
  );
};

export default LoginPage;

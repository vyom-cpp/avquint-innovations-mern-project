import { TextField, Stack, Typography, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/useAuth";
import { registerUser } from "../services/authService";

const RegisterPage = () => {
  const { register, handleSubmit } = useForm();

  const { login } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showOtpInput, setShowOtpInput] = useState(false);

  const [otp, setOtp] = useState("");

  const [verificationEmail, setVerificationEmail] = useState("");

  const [resendTimer, setResendTimer] = useState(30);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const response = await registerUser(formData);

      setVerificationEmail(formData.email);

      setShowOtpInput(true);

      setResendTimer(30);

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);

      toast.success(response.message || "OTP sent successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email) => {
    if (!email) return "";

    const [username, domain] = email.split("@");

    if (username.length <= 6) {
      return `${username.slice(0, 2)}****@${domain}`;
    }

    return `${username.slice(0, 2)}****${username.slice(-2)}@${domain}`;
  };

  const verifyOtpHandler = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          email: verificationEmail,
          otp,
        },
      );

      login(data.token, data.user);

      toast.success("Email verified successfully");

      navigate("/dashboard");
    } catch (error) {
      setOtp("");

      toast.error(error?.response?.data?.message || "OTP Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtpHandler = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/resend-otp`,
        {
          email: verificationEmail,
        },
      );

      toast.success(data.message);

      setResendTimer(30);

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Start managing tasks">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            fullWidth
            disabled={showOtpInput}
            {...register("name")}
          />

          <TextField
            label="Email"
            fullWidth
            disabled={showOtpInput}
            {...register("email")}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            disabled={showOtpInput}
            {...register("password")}
          />

          {!showOtpInput ? (
            <LoadingButton
              loading={loading}
              variant="contained"
              size="large"
              type="submit"
            >
              Register
            </LoadingButton>
          ) : (
            <>
              <Alert severity="success">
                OTP sent to <strong>{maskEmail(verificationEmail)}</strong>
              </Alert>

              <TextField
                label="Enter OTP"
                placeholder="6-digit OTP"
                fullWidth
                value={otp}
                inputProps={{
                  maxLength: 6,
                  inputMode: "numeric",
                }}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />

              <LoadingButton
                loading={loading}
                variant="contained"
                size="large"
                type="button"
                disabled={otp.length !== 6}
                onClick={verifyOtpHandler}
              >
                Verify OTP
              </LoadingButton>

              <Typography textAlign="center" variant="body2">
                {resendTimer > 0 ? (
                  `Resend OTP in ${resendTimer}s`
                ) : (
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      resendOtpHandler();
                    }}
                  >
                    Resend OTP
                  </Link>
                )}
              </Typography>
            </>
          )}

          <Typography textAlign="center">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;

import {
  TextField,
  Stack,
  Typography,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { useState } from "react";

import { toast } from "react-toastify";

import AuthLayout from "../layouts/AuthLayout";

import { useAuth } from "../context/AuthContext";

import { loginUser } from "../services/authService";

const LoginPage = () => {
  const { register, handleSubmit } =
    useForm();

  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response =
        await loginUser(data);

      login(
        response.token,
        response.user
      );

      toast.success(
        "Login Successful"
      );

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue"
    >
      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
      >
        <Stack spacing={2}>
          <TextField
            label="Email"
            fullWidth
            {...register("email")}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register(
              "password"
            )}
          />

          <LoadingButton
            loading={loading}
            variant="contained"
            size="large"
            type="submit"
          >
            Sign In
          </LoadingButton>

          <Typography
            textAlign="center"
          >
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
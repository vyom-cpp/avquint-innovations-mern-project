import { TextField, Stack, Typography } from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { useState } from "react";

import { toast } from "react-toastify";

import AuthLayout from "../layouts/AuthLayout";

import { useAuth } from "../context/AuthContext";

import { registerUser } from "../services/authService";

const RegisterPage = () => {
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await registerUser(data);

      login(response.token, response.user);

      toast.success("Account Created");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  // const onSubmit = async (data) => {
  //   try {
  //     setLoading(true);

  //     const response = await registerUser(data);

  //     login(response.token, response.user);

  //     toast.success("Account Created");

  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.log("REGISTER CRASH", error);

  //     toast.error(error?.response?.data?.message || "Registration Failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <AuthLayout title="Create Account" subtitle="Start managing tasks">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField label="Name" fullWidth {...register("name")} />

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
            Register
          </LoadingButton>

          <Typography textAlign="center">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;

import React, { useState } from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const UserSignin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    if (name === "email" && !validateEmail(value)) {
      newErrors.email = "Please enter a valid email address.";
    } else if (name === "email") {
      newErrors.email = "";
    }

    if (name === "password" && !validatePassword(value)) {
      newErrors.password = "Password must be at least 6 characters long.";
    } else if (name === "password") {
      newErrors.password = "";
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let formIsValid = true;
    let newErrors = { ...errors };

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      formIsValid = false;
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters long.";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      try {
        const uri=`${process.env.REACT_APP_API_URL}/user/login` || 'http://16.171.159.43:3006/api/v1/user/login'
        const { data } = await axios.post(
          uri,
          formData
        );

        if (data?.status === 200) {
          toast.success("User login successfully!");
          setFormData({
            email: "",
            password: "",
          });
          setTimeout(() => {
            navigate("/create-product");
          }, 1000);
        }
      } catch (error) {
        toast.error("An error occurred while logging in.");
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        marginLeft: 2,
        marginRight: 2,
        background: "#f5f5dcbf",
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Sign in to Your Account
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          onBlur={() => validateField("email", formData.email)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => validateField("password", formData.password)}
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
      </form>
      <Toaster />
    </Box>
  );
};

export default UserSignin;

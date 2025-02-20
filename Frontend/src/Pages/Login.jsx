import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";

const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:9090/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    return { error: error.message };
  }
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For redirecting after login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const response = await loginUser(formData.email, formData.password);
  
    if (response.error) {
      setError(response.error);
    } else {
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("id", response.id);
      localStorage.setItem("username", response.username);
      console.log("Stored Token:", localStorage.getItem("token"));
console.log("Stored Role:", localStorage.getItem("role"));
console.log("Stored ID:", localStorage.getItem("id"));
console.log("Stored Username:", localStorage.getItem("username"));

  
      console.log("User Logged In:", response); // Debugging
  
      switch (response.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "BUYER":
          navigate("/buy");
          break;
        case "SELLER":
        case "AGENT":
          navigate("/sell");
          break;
        default:
          navigate("/");
      }
    }
  };
  
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
          />
          <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} type="submit">
            Login
          </Button>
        </form>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Typography align="center" sx={{ mt: 2 }}>
          <Link to="/register">Don't have an account? Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;

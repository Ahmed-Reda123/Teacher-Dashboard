import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Paper
        elevation={6}
        className="p-10 w-full max-w-sm rounded-xl"
      >
        <Typography
          variant="h4"
          className="text-center mb-6 text-blue-600 font-bold"
        >
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="!bg-blue-600 hover:!bg-blue-700 text-white"
          >
            Log In
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default LoginPage;

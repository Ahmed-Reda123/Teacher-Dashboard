import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../../redux/Apis/Login";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const {loginError,loginLoading} = useSelector(state=>state.auth);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(LoginUser({email, password}));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Paper elevation={6} className="p-10 w-full max-w-lg rounded-xl">
        <div className="text-center mb-4">
          <Typography
            variant="h4"
            className="text-blue-600 font-bold whitespace-nowrap"
          >
            Login To Teacher Dashboard
          </Typography>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="email-field mb-3">
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="pass-field">
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {loginError && <p className="text-red-500">{loginError}</p>}
          <div className="pt-2">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="!bg-blue-600 hover:!bg-blue-700 text-white"
            >
              {loginLoading ? "Loading..." : "Login"}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}

export default Login;

import React from "react";
import { Input } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const login = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-slate-900  min-w-full  h-[100vh] ">
      <form
        onSubmit={login}
        className="bg-white w-1/3 mx-auto h-[100vh] flex flex-col gap-5  px-5"
      >
        <div className="text-3xl font-bold py-5 border-b-2 border-gray-300">Sign in to continue</div>

        <div>
          <div className="py-2">Email :</div>

          <Input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full"
            placeholder="enter your email"
          />
        </div>

        <div>
          <div className="py-2">Password :</div>
          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="w-full bg-gray-300  "
            placeholder="enter your password"
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button className="bg-blue-400 w-full py-4px rounded-md py-2 font-bold">
          Sign In
        </button>

        <div className="flex  font-bold">
          Need an new account ?
          <Link to="/register">
            <p className="hover:underline ml-1">Sign Up</p>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

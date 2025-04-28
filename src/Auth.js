import React, { useState } from "react";
import axios from "axios";

const Auth = ({ setUser }) => {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5000/${isLogin ? "login" : "signup"}`;
    const { data } = await axios.post(url, form);
    if (isLogin) setUser(data.user);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p
          className="text-sm text-center mt-4 text-gray-600 cursor-pointer hover:text-blue-500"
          onClick={() => setIsLogin(!isLogin)}
        >
          Switch to {isLogin ? "Sign Up" : "Login"}
        </p>
      </div>
    </div>
  );
};

export default Auth;

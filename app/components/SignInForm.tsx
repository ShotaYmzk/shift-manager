"use client";

import { useState } from "react";
import { signInUser } from "../utils/auth";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await signInUser(email, password);
    if (user) {
      alert("ログイン成功！");
    } else {
      alert("ログイン失敗！");
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">ログイン</button>
    </form>
  );
}
import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/AuthForm.module.css";

export default function AuthForm({ isSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      `${isSignUp ? "Signing Up" : "Signing In"} with`,
      email,
      password
    );
  };

  return (
    <div
      className={`${styles.authContainer} ${
        isSignUp ? styles.signUp : styles.signIn
      }`}
    >
      <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>
      <div className={styles.socialContainer}>
        <a href="#" className={styles.social}>
          Facebook
        </a>
        <a href="#" className={styles.social}>
          Google
        </a>
        <a href="#" className={styles.social}>
          LinkedIn
        </a>
      </div>
      <span>or use your email for {isSignUp ? "registration" : "login"}</span>
      <form onSubmit={handleSubmit}>
        {isSignUp && <input type="text" placeholder="Name" />}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      <p>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link href={isSignUp ? "/auth/login" : "/auth/signup"}>
          <span className={styles.toggleLink}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </Link>
      </p>
    </div>
  );
}

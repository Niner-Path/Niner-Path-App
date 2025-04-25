import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/AuthForm.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleAuth = async (event) => {
    event.preventDefault();
    const endpoint = isSignUp ? "register" : "login";

    const requestBody = isSignUp
      ? {
          username,
          email,
          password,
          has_completed_questionnaire: false,
        }
      : { email, password };

    console.log("Sending request to:", `http://127.0.0.1:8000/${endpoint}/`);
    console.log("Request Body:", requestBody);

    const response = await fetch(`http://127.0.0.1:8000/${endpoint}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("Response Data:", data);

    if (response.ok) {
      if (isSignUp) {
        // Signup succeeded — now auto-login
        const loginResponse = await fetch("http://127.0.0.1:8000/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          localStorage.setItem("token", loginData.token);

          if (!loginData.has_completed_questionnaire) {
            router.push("/questionnaire");
          } else {
            router.push("/dashboard");
          }
        } else {
          alert(
            `Login after signup failed: ${loginData.error || "Unknown error"}`
          );
        }
      } else {
        localStorage.setItem("token", data.token);

        if (!data.has_completed_questionnaire) {
          router.push("/questionnaire");
        } else {
          router.push("/dashboard");
        }
      }
    } else {
      alert(`Failed: ${data.error || "Unknown error"}`);
    }
  };

  return (
    <div className={styles.backgroundImage}>
      <div
        className={`${styles.container} ${
          isSignUp ? styles.rightPanelActive : ""
        }`}
      >
        {/* Sign Up Form */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form onSubmit={handleAuth}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form onSubmit={handleAuth}>
            <h1>Sign In</h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Overlay */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1>Welcome Back!</h1>
              <p>Your path to success starts here.</p>
              <button className="ghost" onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1>New here? Let's get started!</h1>
              <p>Sign up and unlock personalized career insights.</p>
              <button className="ghost" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

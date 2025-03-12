import { useState } from "react";
import styles from "@/styles/AuthForm.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function HomePage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div
      className={`${styles.container} ${
        isSignUp ? styles.rightPanelActive : ""
      }`}
    >
      {/* Sign Up Form */}
      <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
        <form>
          <h1>Create Account</h1>
          <div className={styles.socialContainer}>
            <a href="#" className={styles.social}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className={styles.social}>
              <i className="fab fa-google"></i>
            </a>
            <a href="#" className={styles.social}>
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className={`${styles.formContainer} ${styles.signInContainer}`}>
        <form>
          <h1>Sign In</h1>
          <div className={styles.socialContainer}>
            <a href="#" className={styles.social}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className={styles.social}>
              <i className="fab fa-google"></i>
            </a>
            <a href="#" className={styles.social}>
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <span>or use your account</span>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign In</button>
        </form>
      </div>

      {/* Overlay */}
      <div className={styles.overlayContainer}>
        <div className={styles.overlay}>
          {/* Left Overlay Panel */}
          <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
            <h1>Welcome Back!</h1>
            <p>Your path to success starts here.</p>
            <button className="ghost" onClick={() => setIsSignUp(false)}>
              Sign In
            </button>
          </div>

            {/* Right Overlay Panel */}
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

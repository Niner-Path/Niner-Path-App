import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to NinerPath!</h1>
      <p>Explore career insights and skill-building opportunities.</p>
      <Link href="/auth">
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>
          Go to Login
        </button>
      </Link>
    </div>
  );
}

import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <h1>Welcome to Your Dashboard</h1>
      <p>Testing Something</p>
      <button style={styles.button} onClick={() => router.push("/")}>
        Go to Home
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#FFD700",
    border: "none",
    borderRadius: "5px",
  },
};

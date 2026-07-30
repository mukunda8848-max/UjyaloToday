import { useEffect, useState } from "react";
import API from "./api/axios";

function App() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Ujyaalo Today — Connection Test</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <p>Categories from your backend:</p>
      <ul>
        {categories.map((c) => (
          <li key={c._id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
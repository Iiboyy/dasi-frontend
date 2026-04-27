import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
const navigate = useNavigate();

const [form, setForm] = useState({
email: "",
password: "",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setLoading(true);

try {
  const res = await axios.post(
    "http://localhost:5000/api/auth/signin",
    form
  );

  const data = res.data;

  console.log("LOGIN RESPONSE:", data);

  localStorage.setItem("admin_token", data.token);
  localStorage.setItem("admin_user", JSON.stringify(data));

  navigate("/dashboard");
} catch (err) {
  setError(
    err.response?.data?.message || "Login gagal"
  );
} finally {
  setLoading(false);
}

};

return ( <div className="h-screen flex items-center justify-center bg-gray-100"> <div className=""> <h1 className="text-2xl font-bold text-center mb-6">
  Admin Sign In </h1>
      {error && (
        <p className="text-red-500 text-sm mb-3 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="block w-auto mx-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
    </div>
  </div>
);
};

export default SignIn;
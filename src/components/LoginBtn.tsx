import { useEffect, useState } from "react";
import axios from "axios";
import { MdLogout } from "react-icons/md";


const LoginBtn = () => {
  const [loged, setLoged] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");

    if (token && storedEmail) {
      setLoged(true);
      const username = storedEmail.split("@")[0];
      setUser(username);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);

      const username = email.split("@")[0];
      setUser(username);
      setLoged(true);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setLoged(false);
    setEmail("");
    setPassword("");
    setUser("");
  };

  return (
    <>
      {loged ? (
        <button
          className="text-xl flex items-center"
          onClick={handleLogout}
        >
          ¡Hola, {user}! <MdLogout className="ms-4 cursor-pointer" />
        </button>
      ) : (
        <div className="text-neutral-700">
          <input
            className="bg-white rounded-lg me-2 px-2"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="bg-white rounded-lg me-2 px-2"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="rounded-lg bg-yellow-300 text-black px-4"
            onClick={handleLogin}
          >
            Login
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      )}
    </>
  );
};

export default LoginBtn;

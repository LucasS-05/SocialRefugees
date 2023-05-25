import Router from "preact-router";
import "./app.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

export function App() {
  return (
    <Router>
        <Home path="/" />
        <Login path="/login" />
        <Register path="/register" />
    </Router>
  );
}

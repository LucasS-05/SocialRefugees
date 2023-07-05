import Router from "preact-router";
import "./app.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Groups from "./pages/Groups";
import Multumim from "./pages/Multumim";
import CreateGroups from "./pages/CreateGroups"
import Dashboard from "./pages/Dashboard"

export function App() {
  return (
    <Router>
      <Home path="/" />
      <Login path="/login" />
      <Register path="/register" />
      <Account path="/account" />
      <Groups path="/groups" />
      <Dashboard path="/dashboard" />
      <CreateGroups path="/creategroup" />
      <Multumim path="/multumim" />
    </Router>
  );
}

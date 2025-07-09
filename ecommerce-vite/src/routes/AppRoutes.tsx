import { Routes, Route } from "react-router-dom";
import LoginScreen from "../pages/LoginScreen";
import HomeScreen from "../pages/HomeScreen";
import Register from "../pages/Register";
import Profile from "../pages/Profile";

export default function AppRoutes() {
  return (
   <Routes>
  <Route path="/" element={<LoginScreen />} />
  <Route path="/login" element={<LoginScreen />} /> {/* nova rota */}
  <Route path="/home" element={<HomeScreen />} />
  <Route path="/register" element={<Register />} />
  <Route path="/profile" element={<Profile />} />
</Routes>

  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "../pages/LoginScreen";
import HomeScreen from "../pages/HomeScreen";
import Register from "../pages/Register"; // <-- aqui

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/register" element={<Register />} /> {/* <-- aqui */}
      </Routes>
    </BrowserRouter>
  );
}

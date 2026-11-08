import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Complaint from "./pages/Complaint";
import PhoneEmail from "./pages/PhoneEmail";
import Otp from "./pages/Otp";
import Pin from "./pages/Pin";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Complaint />} />
          <Route path="/home" element={<PhoneEmail />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/pin" element={<Pin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

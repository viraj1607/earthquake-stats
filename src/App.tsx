import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ChartPanel from "./pages/ChartPanel";
// import DataPanel from "./pages/DataPanel";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/chart" element={<ChartPanel />} /> */}
          {/* <Route path="/data" element={<DataPanel />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;

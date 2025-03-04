import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchResultPage from "./pages/SearchResultPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchResultPage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

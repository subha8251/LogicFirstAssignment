import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import PropertyList from "./pages/PropertyList";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyForm from "./pages/PropertyForm";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/property" />} />
          <Route path="/property" element={<PropertyList />} />
          <Route path="/property/detail/:id" element={<PropertyDetail />} />
          <Route path="/property/create" element={<PropertyForm mode="create" />} />
          <Route path="/property/edit/:id" element={<PropertyForm mode="edit" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

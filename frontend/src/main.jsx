import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PropertyList from "./pages/PropertyList.jsx";
import PropertyDetail from "./pages/PropertyDetail.jsx";
import PropertyForm from "./pages/PropertyForm.jsx";
import "./index.css";

const router = createBrowserRouter([
  { path: "/property", element: <PropertyList /> },
  { path: "/property/detail/:id", element: <PropertyDetail /> },
  { path: "/property/create", element: <PropertyForm mode="create" /> },
  { path: "/property/edit/:id", element: <PropertyForm mode="edit" /> },
  { path: "*", element: <PropertyList /> }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
);

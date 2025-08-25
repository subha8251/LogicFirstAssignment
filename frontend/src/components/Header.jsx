import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
      <Link to="/property" className="text-lg font-semibold">🏠 Property App</Link>
      <nav className="flex gap-4">
        <Link className="hover:underline" to="/property">Properties</Link>
        <Link className="hover:underline" to="/property/create">Add Property</Link>
      </nav>
    </header>
  );
}
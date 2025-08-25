import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./PropertyList.css";

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [price, setPrice] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const backUrl = searchParams.get("backUrl");

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/property/detail/${id}`);
          const data = await res.json();
          setTitle(data.title);
          setDescription(data.description);
          setType(data.type);
          setCity(data.location?.city || "");
          setState(data.location?.state || "");
          setPrice(data.price || "");
        } catch (err) {
          console.error(err);
        }
      };
      fetchProperty();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      type,
      price: Number(price),
      location: { city, state },
    };
    try {
      if (id) {
        await fetch(`http://localhost:5000/api/property/update/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`http://localhost:5000/api/property/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      navigate(backUrl ? decodeURIComponent(backUrl) : "/property");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="property-form-container">
      <button
        onClick={() => navigate(backUrl ? decodeURIComponent(backUrl) : "/property")}
        className="property-form-back-btn"
      >
        ← Back
      </button>

      <form onSubmit={handleSubmit} className="property-form">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="property-form-input"/>
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="property-form-input"/>
        <select value={type} onChange={e => setType(e.target.value)} className="property-form-input">
          <option value="">Select Type</option>
          <option value="pg">PG</option>
          <option value="flat">Flat</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="commercial">Commercial</option>
        </select>
        <select value={city} onChange={e => setCity(e.target.value)} className="property-form-input">
          <option value="">Select City</option>
          {["Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jamshedpur", "Lucknow"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={state} onChange={e => setState(e.target.value)} className="property-form-input">
          <option value="">Select State</option>
          {["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Telangana", "Gujarat", "Jharkhand", "Uttar Pradesh"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="property-form-input"/>
        <button type="submit" className="property-form-submit-btn">
          {id ? "Update" : "Create"} Property
        </button>
      </form>
    </div>
  );
}

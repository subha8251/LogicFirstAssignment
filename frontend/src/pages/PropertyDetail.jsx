import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./PropertyList.css";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const backUrl = searchParams.get("backUrl");

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/property/detail/${id}`);
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  return (
    <div className="property-detail-container p-6">
      <button
        onClick={() => navigate(backUrl ? decodeURIComponent(backUrl) : "/property")}
        className="property-detail-back-btn mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Back
      </button>

      {loading ? (
        <p className="property-detail-loading">Loading...</p>
      ) : property ? (
        <div className="property-detail-card">
          <h2 className="property-detail-title text-2xl font-bold mb-2">{property.title}</h2>
          <p className="property-detail-description mb-2">{property.description || "-"}</p>
          <div className="property-detail-info">
            <div><span className="property-detail-label">Type:</span> {property.type}</div>
            <div><span className="property-detail-label">City:</span> {property.location?.city}</div>
            <div><span className="property-detail-label">State:</span> {property.location?.state}</div>
            <div><span className="property-detail-label">Price:</span> ₹ {property.price?.toLocaleString('en-IN')}</div>
          </div>
        </div>
      ) : (
        <p className="property-detail-notfound">Property not found.</p>
      )}
    </div>
  );
}

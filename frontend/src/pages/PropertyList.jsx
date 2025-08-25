import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PropertyList.css";

export default function PropertyList() {
  const [props, setProps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const [cityFilter, setCityFilter] = useState("");
  console.log("cityFilter:", cityFilter);
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentBackUrl = () =>
    encodeURIComponent(location.pathname + location.search);

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    setPage(Number(search.get("page")) || 1);
    setCityFilter(search.get("city") || "");
    setStateFilter(search.get("state") || "");
    setTypeFilter(search.getAll("type[]") || []);
    setMinPrice(search.get("minPrice") || "");
    setMaxPrice(search.get("maxPrice") || "");
  }, [location.search]);

  const updateQuery = (key, value) => {
    const search = new URLSearchParams(location.search);
    if (!value || (Array.isArray(value) && value.length === 0))
      search.delete(key);
    else if (Array.isArray(value)) {
      search.delete(key);
      value.forEach((v) => search.append(key, v));
    } else search.set(key, value);

    if (key !== "page") search.set("page", "1");
    navigate({ search: search.toString() }, { replace: true });
  };

  const fetchData = async (signal) => {
    setLoading(true);
    try {
      const url = new URL("http://localhost:5000/api/property/grid");
      url.searchParams.append("page", page);
      url.searchParams.append("rows", rows);
      if (cityFilter) url.searchParams.append("location.city", cityFilter);
      if (stateFilter) url.searchParams.append("location.state", stateFilter);
      typeFilter.forEach((t) => url.searchParams.append("type[]", t));
      if (minPrice) url.searchParams.append("minprice", minPrice);
      if (maxPrice) url.searchParams.append("maxprice", maxPrice);

      const res = await fetch(url, { signal });
      const data = await res.json();
      setProps(data?.properties || []);
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [page, cityFilter, stateFilter, typeFilter, minPrice, maxPrice]);

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  const toggleType = (t) => {
    const arr = typeFilter.includes(t)
      ? typeFilter.filter((v) => v !== t)
      : [...typeFilter, t];
    setTypeFilter(arr);
    updateQuery("type[]", arr);
  };

  const handleCityChange = (value) => {
    setCityFilter(value);
    updateQuery("city", value);
  };
  const handleStateChange = (value) => {
    setStateFilter(value);
    updateQuery("state", value);
  };
  const handleMinPriceChange = (value) => {
    setMinPrice(value);
    updateQuery("minPrice", value);
  };
  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
    updateQuery("maxPrice", value);
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateQuery("page", newPage);
  };
  const clearFilters = () => {
    setCityFilter("");
    setStateFilter("");
    setTypeFilter([]);
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    navigate({ search: "" }, { replace: true });
  };

  const handleCreate = () =>
    navigate({
      pathname: "/property/create",
      search: `?backUrl=${getCurrentBackUrl()}`,
    });
  const handleView = (id) =>
    navigate({
      pathname: `/property/detail/${id}`,
      search: `?backUrl=${getCurrentBackUrl()}`,
    });
  const handleEdit = (id) =>
    navigate({
      pathname: `/property/edit/${id}`,
      search: `?backUrl=${getCurrentBackUrl()}`,
    });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    await fetch(`http://localhost:5000/api/property/delete/${id}`, {
      method: "DELETE",
    });
    setSelected((prev) => prev.filter((s) => s !== id));
    await fetchData();
    const search = new URLSearchParams(location.search);
    setPage(Number(search.get("page")) || 1);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.length} selected properties?`))
      return;
    await fetch(`http://localhost:5000/api/property/bulk-delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected }),
    });
    setSelected([]);
    await fetchData();
    const search = new URLSearchParams(location.search);
    setPage(Number(search.get("page")) || 1);
  };

  const uniqueCities = [
    ...new Set(props.map((p) => p.location?.city).filter(Boolean)),
  ].sort();
  const uniqueStates = [
    ...new Set(props.map((p) => p.location?.state).filter(Boolean)),
  ].sort();

  return (
    <div className="property-list-container">
      <div className="property-list-table-container">
        <div className="property-list-title">Property List</div>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleCreate}
            className="property-add-btn"
          >
            + Add Property
          </button>
          {selected.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="property-bulk-delete-btn"
            >
              Delete Selected ({selected.length})
            </button>
          )}

          <select
            value={cityFilter}
            onChange={(e) => handleCityChange(e.target.value)}
            className="property-filter-select"
          >
            <option value="">All Cities</option>
            {[
              "Delhi",
              "Mumbai",
              "Bengaluru",
              "Chennai",
              "Kolkata",
              "Hyderabad",
              "Pune",
              "Ahmedabad",
              "Jamshedpur",
              "Lucknow",
            ].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            {/* ))} */}
            {uniqueCities
              .filter(
                (c) =>
                  ![
                    "Delhi",
                    "Mumbai",
                    "Bengaluru",
                    "Chennai",
                    "Kolkata",
                    "Hyderabad",
                    "Pune",
                    "Ahmedabad",
                    "Jamshedpur",
                    "Lucknow",
                  ].includes(c)
              )
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          <select
            value={stateFilter}
            onChange={(e) => handleStateChange(e.target.value)}
            className="property-filter-select"
          >
            <option value="">All States</option>
            {[
              "Delhi",
              "Maharashtra",
              "Karnataka",
              "Tamil Nadu",
              "West Bengal",
              "Telangana",
              "Gujarat",
              "Jharkhand",
              "Uttar Pradesh",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            {uniqueStates
              .filter(
                (s) =>
                  ![
                    "Delhi",
                    "Maharashtra",
                    "Karnataka",
                    "Tamil Nadu",
                    "West Bengal",
                    "Telangana",
                    "Gujarat",
                    "Jharkhand",
                    "Uttar Pradesh",
                  ].includes(s)
              )
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>

          <div className="property-type-filter-group">
            {["pg", "flat", "house", "villa", "commercial"].map((t) => (
              <label key={t} className="property-type-filter-label">
                <input
                  type="checkbox"
                  value={t}
                  checked={typeFilter.includes(t)}
                  onChange={() => toggleType(t)}
                />{" "}
                {t.toUpperCase()}
              </label>
            ))}
          </div>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
            className="property-filter-input"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            className="property-filter-input"
          />

          {(cityFilter ||
            stateFilter ||
            typeFilter.length > 0 ||
            minPrice ||
            maxPrice) && (
            <button
              onClick={clearFilters}
              className="property-clear-filter-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg border bg-white w-full">
        <table className="property-list-table">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelected(e.target.checked ? props.map((p) => p._id) : [])
                  }
                  checked={selected.length === props.length && props.length > 0}
                />
              </th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">State</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : props.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-6">
                  No properties found.
                </td>
              </tr>
            ) : (
              props.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-gray-50 border-b last:border-none"
                >
                  <td className="p-3 border text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(p._id)}
                      onChange={() => toggleSelect(p._id)}
                    />
                  </td>
                  <td className="p-3 border font-semibold">{p.title}</td>
                  <td className="p-3 border">
                    {p.description?.length > 50
                      ? p.description.substring(0, 50) + "..."
                      : p.description || "-"}
                  </td>
                  <td className="p-3 border capitalize text-blue-600 font-medium">
                    {p.type}
                  </td>
                  <td className="p-3 border">{p.location?.city || "-"}</td>
                  <td className="p-3 border">{p.location?.state || "-"}</td>
                  <td className="p-3 border font-semibold text-green-700">
                    ₹ {p.price?.toLocaleString("en-IN") || 0}
                  </td>
                  <td className="p-3 border text-sm text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleView(p._id)}
                      className="property-action-btn view"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(p._id)}
                      className="property-action-btn edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="property-action-btn delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="property-pagination">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          className="property-pagination-btn"
        >
          Prev
        </button>
        <span className="property-pagination-info">Page {page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          className="property-pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}

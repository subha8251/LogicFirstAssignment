import axios from "axios";
import qs from "qs";

const api = axios.create({
  baseURL: "http://localhost:5000/api/property",
  paramsSerializer: params =>
    qs.stringify(params, { arrayFormat: "brackets" })
});

export const fetchGrid = (params) => api.get("/grid", { params });
export const fetchDetail = (id) => api.get(`/detail/${id}`);
export const createProperty = (data) => api.post("/create", data);
export const updateProperty = (id, data) => api.put(`/update/${id}`, data);
export const deleteProperty = (id) => api.delete(`/delete/${id}`);
export const bulkDelete = (ids) => api.delete("/bulk-delete", { data:{ ids } });

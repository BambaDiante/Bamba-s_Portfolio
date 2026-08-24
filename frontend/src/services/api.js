import axios from "axios";

const api = axios.create({
    baseURL: "https://bambadiante-backend.onrender.com/api",
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export default api;

export function getCsrfCookie() {
    return api.get("/sanctum/csrf-cookie");
}
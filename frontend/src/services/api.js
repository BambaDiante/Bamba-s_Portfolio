import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: `${apiUrl}/api`,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export default api;

export function getCsrfCookie() {
    return axios.get(`${apiUrl}/sanctum/csrf-cookie`, {
        withCredentials: true,
    });
}

export function login(email, password) {
    return api.post("/login", { email, password }).then((res) => res.data.user);
}

export function logout() {
    return api.post("/logout");
}
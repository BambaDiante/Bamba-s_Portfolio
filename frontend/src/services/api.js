import axios from "axios";

const api = axios.create({
    baseURL: "https://bambadiante-backend.onrender.com/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Attache automatiquement le token Bearer à chaque requête si présent
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Si le backend répond 401 (token invalide/expiré), on nettoie et redirige
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("auth_token");
            // redirige vers la page de login si besoin
            // window.location.href = "/admin/login";
        }
        return Promise.reject(error);
    }
);

export default api;

export function login(email, password) {
    return api.post("/login", { email, password }).then((res) => {
        localStorage.setItem("auth_token", res.data.token);
        return res.data.user;
    });
}

export function logout() {
    return api.post("/logout").finally(() => {
        localStorage.removeItem("auth_token");
    });
}
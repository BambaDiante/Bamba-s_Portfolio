import axios from "axios";

const api = axios.create({
    baseURL: "https://bambadiante-backend.onrender.com/api",
    withCredentials: true, // indispensable : envoie le cookie httpOnly à chaque requête
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export default api;

export function login(email, password) {
    return api.post("/login", { email, password }).then((res) => res.data.user);
}

export function logout() {
    return api.post("/logout");
}
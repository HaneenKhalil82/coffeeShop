
import axios from "axios"

const API_BASE_URL = "https://api.escuelajs.co/api/v1"

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Auth APIs
export const loginUser = (email, password) => {
  return api.post("/auth/login", { email, password })
}

export const registerUser = (name, email, password) => {
  return api.post("/users/", {
    name,
    email,
    password,
    avatar: "https://picsum.photos/800",
  })
}

export const getUserProfile = (token) => {
  return api.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Products APIs
export const getProducts = () => {
  return api.get("/products")
}

export async function getProductById(id) {
  return api.get(`/products/${id}`)
}

export const getCategories = () => {
  return api.get("/categories")
}

export const getCategoryProducts = (categoryId) => {
  return api.get(`/categories/${categoryId}/products`);
}

export const getProductRelated = (id) => {
  return api.get(`/products/${id}/related`)
}


import { createContext, useContext, useState, useEffect } from "react"
import { getUserProfile, loginUser, registerUser, logoutUser } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      console.log("🔍 API Response:", response.data); // Debug: see actual response
      const token = response.data.data?.token || response.data.token;
      console.log("🔑 Token found:", token);

      if (token) {
        console.log("✅ Token exists, fetching user profile...");
        try {
          // Get user profile after successful login
          const userResponse = await getUserProfile();
          console.log("👤 Profile Response:", userResponse.data);
          const userData = userResponse.data.data?.user || userResponse.data.user || userResponse.data;

          setToken(token)
          setUser(userData)

          localStorage.setItem("auth_token", token)
          localStorage.setItem("user", JSON.stringify(userData))

          console.log("💾 Login successful! Token and user saved");
          return { success: true, user: userData }
        } catch (profileError) {
          console.error("❌ Profile fetch failed:", profileError);
          // Try to login anyway with just the token
          const basicUser = response.data.data?.user || response.data.user || { email };
          
          setToken(token)
          setUser(basicUser)

          localStorage.setItem("auth_token", token)
          localStorage.setItem("user", JSON.stringify(basicUser))

          console.log("💾 Login successful with basic user data");
          return { success: true, user: basicUser }
        }
      } else {
        console.error("❌ No token found! Available fields:", Object.keys(response.data));
        if (response.data.data) {
          console.error("❌ Nested data fields:", Object.keys(response.data.data));
        }
        throw new Error("No token received from server")
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Login failed",
      }
    }
  }

  const register = async (userData) => {
    try {
      // Map the data to match API expected format
      const registrationData = {
        name: userData.name,
        email: userData.email,
        mobile: userData.phone || userData.mobile,
        password: userData.password,
        password_confirmation: userData.password_confirmation || userData.password
      };

      const response = await registerUser(registrationData);
      
      // Some APIs return user data immediately, others require login after registration
      if (response.data.access_token || response.data.token) {
        // Auto-login after registration
        const token = response.data.access_token || response.data.token;
        const userData = response.data.user || response.data;
        
        setToken(token)
        setUser(userData)
        
        localStorage.setItem("auth_token", token)
        localStorage.setItem("user", JSON.stringify(userData))
      }

      return { success: true, data: response.data }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Registration failed",
      }
    }
  }

  const logout = async () => {
    try {
      // Call logout API to invalidate token on server
      await logoutUser();
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local state and storage
      setUser(null)
      setToken(null)
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      
      // Clear all cart-related data
      localStorage.removeItem("cart")
      localStorage.removeItem("coffee-cart")
      
      // Clear user-specific cart data (cleanup for any existing user carts)
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('coffee-cart-')) {
          localStorage.removeItem(key)
        }
      })
    }
  }

  const updateProfile = async () => {
    try {
      const response = await getUserProfile();
      const updatedUser = response.data.user || response.data;
      
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Profile update failed",
      };
    }
  }

  const refreshUserData = async () => {
    try {
      if (token) {
        const response = await getUserProfile();
        const userData = response.data.user || response.data;
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        return userData;
      }
    } catch (error) {
      console.error("Refresh user data error:", error);
      // If token is invalid, logout user
      if (error.response?.status === 401) {
        logout();
      }
    }
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    refreshUserData,
    isAuthenticated: !!token,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useRTL } from "../App";

const loginSchema = z.object({
  email: z
    .string()
    .min(6, "Email is too short")
    .max(50, "Email is too long")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/\d/, "Password must contain at least one number"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { isArabic } = useRTL();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);

    if (result.success) {
      toast.success(isArabic ? "تم تسجيل الدخول بنجاح" : "Login successful", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error(
        result.error ||
          (isArabic ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password"),
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }
  };

  return (
 <div
       dir={isArabic ? "rtl" : "ltr"}
       className="min-h-screen flex items-center justify-center bg-cover bg-center "
       style={{ backgroundImage: `url("/images/cover2.png")` }}
     >
    <div className="animate-slideInUp m-40 mt-30 flex flex-row w-full max-w-4xl bg-[#252525] text-white rounded-2xl shadow-lg overflow-hidden ">
      <div className="w-1/2 p-8">
       <div className="text-center mb-8">
            <Link to="/" className="block">
              <img
                src="/images/Group.svg"
                alt="لوجو"
                className="h-10 w-90 mx-auto"
              />
            </Link>

            <p className="text-3xl text-gray-300">
              {isArabic ? "مرحبًا بعودتك" : "Welcome Back"}
            </p>
            <p className="text-gray-300 mt-2">
              {isArabic ? "سجّل دخولك إلى حسابك" : "Log in to your account"}
            </p>
          </div>


        <form
           onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            dir={isArabic ? "rtl" : "ltr"}
            >
               {/* Email Field */}
            <div>
             <label className={`block text-sm font-medium mb-2 ${isArabic ? "text-left" : "text-right"} text-gray-300 mb-2`}>
    
              {isArabic ? "البريد الإلكتروني"  : "Email"}
             </label>
             <div className="relative">
               <Mail
               className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`}
               size={20}
              />
               <input
                {...register("email")}
                  type="email"
                  className={`w-full bg-[#3B3737] py-3 rounded-lg ${
                  isArabic ? "pr-10 pl-4 text-left" : "pl-10 pr-4 text-right"
                    }`}
                   placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                  />

                 </div>
                 {errors.email && (
                 <p className="text-gray-400 text-sm mt-1">{errors.email.message}</p>
                  )}
             </div>

          {/* Password Field */}
  <div>
    <label className={`block text-sm font-medium text-gray-300 ${isArabic ? "text-left" : "text-right"} mb-2`}>
      {isArabic ? "كلمة المرور" : "Password"}
    </label>
    <div className="relative">
      <Lock
        className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`}
        size={20}
      />
     <input
  {...register("password")}
  type={showPassword ? "text" : "password"}
  className={`w-full bg-[#3B3737] py-3 rounded-lg ${
    isArabic ? "pr-10 pl-4 text-left" : "pl-10 pr-4 text-right"
  }`}
  placeholder={isArabic ? "أدخل كلمة المرور" : "Enter your password"}
/>

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isArabic ? "left-3" : "right-3"}`}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    {errors.password && (
      <p className="text-gray-400 text-sm mt-1">{errors.password.message}</p>
    )}
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={isSubmitting}
    className="mx-auto block w-1/2 py-3 bg-[#ECEAEA] text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
  >
    {isSubmitting
      ? isArabic
        ? "جاري تسجيل الدخول..."
        : "Logging in..."
      : isArabic
      ? "تسجيل الدخول"
      : "Login"}
  </button>
</form>
        <div className="text-center mt-6">
            <p className="text-gray-300">
              {isArabic ? "ليس لديك حساب؟" : "Don't have an account?"} {" "}
              <Link
                to="/signup"
                className="text-gray-100 hover:text-gray-600 font-semibold"
              >
                {isArabic ? "أنشئ حساب الآن" : "Create one now"}
              </Link>
            </p>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center bg-white">
          <img
            src="/images/img10.png"
            alt={isArabic ? "صورة تسجيل الدخول" : "Login Illustration"}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

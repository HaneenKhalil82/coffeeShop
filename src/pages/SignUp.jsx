import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useRTL } from "../App";
import { toast } from "react-toastify";

const signUpSchema = z.object({
  name: z
    .string()
    .min(1, "الاسم مطلوب")
    .min(4, "يجب أن يكون الاسم 4 أحرف على الأقل")
    .max(50, "يجب أن يكون الاسم أقل من 50 حرف")
    .refine((val) => /^[\u0600-\u06FF\sA-Za-z]+$/.test(val), {
      message: "يجب أن يحتوي الاسم على أحرف ومسافات فقط",
    })
    .refine((val) => val.trim().split(" ").length >= 2, {
      message: "يجب أن يحتوي الاسم على كلمتين على الأقل",
    })
    .refine((val) => val.trim().length > 0, {
      message: "لا يمكن أن يكون الاسم فارغاً",
    }),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .min(6, "البريد الإلكتروني قصير جداً")
    .max(50, "البريد الإلكتروني طويل جداً")
    .email("يرجى إدخال بريد إلكتروني صحيح")
    .refine((val) => val.trim().length > 0, {
      message: "لا يمكن أن يكون البريد الإلكتروني فارغاً",
    }),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .refine((val) => {
      const onlyDigits = /^\+?\d+$/.test(val);
      const isEgyptian = /^01[0125][0-9]{8}$/.test(val);
      const isInternational = /^\+?[1-9]\d{7,14}$/.test(val);
      return onlyDigits && (isEgyptian || isInternational);
    }, {
      message: "يرجى إدخال رقم هاتف صحيح (مصري: 01XXXXXXXXX أو دولي: +XXXXXXXXXXX)",
    })
    .refine((val) => val.trim().length > 0, {
      message: "لا يمكن أن يكون رقم الهاتف فارغاً",
    }),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .max(50, "يجب أن تكون كلمة المرور أقل من 50 حرف")
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: "يجب أن تحتوي كلمة المرور على حرف واحد على الأقل",
    })
    .refine((val) => /\d/.test(val), {
      message: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل",
    })
    .refine((val) => val.trim().length > 0, {
      message: "لا يمكن أن تكون كلمة المرور فارغة",
    }),
  password_confirmation: z
    .string()
    .min(1, "تأكيد كلمة المرور مطلوب")
    .min(8, "يجب أن يكون تأكيد كلمة المرور 8 أحرف على الأقل")
    .refine((val) => val.trim().length > 0, {
      message: "لا يمكن أن يكون تأكيد كلمة المرور فارغاً",
    })
}).refine((data) => data.password === data.password_confirmation, {
  message: "كلمات المرور غير متطابقة",
  path: ["password_confirmation"],
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isAuthenticated } = useAuth();
  const { isArabic } = useRTL();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange", // Enable real-time validation
  });

  // Watch password for real-time confirmation validation
  const password = watch("password");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Real-time password confirmation validation
  useEffect(() => {
    const passwordConfirmation = watch("password_confirmation");
    if (passwordConfirmation && password !== passwordConfirmation) {
      setError("password_confirmation", {
        type: "manual",
        message: "كلمات المرور غير متطابقة",
      });
    } else if (passwordConfirmation && password === passwordConfirmation) {
      clearErrors("password_confirmation");
    }
  }, [password, watch, setError, clearErrors]);

  const onSubmit = async (data) => {
    try {
      // Show loading toast in Arabic
      const loadingToast = toast.loading(
        "جاري إنشاء الحساب...",
        {
          position: "top-right",
        }
      );

      // Pass the complete data object to register function
      const result = await registerUser(data);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(
          "تم إنشاء الحساب بنجاح! مرحباً بك في مجتمع القهوة",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        // Check if user was auto-logged in after registration
        if (result.data?.access_token || result.data?.token) {
          // User is auto-logged in, useEffect will handle redirect to home
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 2000);
        } else {
          // User needs to login manually, redirect to login page
          setTimeout(() => {
            toast.info(
              "يرجى تسجيل الدخول الآن",
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
            navigate("/login", { replace: true });
          }, 2000);
        }
      } else {
        console.log("Register error:", result); 
        // Handle different types of errors in Arabic
        let errorMessage = result.error;
        
        if (result.error?.includes("email")) {
          errorMessage = "البريد الإلكتروني مستخدم بالفعل";
        } else if (result.error?.includes("phone")) {
          errorMessage = "رقم الهاتف مستخدم بالفعل";
        } else if (result.error?.includes("network")) {
          errorMessage = "خطأ في الاتصال بالخادم";
        } else {
          // Default error message in Arabic
          errorMessage = "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى";
        }

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch {
      toast.error(
        "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url("/images/cover2.png")` }}
    >
      <div className="animate-slideInUp m-4 sm:m-10 md:m-20 lg:m-40 flex flex-col lg:flex-row w-full max-w-5xl bg-[#252525] text-white rounded-2xl shadow-lg overflow-hidden bg-opacity-90">
        {/* Form section */}
        <div className="w-full lg:w-1/2 p-5 sm:p-8">
          <div className="text-center mb-6">
            <Link to="/" className="block mb-1">
            </Link>
            <p className="text-3xl text-gray-300 font-bold">
              {isArabic ? "إنشاء حساب" : "Create Account"}
            </p>
            <p className="text-gray-400 mt-2">
              {isArabic ? "انضم إلى مجتمع عشاق القهوة" : "Join our coffee lovers community"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className={`block text-sm font-medium text-gray-300 ${isArabic ? "text-left" : "text-right"} mb-2`}>
                {isArabic ? "الاسم الكامل" : "Full Name"} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`} size={20} />
                <input
                  {...register("name")}
                  type="text"
                  className={`w-full bg-[#3B3737] py-3 px-12 rounded-lg border transition-colors ${
                    errors.name 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-transparent focus:border-gray-400"
                  } ${isArabic ? "text-left" : "text-right"}`}
                  placeholder={isArabic ? "أدخل اسمك الكامل" : "Enter your full name"}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium text-gray-300 ${isArabic ? "text-left" : "text-right"} mb-2`}>
                {isArabic ? "البريد الإلكتروني" : "Email"} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`} size={20} />
                <input
                  {...register("email")}
                  type="email"
                  className={`w-full bg-[#3B3737] py-3 px-12 rounded-lg border transition-colors ${
                    errors.email 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-transparent focus:border-gray-400"
                  } ${isArabic ? "text-left" : "text-right"}`}
                  placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-medium text-gray-300 ${isArabic ? "text-left" : "text-right"} mb-2`}>
                {isArabic ? "رقم الهاتف" : "Phone Number"} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`} size={20} />
                <input
                  {...register("phone")}
                  type="text"
                  className={`w-full bg-[#3B3737] py-3 px-12 rounded-lg border transition-colors ${
                    errors.phone 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-transparent focus:border-gray-400"
                  } ${isArabic ? "text-left" : "text-right"}`}
                  placeholder={isArabic ? "أدخل رقم الهاتف" : "Enter your phone number"}
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium text-gray-300 ${isArabic ? "text-left" : "text-right"} mb-2`}>
                {isArabic ? "كلمة المرور" : "Password"} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`} size={20} />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`w-full bg-[#3B3737] py-3 px-12 rounded-lg border transition-colors ${
                    errors.password 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-transparent focus:border-gray-400"
                  } ${isArabic ? "text-left" : "text-right"}`}
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
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.password.message}
                </p>
              )}
              {/* Password strength indicator */}
              {password && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    <div className={`h-1 flex-1 rounded ${
                      password.length >= 8 ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <div className={`h-1 flex-1 rounded ${
                      /[a-zA-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <div className={`h-1 flex-1 rounded ${
                      /\d/.test(password) ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <div className={`h-1 flex-1 rounded ${
                      /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {isArabic ? "قوة كلمة المرور" : "Password strength"}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-medium text-gray-300 ${isArabic ? "text-left" : "text-right"} mb-2`}>
                {isArabic ? "تأكيد كلمة المرور" : "Confirm Password"} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`} size={20} />
                <input
                  {...register("password_confirmation")}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full bg-[#3B3737] py-3 px-12 rounded-lg border transition-colors ${
                    errors.password_confirmation 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-transparent focus:border-gray-400"
                  } ${isArabic ? "text-left" : "text-right"}`}
                  placeholder={isArabic ? "أعد إدخال كلمة المرور" : "Confirm your password"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isArabic ? "left-3" : "right-3"}`}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#ECEAEA] text-black font-semibold rounded-full transition-all duration-300 hover:bg-[#d8d8d8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isArabic ? "جاري إنشاء الحساب..." : "Creating account...") : (isArabic ? "إنشاء حساب" : "Sign Up")}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-300">
              {isArabic ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
              <Link to="/login" className="text-gray-100 hover:text-gray-600 font-semibold transition-colors">
                {isArabic ? "سجل الدخول" : "Login"}
              </Link>
            </p>
          </div>
        </div>

        {/* Image section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <img
            src="/images/img10.png"
            alt="sign up"
            className="w-full h-full object-cover p-4"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;


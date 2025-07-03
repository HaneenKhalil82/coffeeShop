// import { useState, useEffect } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { useAuth } from "../contexts/AuthContext"
// import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
// // import {img10}  from "../assets/images/img10.png"
// // import { cover2 } from "../assets/images/cover2.png"

// // import { Group } from "../assets/icons/Group.svg";






// const signUpSchema = z.object({
//  name: z
//     .string()
//     .min(4, "Name must be at least 4 characters")
//     .refine((val) => /^[A-Za-z\s]+$/.test(val), {
//       message: "Name must contain only letters and spaces",
//     })
//     .refine((val) => val.trim().split(" ").length >= 2, {
//       message: "Name must contain at least two words",
//     }),

//   email: z.
//   string()
//   .min(6, "Email is too short")
//   .max(50, "Email is too long")
//   .email("Please enter a valid email address")
//   .refine((email) => email.endsWith("@gmail.com"), {
//   message: "Only Gmail accounts are allowed",
// }),

//   password: z
//     .string()
//     .min(6, "Password must be at least 6 characters")
//     .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
//       message: "Password must contain both letters and numbers",
//     }),
// })

// const SignUp = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const [signUpError, setSignUpError] = useState("")
//   const [signUpSuccess, setSignUpSuccess] = useState(false)
//   const { register: registerUser, isAuthenticated } = useAuth()
//   const navigate = useNavigate()

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(signUpSchema),
//   })

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/products")
//     }
//   }, [isAuthenticated, navigate])

//   const onSubmit = async (data) => {
//     setSignUpError("")
//     setSignUpSuccess(false)

//     const result = await registerUser(data.name, data.email, data.password)

//     if (result.success) {
//       setSignUpSuccess(true)
//       setTimeout(() => {
//         navigate("/login")
//       }, 2000)
//     } else {
//       setSignUpError(result.error)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url("/images/cover2.png")` }}
// >

//       <div className="animate-slideInUp flex flex-row-reverse w-full max-w-4xl bg-[#252525] text-white rounded-2xl shadow-lg overflow-hidden  bg-opacity-9">
//         <div className="w-1/2 p-8 ">
//           <div className="text-center mb-8">

//              <Link to="/" className="block">
//                            <img src="/images/Group.svg"
//                             alt="Blue Berry Logo"
//                             className="h-10 w-60 mx-auto"
                        
//                            />
//                           </Link>
            
//             <p className="text-3xl text-gray-300">Create Account</p>
            
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {signUpError && (
//               <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">{signUpError}</div>
//             )}

//             {signUpSuccess && (
//               <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
//                 Account created successfully!
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   {...register("name")}
//                   type="text"
//                   className="w-full bg-[#3B3737] pl-10 pr-4 py-3  rounded-xl "
//                   placeholder="Enter your full name"
//                 />
//               </div>
//               {errors.name && <p className="text-gray-400 text-sm mt-1">{errors.name.message}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   {...register("email")}
//                   type="email"
//                   className="w-full bg-[#3B3737] pl-10 pr-4 py-3  rounded-xl "
//                   placeholder="Enter your email"
//                 />
//               </div>
//               {errors.email && <p className="text-gray-400 text-sm mt-1">{errors.email.message}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   {...register("password")}
//                   type={showPassword ? "text" : "password"}
//                   className="w-full bg-[#3B3737] pl-10 pr-12 py-3 rounded-xl "
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {errors.password && <p className="text-gray-400 text-sm mt-1">{errors.password.message}</p>}
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="mx-20 w-1/2 py-3 bg-[#ECEAEA] text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
//             >
//               {isSubmitting ? "Creating Account..." : "Create Account"}
//             </button>
//           </form>

//           <div className="text-center mt-6">
//             <p className="text-gray-300">
//               Already have an account?{" "}
//               <Link to="/login" className="text-gray-100 hover:text-gray-600 font-semibold">
//                 Sign in here
//               </Link>
//             </p>
//           </div>
//         </div>


//         <div className="w-1/2 flex items-center justify-center bg-white">
//           <img
//             src="/images/img10.png"
//             alt="Login Illustration"
//             className="w-full h-full object-contain"
//           />
//         </div>
//       </div>
//     </div>

//   );
// }

// export default SignUp





// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useAuth } from "../contexts/AuthContext";
// import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

// const signUpSchema = z.object({
//   name: z
//     .string()
//     .min(4, "الاسم يجب أن يحتوي على 4 حروف على الأقل")
//     .refine((val) => /^[\u0600-\u06FF\sA-Za-z]+$/.test(val), {
//       message: "الاسم يجب أن يحتوي على حروف ومسافات فقط",
//     })
//     .refine((val) => val.trim().split(" ").length >= 2, {
//       message: "الاسم يجب أن يحتوي على كلمتين على الأقل",
//     }),

//   email: z
//     .string()
//     .min(6, "البريد الإلكتروني قصير جدًا")
//     .max(50, "البريد الإلكتروني طويل جدًا")
//     .email("من فضلك أدخل بريد إلكتروني صحيح"),
    

// phone: z
//   .string()
//   .refine((val) => {
//     // ✅ فقط أرقام أو تبدأ بـ +
//     const onlyDigits = /^\+?\d+$/.test(val);

//     // ✅ رقم مصري (11 رقم ويبدأ بـ 01)
//     const isEgyptian = /^01[0125][0-9]{8}$/.test(val);

//     // ✅ رقم دولي: يبدأ بـ + ويكون طوله بين 8 و15 رقم
//     const isInternational = /^\+?[1-9]\d{7,14}$/.test(val);

//     return onlyDigits && (isEgyptian || isInternational);
//   }, {
//     message: "الرجاء إدخال رقم هاتف صحيح بدون حروف أو رموز خاصة",
//   }),



//   password: z
//     .string()
//     .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف")
//     .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
//       message: "كلمة المرور يجب أن تحتوي على حروف وأرقام",
//     }),
// });

// const SignUp = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [signUpError, setSignUpError] = useState("");
//   const [signUpSuccess, setSignUpSuccess] = useState(false);
//   const { register: registerUser, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(signUpSchema),
//   });

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/products");
//     }
//   }, [isAuthenticated, navigate]);

//   const onSubmit = async (data) => {
//     setSignUpError("");
//     setSignUpSuccess(false);

//     const result = await registerUser(data.name, data.email, data.password);

//     if (result.success) {
//       setSignUpSuccess(true);
//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } else {
//       setSignUpError(result.error);
//     }
//   };

//   return (
//     <div
//       dir="rtl"
//       className="min-h-screen flex items-center justify-center bg-cover bg-center"
//       style={{ backgroundImage: `url("/images/cover2.png")` }}
//     >
//       <div className="animate-slideInUp flex flex-row w-full max-w-5xl bg-[#252525] text-white rounded-2xl shadow-lg overflow-hidden bg-opacity-90">
//         {/* الصورة الجانبية */}
//         <div className="w-1/2 flex items-center justify-center bg-white">
//           <img
//             src="/images/img10.png"
//             alt="تسجيل"
//             className="w-full h-full object-contain"
//           />
//         </div>

//         {/* نموذج التسجيل */}
//         <div className="w-1/2 p-5">
//           <div className="text-center mb-3">
//             <Link to="/" className="block mb-1">
//               <img
//                 src="/images/Group.svg"
//                 alt="شعار"
//                 className="h-10 w-60 mx-auto"
//               />
//             </Link>
//             <p className="text-3xl text-gray-300 font-bold">إنشاء حساب</p>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {signUpError && (
//               <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
//                 {signUpError}
//               </div>
//             )}

//             {signUpSuccess && (
//               <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
//                 تم إنشاء الحساب بنجاح!
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 الاسم الكامل
//               </label>
//               <div className="relative">
//                 <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   {...register("name")}
//                   type="text"
//                 //   className="w-full bg-[#3B3737] pr-10 pl-4 py-3 rounded-xl"
//                 className="w-full bg-[#3B3737] pl-4 pr-10 py-3  rounded-lg  "
//                   placeholder="أدخل اسمك الكامل"
//                 />
//               </div>
//               {errors.name && (
//                 <p className="text-gray-400 text-sm mt-1">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 البريد الإلكتروني
//               </label>
//               <div className="relative">
//                 <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   {...register("email")}
//                   type="email"
//                   className="w-full bg-[#3B3737] pl-4 pr-10 py-3  rounded-lg  "
//                   placeholder="أدخل بريدك الإلكتروني"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-gray-400 text-sm mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>


//               <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 رقم الهاتف
//               </label>
//               <div className="relative">
//                 <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   {...register("phone")}
//                   type="text"
//                 //   className="w-full bg-[#3B3737] pr-10 pl-4 py-3 rounded-xl"
//                 className="w-full bg-[#3B3737] pl-4 pr-10 py-3  rounded-lg  "
//                   placeholder="أدخل رقم الهاتف"
//                 />
//               </div>
//               {errors.phone && (
//                 <p className="text-gray-400 text-sm mt-1">
//                   {errors.phone.message}
//                 </p>
//               )}
//             </div>



//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 كلمة المرور
//               </label>
//               <div className="relative">
//                 <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   {...register("password")}
//                   type={showPassword ? "text" : "password"}
//                   className="w-full bg-[#3B3737] pl-4 pr-10 py-3  rounded-lg  "
//                   placeholder="أدخل كلمة المرور"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-gray-400 text-sm mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full py-3 bg-[#ECEAEA] text-black font-semibold rounded-full transition-all duration-300 hover:bg-[#d8d8d8]"
//             >
//               {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
//             </button>
//           </form>

//           <div className="text-center mt-6">
//             <p className="text-gray-300">
//               لديك حساب بالفعل؟{" "}
//               <Link to="/login" className="text-gray-100 hover:text-gray-600 font-semibold">
//                 سجل الدخول
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;









import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useRTL } from "../App";

const signUpSchema = z.object({
  name: z
    .string()
    .min(4, "الاسم يجب أن يحتوي على 4 حروف على الأقل")
    .refine((val) => /^[\u0600-\u06FF\sA-Za-z]+$/.test(val), {
      message: "الاسم يجب أن يحتوي على حروف ومسافات فقط",
    })
    .refine((val) => val.trim().split(" ").length >= 2, {
      message: "الاسم يجب أن يحتوي على كلمتين على الأقل",
    }),
  email: z
    .string()
    .min(6, "البريد الإلكتروني قصير جدًا")
    .max(50, "البريد الإلكتروني طويل جدًا")
    .email("من فضلك أدخل بريد إلكتروني صحيح"),
  phone: z
    .string()
    .refine((val) => {
      const onlyDigits = /^\+?\d+$/.test(val);
      const isEgyptian = /^01[0125][0-9]{8}$/.test(val);
      const isInternational = /^\+?[1-9]\d{7,14}$/.test(val);
      return onlyDigits && (isEgyptian || isInternational);
    }, {
      message: "الرجاء إدخال رقم هاتف صحيح بدون حروف أو رموز خاصة",
    }),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف")
    .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
      message: "كلمة المرور يجب أن تحتوي على حروف وأرقام",
    }),
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const { register: registerUser, isAuthenticated } = useAuth();
  const { isArabic } = useRTL();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setSignUpError("");
    setSignUpSuccess(false);
    const result = await registerUser(data.name, data.email, data.password);
    if (result.success) {
      setSignUpSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setSignUpError(result.error);
    }
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url("/images/cover2.png")` }}
    >
      <div className="animate-slideInUp flex flex-row w-full max-w-5xl bg-[#252525] text-white rounded-2xl shadow-lg overflow-hidden bg-opacity-90">
        <div className="w-1/2 flex items-center justify-center bg-white">
          <img src="/images/img10.png" alt="sign up" className="w-full h-full object-contain" />
        </div>

        <div className="w-1/2 p-5">
          <div className="text-center mb-3">
            <Link to="/" className="block mb-1">
              <img src="/images/Group.svg" alt="logo" className="h-10 w-60 mx-auto" />
            </Link>
            <p className="text-3xl text-gray-300 font-bold">
              {isArabic ? "إنشاء حساب" : "Create Account"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {signUpError && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {signUpError}
              </div>
            )}

            {signUpSuccess && (
              <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
                {isArabic ? "تم إنشاء الحساب بنجاح!" : "Account created successfully!"}
              </div>
            )}

            {/* Name */}
            <div>
              <label className={`block text-sm font-medium text-gray-300 ${isArabic ? "text-left" : "text-right"} mb-2`}>
                {isArabic ? "الاسم الكامل" : "Full Name"}
              </label>
              <div className="relative">
                <User className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`} size={20} />
                <input
                  {...register("name")}
                  type="text"
                  className={`w-full bg-[#3B3737] py-3 px-12 rounded-lg ${isArabic ? "text-left" : "text-right"}`}
                  placeholder={isArabic ? "أدخل اسمك الكامل" : "Enter your full name"}
                />
              </div>
              {errors.name && <p className="text-gray-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium text-gray-300 ${isArabic ? "text-left" : "text-right"} mb-2`}>
                {isArabic ? "البريد الإلكتروني" : "Email"}
              </label>
              <div className="relative">
                <Mail className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`} size={20} />
                <input
                  {...register("email")}
                  type="email"
                  className={`w-full bg-[#3B3737] py-3 px-12 rounded-lg ${isArabic ? "text-left" : "text-right"}`}
                  placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                />
              </div>
              {errors.email && <p className="text-gray-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-medium text-gray-300 ${isArabic ? "text-left" : "text-right"} mb-2`}>
                {isArabic ? "رقم الهاتف" : "Phone Number"}
              </label>
              <div className="relative">
                <Phone className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`} size={20} />
                <input
                  {...register("phone")}
                  type="text"
                  className={`w-full bg-[#3B3737] py-3 px-12 rounded-lg ${isArabic ? "text-left" : "text-right"}`}
                  placeholder={isArabic ? "أدخل رقم الهاتف" : "Enter your phone number"}
                />
              </div>
              {errors.phone && <p className="text-gray-400 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium text-gray-300 ${isArabic ? "text-left" : "text-right"} mb-2`}>
                {isArabic ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`} size={20} />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`w-full bg-[#3B3737] py-3 px-12 rounded-lg ${isArabic ? "text-left" : "text-right"}`}
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
              {errors.password && <p className="text-gray-400 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#ECEAEA] text-black font-semibold rounded-full transition-all duration-300 hover:bg-[#d8d8d8]"
            >
              {isSubmitting ? (isArabic ? "جاري إنشاء الحساب..." : "Creating account...") : (isArabic ? "إنشاء حساب" : "Sign Up")}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-300">
              {isArabic ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
              <Link to="/login" className="text-gray-100 hover:text-gray-600 font-semibold">
                {isArabic ? "سجل الدخول" : "Login"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

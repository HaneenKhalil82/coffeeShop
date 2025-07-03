// import { useState, useEffect } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { useAuth } from "../contexts/AuthContext"
// import { Eye, EyeOff, Mail, Lock } from "lucide-react"
// import { toast } from "react-toastify"
// // import {img10}  from "../assets/images/img10.png"
// // import { cover2 } from "../assets/images/cover2.png"

// // import { Group } from "../assets/icons/Group.svg";

// const loginSchema = z.object({
//     email: z.
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
//     .regex(/\d/, "Password must contain at least one number"),
// })

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const { login, isAuthenticated } = useAuth()
//   const navigate = useNavigate()

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   })

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/")
//     }
//   }, [isAuthenticated, navigate])

//   const onSubmit = async (data) => {
//     const result = await login(data.email, data.password)

//     if (result.success) {
//       toast.success("Login successful!", {
//         position: "top-right",
//         autoClose: 3000,
//       })
//       setTimeout(() => {
//         navigate("/")
//       }, 1000)
//     } else {
//       toast.error(result.error || "Invalid email or password", {
//         position: "top-right",
//         autoClose: 5000,
//       })
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url("/images/cover2.png")` }}
// >
      
//       <div className="animate-slideInUp flex flex-row-reverse w-full max-w-4xl bg-[#252525] text-white rounded-2xl shadow-lg overflow-hidden  bg-opacity-9">


//         <div className="w-1/2 p-8">
//           <div className="text-center mb-8">
            
//               <Link to="/" className="block">
//                <img src="/images/Group.svg" 
//                 alt="Blue Berry Logo"
//                 className="h-10 w-90 mx-auto"
            
//                />
//               </Link>
            

//             <p className="text-3xl  text-gray-300">Welcome Back</p>
//             <p className="text-gray-300 mt-2"> Sign in to your account</p>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
//             <div>
//               <label className="block  text-sm font-medium text-gray-300 mb-2">Email Address</label>
//               <div className="relative">
//                 <Mail className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   {...register("email")}
//                   type="email"
//                   className="w-full bg-[#3B3737] pl-10 pr-4 py-3  rounded-lg  "
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
//                   className="w-full bg-[#3B3737] pl-10 pr-12 py-3  rounded-lg "
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
//               className="mx-25 w-1/2 py-3 bg-[#ECEAEA] text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105"

//             >
//               {isSubmitting ? "Signing In..." : "Sign In"}
//             </button>
//           </form>

//           <div className="text-center mt-6">
//             <p className="text-gray-300">
//               Don't have an account?{" "}
//               <Link to="/signup" className="text-gray-100 hover:text-gray-600 font-semibold">
//                 Sign up here
//               </Link>
//             </p>
//           </div>
//         </div>


//         <div className="w-1/2 flex items-center justify-center bg-white">
//           <img src="/images/img10.png" alt="Logo" 
//              className="w-full h-full object-contain" />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login



import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";

const loginSchema = z.object({
  email: z
    .string()
    .min(6, "البريد الإلكتروني قصير جدًا")
    .max(50, "البريد الإلكتروني طويل جدًا")
    .email("من فضلك أدخل بريد إلكتروني صحيح")
    .refine((email) => email.endsWith("@gmail.com"), {
      message: "يُسمح فقط بحسابات Gmail",
    }),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل")
    .regex(/\d/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
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
      toast.success("تم تسجيل الدخول بنجاح", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error(result.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url("/images/cover2.png")` }}
    >
      <div className="animate-slideInUp flex flex-row w-full max-w-4xl bg-[#252525] text-white rounded-2xl shadow-lg overflow-hidden bg-opacity-90">
        <div className="w-1/2 p-8">
          <div className="text-center mb-8">
            <Link to="/" className="block">
              <img
                src="/images/Group.svg"
                alt="لوجو"
                className="h-10 w-90 mx-auto"
              />
            </Link>

            <p className="text-3xl text-gray-300">مرحبًا بعودتك</p>
            <p className="text-gray-300 mt-2">سجّل دخولك إلى حسابك</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  {...register("email")}
                  type="email"
                  className="w-full bg-[#3B3737] pr-10 pl-4 py-3 rounded-lg"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
              {errors.email && (
                <p className="text-gray-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-[#3B3737] pr-10 pl-12 py-3 rounded-lg"
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-gray-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mx-auto block w-1/2 py-3 bg-[#ECEAEA] text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-300">
              ليس لديك حساب؟{" "}
              <Link
                to="/signup"
                className="text-gray-100 hover:text-gray-600 font-semibold"
              >
                أنشئ حساب الآن
              </Link>
            </p>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center bg-white">
          <img
            src="/images/img10.png"
            alt="صورة تسجيل الدخول"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;


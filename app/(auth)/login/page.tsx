"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PiggyBank } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Đăng nhập thất bại");
      }

      const data = await response.json();

      // Chuyển đổi permissions object thành mảng string
      const permsObj = data.user.permissions || {};
      const permissions = Object.keys(permsObj).filter(key => permsObj[key] === true);

      // Lưu thông tin đăng nhập vào store
      login(data.user, data.accessToken, permissions);
      console.log(permissions);
      router.push("/barns");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-gray-50">
      {/* --- CỘT BÊN TRÁI: Dành cho Desktop --- */}
      <div className="hidden lg:flex w-[40%] xl:w-[45%] bg-[#5da68a] items-center justify-center relative overflow-hidden">
        {/* Họa tiết Pattern Pig Farm chìm (Sử dụng SVG Pattern) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="farm-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="white" />
                <path d="M20 20h10v10H20z" fill="white" fillOpacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#farm-pattern)" />
          </svg>
        </div>

        {/* Nội dung Catchphrase */}
        <div className="relative z-10 text-white p-12 text-center">
          <div className="mb-8 inline-block p-4 bg-white/10 rounded-full backdrop-blur-sm">
            {/* Icon Pig đơn giản bằng SVG */}
            {/* <svg viewBox="0 0 24 24" className="w-16 h-16 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2Zm0,18c-4.41,0-8-3.59-8-8s3.59-8,8-8,8,3.59,8,8-3.59,8-8,8Zm-3-9c.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5-1.5,.67-1.5,1.5,.67,1.5,1.5,1.5Zm6,0c.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5-1.5,.67-1.5,1.5,.67,1.5,1.5,1.5Zm-3,4c-1.66,0-3,1.34-3,3h6c0-1.66-1.34-3-3-3Z"/>
            </svg> */}
            <PiggyBank size={60}/>
          </div>
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">VIETAPIG</h2>
          <p className="text-xl font-light opacity-90 max-w-md mx-auto leading-relaxed">
            "Số hóa chăn nuôi - Nâng tầm giá trị nông sản Việt"
          </p>
          {/* <div className="mt-10 grid grid-cols-2 gap-4 text-xs font-medium uppercase tracking-widest opacity-70">
            <div className="border border-white/30 rounded-lg py-2">Quản lý giống</div>
            <div className="border border-white/30 rounded-lg py-2">Theo dõi tăng trưởng</div>
          </div> */}
        </div>

        {/* Trang trí góc */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* --- CỘT BÊN PHẢI: Form Đăng nhập --- */}
      <div className="flex w-full lg:w-[60%] xl:w-[55%] items-center justify-center px-6 sm:px-12 lg:px-20 bg-white">
        <div className="w-full max-w-[440px]">
          {/* Logo hiển thị trên mobile */}
          <div className="lg:hidden text-center mb-8">
             <h1 className="text-4xl font-black text-[#5da68a] tracking-tighter">VIETAPIG</h1>
             <p className="text-gray-500 text-sm mt-1">Hệ thống quản lý trang trại heo</p>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
            <p className="text-gray-500 mt-2">Vui lòng nhập thông tin để truy cập hệ thống</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-1.5 text-gray-700 ml-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5da68a]/20 focus:border-[#5da68a] outline-none transition-all text-gray-700 bg-gray-50/50"
                placeholder="ten-dang-nhap@gmail.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 ml-1">
                <label className="text-sm font-bold text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                {/* <a href="#" className="text-xs font-semibold text-[#5da68a] hover:underline">Quên mật khẩu?</a> */}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5da68a]/20 focus:border-[#5da68a] outline-none transition-all text-gray-700 bg-gray-50/50"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5da68a] text-white py-4 rounded-xl font-bold text-base tracking-wide hover:bg-[#4d8f76] active:scale-[0.99] transition-all shadow-lg shadow-[#5da68a]/30 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ĐANG XỬ LÝ...
                  </>
                ) : "ĐĂNG NHẬP HỆ THỐNG"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            © 2024 VIETAPIG. 
          </p>
        </div>
      </div>
    </div>
  );
}
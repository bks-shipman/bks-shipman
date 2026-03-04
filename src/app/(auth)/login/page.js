"use client";

import { Ship, ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loginUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        setYear(new Date().getFullYear());
        setEmail("");
        setPassword("");
    }, []);
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        nprogress.start();

        try {
            await loginUser({
                email,
                password,
            });

            notifications.show({
                title: "Login Berhasil",
                message: "Selamat datang di Backoffice BKS Shipmanagement",
                color: "green",
            });

            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);

        } catch (error) {
            notifications.show({
                title: "Login Gagal",
                message:
                    error?.response?.data?.message || "Email atau password salah",
                color: "red",
            });
        } finally {
            nprogress.complete();
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Visual Section - Left */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-slate-900">
                <img
                    src="https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&q=80&w=1920"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                    alt="Ship Bridge"
                />
                <div className="absolute inset-0 bg-linear-to-br from-blue-900/40 to-slate-950/80"></div>

                <div className="relative z-10 flex flex-col justify-between p-16 w-full">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="p-2.5 bg-white text-blue-600 rounded-xl">
                            <Image src={"/logo.png"} alt='logo' width={40} height={40} />

                        </div>
                        <span className="text-2xl font-serif font-black tracking-tighter text-white">BKS Shipmanagement</span>
                    </Link>

                    <div className="max-w-xl">
                        <h2 className="text-5xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight">
                            Integrated <br />
                            <span className="text-blue-400">Fleet Operations</span>
                        </h2>
                        <p className="text-xl text-slate-300 font-light leading-relaxed mb-12">
                            Access real-time telemetry, technical documentation, and performance analytics for your managed assets through our secure partner portal.
                        </p>
                        <div className="flex items-center gap-4 text-slate-400">
                            <div className="p-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                                <ShieldCheck className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Enterprise-Grade Encryption Standard</span>
                        </div>
                    </div>

                    <div className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black">
                        © {year}  BKS Shipmanagement
                    </div>
                </div>
            </div>

            {/* Form Section - Right */}
            <div className="grow flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white relative">
                {/* Mobile Logo */}
                <div className="md:hidden absolute top-10 left-10">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src={"/logo.png"} alt='logo' width={40} height={40} />

                        <span className="text-lg font-serif font-black tracking-tighter text-slate-900">BKS Shipmanagement</span>
                    </Link>
                </div>

                <div className="w-full max-w-md">
                    <div className="mb-12">
                        <h1 className="text-4xl font-serif font-bold text-slate-950 mb-4">Admin Login</h1>
                        <p className="text-slate-500 font-light">Enter your credentials to manage your website.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-600 transition-colors">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 border-b border-slate-200 focus:border-blue-600 outline-none transition-all text-slate-900 bg-transparent placeholder:text-slate-300"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 border-b border-slate-200 focus:border-blue-600 outline-none transition-all text-slate-900 bg-transparent placeholder:text-slate-300"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-slate-950 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 group disabled:bg-slate-300 disabled:shadow-none"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

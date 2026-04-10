"use client";

import Link from "next/link";
import { ArrowRight, Lock, Mail, User, ShieldPlus, Github, Chrome } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock register
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div className="max-w-md mx-auto py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] mb-6 shadow-2xl border border-[var(--gold-accent)]/20">
                    <ShieldPlus size={32} />
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">申请访问</h1>
                <p className="text-sm text-[var(--text-secondary)]/60 mt-2 uppercase tracking-widest font-bold">New Entity Registration</p>
            </div>

            <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-50" />
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]/40 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]/30" size={18} />
                            <input 
                                type="text" 
                                placeholder="Your Name"
                                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[var(--gold-accent)]/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]/40 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]/30" size={18} />
                            <input 
                                type="email" 
                                placeholder="name@example.com"
                                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[var(--gold-accent)]/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]/40 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]/30" size={18} />
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[var(--gold-accent)]/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[var(--text-primary)] text-[var(--background)] rounded-2xl py-4 font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? "处理中..." : "初始化实体"}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--border)]"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                        <span className="bg-[var(--card)] px-4 text-[var(--text-secondary)]/30">Quick Access</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--text-secondary)]/5 transition-all text-xs font-bold">
                        <Github size={16} /> GitHub
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--text-secondary)]/5 transition-all text-xs font-bold">
                        <Chrome size={16} /> Google
                    </button>
                </div>
            </div>

            <p className="text-center mt-8 text-xs font-bold text-[var(--text-secondary)]/40">
                已经有账户?{" "}
                <Link href="/login" className="text-[var(--gold-accent)] hover:underline underline-offset-4">
                    建立连接
                </Link>
            </p>
        </div>
    );
}

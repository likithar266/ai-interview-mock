"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Bot, HelpCircle, LayoutDashboard } from "lucide-react";

function Header() {
  const path = usePathname();
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              AIcruit
            </span>
            <span className="ml-2 text-[10px] font-medium text-slate-400">
              AI Mock Interviews
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              path === "/dashboard"
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-850"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>

          <Link
            href="/#how-it-works"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-850 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            How It Works
          </Link>
        </nav>

        {/* Auth status & User profile */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-2.5">
              <div className="p-0.5 rounded-full border border-slate-700">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
            >
              Sign In / Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Single sign-in screen for both roles. The Admin and Manager panels are
 * no longer reached via separate builds — whoever logs in is routed
 * straight into the workspace that matches their account's role (returned
 * by authService / the backend). New accounts pick a role at sign-up only
 * because there's no backend yet to assign one; see services/authService.ts.
 */

import React, { useState } from 'react';
import { AlertCircle, ArrowRight, ChevronDown, Lock, ShieldCheck, UserPlus2 } from 'lucide-react';
import { Role, Session } from '../../../models/types';

type AuthMode = 'login' | 'create';

interface SignInProps {
  onLogin: (email: string, password: string) => Promise<Session>;
  onRegister: (name: string, email: string, password: string, role: Role) => Promise<Session>;
}

export function SignIn({ onLogin, onRegister }: SignInProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<Role>('admin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        if (!name.trim()) {
          setError('Please enter your full name.');
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        await onRegister(name, email, password, role);
      } else {
        await onLogin(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(104,146,73,0.16),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#eef4e8_100%)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl rounded-[32px] border border-white/70 bg-white/80 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl overflow-hidden grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="bg-[#1f3b1a] p-8 md:p-10 text-white flex flex-col justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium">
              <ShieldCheck size={16} />
              Secure role-based access
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#689249] flex items-center justify-center text-white font-bold text-xl font-display shadow-sm shadow-[#689249]/20">
                P
              </div>
              <span className="text-2xl font-bold font-display tracking-tight">PS360</span>
            </div>
            <h1 className="mt-6 text-3xl md:text-4xl font-semibold font-display leading-tight">
              Hospitality operations made simple.
            </h1>
            <div className="mt-4 space-y-4 text-sm md:text-base text-white/80 leading-7">
              <p>
                PS360 brings property management, team collaboration, and guest services into one central dashboard.
                Sign in once to access a polished, role-based workspace built for modern hospitality operations.
              </p>
              <p>
                PS360 is built to simplify hotel operations by bringing bookings, staff coordination, inventory, and guest service into one polished hub.
              </p>
              <p>
                Whether you lead property operations or support the front desk, PS360 keeps your team aligned and your day running smoothly.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#689249]">Welcome</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                {mode === 'login' ? 'Log in to continue' : 'Create a new account'}
              </h2>
            </div>
            <div className="rounded-2xl bg-[#f1f7e8] p-3 text-[#689249]">
              {mode === 'login' ? <Lock size={20} /> : <UserPlus2 size={20} />}
            </div>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === 'create' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ava Johnson"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-[#689249] focus:bg-white"
                />
              </div>
            )}

            {mode === 'create' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="roleSelect">
                  Sign up as
                </label>
                <div className="relative">
                  <select
                    id="roleSelect"
                    value={role}
                    onChange={(event) => setRole(event.target.value as Role)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#689249] focus:bg-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="receptionist">Receptionist</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@ps360.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-[#689249] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-[#689249] focus:bg-white"
              />
            </div>

            {mode === 'create' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-[#689249] focus:bg-white"
                />
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#689249] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#567a3b] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span>{mode === 'login' ? "Don't have an account yet?" : 'Already have an account?'}</span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'create' : 'login');
                setError('');
              }}
              className="font-semibold text-[#689249] transition hover:text-[#567a3b]"
            >
              {mode === 'login' ? 'Create one' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

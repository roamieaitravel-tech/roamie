"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, RefreshCcw, ShieldCheck, Zap, CreditCard, Mail } from "lucide-react";

interface HealthStatus {
  supabase: string;
  openai: string;
  stripe: string;
  resend: string;
  timestamp: string;
}

export default function ChecklistPage() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError("Failed to fetch system status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusIcon = (st: string) => {
    if (st === "healthy") return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
    if (st === "unconfigured") return <CheckCircle2 className="w-6 h-6 text-amber-500" />;
    return <XCircle className="w-6 h-6 text-rose-500" />;
  };

  const getStatusText = (st: string) => {
    if (st === "healthy") return <span className="text-emerald-500 font-medium text-sm">Healthy</span>;
    if (st === "unconfigured") return <span className="text-amber-500 font-medium text-sm">Unconfigured (Optional)</span>;
    return <span className="text-rose-500 font-medium text-sm">Unhealthy - Action Required</span>;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Production Readiness Checklist</h1>
          <p className="text-muted-foreground">Monitor the health of core integrations and infrastructure.</p>
        </div>
        <button 
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
          Refresh Status
        </button>
      </div>

      <div className="grid gap-6">
        {/* Supabase Status */}
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Supabase Database & Auth</h3>
                <p className="text-sm text-muted-foreground">Real-time data synchronization and user authentication service.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-[140px] justify-end">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
                <>
                  {getStatusIcon(status?.supabase || 'unknown')}
                  {getStatusText(status?.supabase || 'unknown')}
                </>
              )}
            </div>
          </div>
        </div>

        {/* OpenAI Status */}
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">OpenAI (GPT-4o)</h3>
                <p className="text-sm text-muted-foreground">AI Travel Planning and conversational intelligence engine.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-[140px] justify-end">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
                <>
                  {getStatusIcon(status?.openai || 'unknown')}
                  {getStatusText(status?.openai || 'unknown')}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stripe Status */}
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Stripe Payments</h3>
                <p className="text-sm text-muted-foreground">Secure payment processing and booking transaction gateway.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-[140px] justify-end">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
                <>
                  {getStatusIcon(status?.stripe || 'unknown')}
                  {getStatusText(status?.stripe || 'unknown')}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Resend Status */}
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Resend Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Transactional email service for welcome and booking alerts.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-[140px] justify-end">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
                <>
                  {getStatusIcon(status?.resend || 'unknown')}
                  {getStatusText(status?.resend || 'unknown')}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 rounded-xl bg-muted/30 border border-dashed flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold mb-1">Last System Verification</h4>
          <p className="text-sm text-muted-foreground">
            {status?.timestamp ? new Date(status.timestamp).toLocaleString() : "Never"}
          </p>
        </div>
        <div className="md:text-right">
          <div className="flex items-center gap-2 md:justify-end text-emerald-600 font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            Netlify Headers: Active
          </div>
          <p className="text-sm text-muted-foreground">CSP & Security Policies Applied via netlify.toml</p>
        </div>
      </div>
    </div>
  );
}

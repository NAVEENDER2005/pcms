import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy, Check, User, Shield, Sparkles, ClipboardPaste, Info, AlertTriangle } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [autoFillMessage, setAutoFillMessage] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleCopy = async (text: string, key: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleAutoFill = (demoEmail: string, demoPassword = 'password123', roleLabel = '') => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setAutoFillMessage(`${roleLabel} filled!`);
    setTimeout(() => setAutoFillMessage(null), 2000);
  };

  const handlePasteClipboard = async (target: 'email' | 'password') => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          if (target === 'email') setEmail(text.trim());
          if (target === 'password') setPassword(text.trim());
        }
      }
    } catch (err) {
      console.error('Paste failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Use consultant@benchsync.com or admin@benchsync.com with password123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-md border-border">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-2 flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              <Info className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
              Demo Web Application
            </span>
          </div>
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-primary">Pool CMS</h1>
            <p className="text-sm text-muted-foreground">
              Consultant Management System
            </p>
          </div>
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email Address</Label>
                <button
                  type="button"
                  onClick={() => handlePasteClipboard('email')}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
                  title="Paste from clipboard into email field"
                  aria-label="Paste from clipboard into email field"
                >
                  <ClipboardPaste className="w-3 h-3" aria-hidden="true" />
                  <span>Paste</span>
                </button>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                aria-describedby={error ? 'error-message' : undefined}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => handlePasteClipboard('password')}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
                  title="Paste from clipboard into password field"
                  aria-label="Paste from clipboard into password field"
                >
                  <ClipboardPaste className="w-3 h-3" aria-hidden="true" />
                  <span>Paste</span>
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                aria-describedby={error ? 'error-message' : undefined}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription id="error-message">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full active:scale-[0.98] transition-transform" 
              disabled={isLoading}
              aria-label={isLoading ? 'Signing in...' : 'Sign in to system'}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Disclaimer Alert */}
          <div className="mt-4 p-3 bg-amber-50/90 border border-amber-200/90 rounded-lg text-xs text-amber-900 flex items-start gap-2.5" role="note">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-0.5">
              <span className="font-semibold text-amber-950 block">Disclaimer</span>
              <p className="text-amber-800 leading-relaxed">
                This is a <strong>demo web application</strong>. All consultant, project, and bench data are simulated for demonstration purposes.
              </p>
            </div>
          </div>

          {/* Demo Credentials Panel */}
          <div className="mt-6 bg-slate-50 border border-slate-200/80 p-4 rounded-lg text-sm text-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-slate-900">
                <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
                <span>Demo Credentials</span>
              </div>
              {autoFillMessage && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                  {autoFillMessage}
                </span>
              )}
            </div>

            {/* 1-Click Quick Fill Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAutoFill('consultant@benchsync.com', 'password123', 'Consultant')}
                className="w-full text-xs h-8 flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 hover:border-slate-300 text-slate-800 active:scale-[0.98] transition-all"
                title="1-click fill consultant email and password"
                aria-label="1-click fill consultant email and password"
              >
                <User className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                <span>Fill Consultant</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAutoFill('admin@benchsync.com', 'password123', 'Admin')}
                className="w-full text-xs h-8 flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 hover:border-slate-300 text-slate-800 active:scale-[0.98] transition-all"
                title="1-click fill admin email and password"
                aria-label="1-click fill admin email and password"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                <span>Fill Admin</span>
              </Button>
            </div>

            {/* Copy / Paste Individual Credentials */}
            <div className="space-y-1.5 pt-1">
              {/* Consultant Row */}
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-md border border-slate-200">
                <div className="min-w-0 pr-2">
                  <span className="text-xs text-slate-500 block leading-tight">Consultant</span>
                  <code className="text-xs font-mono font-medium text-slate-800 truncate block select-all">
                    consultant@benchsync.com
                  </code>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-xs text-slate-600 hover:text-slate-900 active:scale-95"
                    onClick={() => handleCopy('consultant@benchsync.com', 'consultant')}
                    title="Copy consultant email"
                    aria-label="Copy consultant email"
                  >
                    {copiedKey === 'consultant' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span className="ml-1 text-[11px]">{copiedKey === 'consultant' ? 'Copied' : 'Copy'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-6 px-2 text-[11px] font-medium active:scale-95"
                    onClick={() => {
                      setEmail('consultant@benchsync.com');
                      setError('');
                    }}
                    title="Paste consultant email into email field"
                    aria-label="Paste consultant email into email field"
                  >
                    Paste
                  </Button>
                </div>
              </div>

              {/* Admin Row */}
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-md border border-slate-200">
                <div className="min-w-0 pr-2">
                  <span className="text-xs text-slate-500 block leading-tight">Admin</span>
                  <code className="text-xs font-mono font-medium text-slate-800 truncate block select-all">
                    admin@benchsync.com
                  </code>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-xs text-slate-600 hover:text-slate-900 active:scale-95"
                    onClick={() => handleCopy('admin@benchsync.com', 'admin')}
                    title="Copy admin email"
                    aria-label="Copy admin email"
                  >
                    {copiedKey === 'admin' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span className="ml-1 text-[11px]">{copiedKey === 'admin' ? 'Copied' : 'Copy'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-6 px-2 text-[11px] font-medium active:scale-95"
                    onClick={() => {
                      setEmail('admin@benchsync.com');
                      setError('');
                    }}
                    title="Paste admin email into email field"
                    aria-label="Paste admin email into email field"
                  >
                    Paste
                  </Button>
                </div>
              </div>

              {/* Password Row */}
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-md border border-slate-200">
                <div className="min-w-0 pr-2">
                  <span className="text-xs text-slate-500 block leading-tight">Password</span>
                  <code className="text-xs font-mono font-medium text-slate-800 truncate block select-all">
                    password123
                  </code>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-xs text-slate-600 hover:text-slate-900 active:scale-95"
                    onClick={() => handleCopy('password123', 'password')}
                    title="Copy password"
                    aria-label="Copy password"
                  >
                    {copiedKey === 'password' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span className="ml-1 text-[11px]">{copiedKey === 'password' ? 'Copied' : 'Copy'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-6 px-2 text-[11px] font-medium active:scale-95"
                    onClick={() => {
                      setPassword('password123');
                      setError('');
                    }}
                    title="Paste password into password field"
                    aria-label="Paste password into password field"
                  >
                    Paste
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Disclaimer: Demo web application for evaluation & testing only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

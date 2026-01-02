'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Building2, Loader2 } from 'lucide-react';

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Check for error from callback
  const callbackError = searchParams.get('error');
  const errorMessage = searchParams.get('message');

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email openid profile',
        },
      });

      if (error) {
        console.error('Sign in error:', error);
        setError(error.message);
        setIsLoading(false);
      }
      // If successful, the user will be redirected to Microsoft login
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const displayError = error || (callbackError ? errorMessage || callbackError : null);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-4">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-lg bg-[#0058A9] flex items-center justify-center">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-[#0058A9]">Lending Heights</h1>
              <p className="text-xs text-muted-foreground">Hub</p>
            </div>
          </div>
        </div>

        <div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription className="mt-2">
            Sign in with your Lending Heights Microsoft account to continue
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Display */}
        {displayError && (
          <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Authentication Error</p>
              <p className="mt-1 text-destructive/80">{displayError}</p>
            </div>
          </div>
        )}

        {/* Microsoft Sign In Button */}
        <Button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full h-12 bg-[#2F2F2F] hover:bg-[#404040] text-white"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Redirecting to Microsoft...
            </>
          ) : (
            <>
              {/* Microsoft Logo */}
              <svg
                className="mr-3 h-5 w-5"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
              Sign in with Microsoft
            </>
          )}
        </Button>

        {/* Help Text */}
        <p className="text-xs text-center text-muted-foreground pt-4">
          Use your <strong>@lhloans.com</strong> email address to sign in.
          <br />
          Contact IT if you're having trouble accessing your account.
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}

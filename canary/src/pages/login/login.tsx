import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { signIn, signUp } from '@hooks/auth-client';
import Wordmark from '@ui/wordmark';

type Mode = 'signin' | 'signup';

export default function Login() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      await signUp.email(
        { email, password, name },
        {
          onSuccess: () => navigate('/manager/dashboard'),
          onError: (ctx) => {
            setError(ctx.error.message ?? 'Sign up failed');
            setLoading(false);
          },
        },
      );
    } else {
      await signIn.email(
        { email, password },
        {
          onSuccess: () => navigate('/manager/dashboard'),
          onError: (ctx) => {
            setError(ctx.error.message ?? 'Sign in failed');
            setLoading(false);
          },
        },
      );
    }
  };

  const handleGoogle = async () => {
    await signIn.social({
      provider: 'google',
      callbackURL: '/manager/dashboard',
    });
  };

  return (
    <div className="login-screen">
      <div className="login-side">
        <Wordmark />
        <div className="quote">
          <h2>&ldquo;It finally feels like software that was designed by people who&rsquo;ve actually managed a building in the rain.&rdquo;</h2>
          <p>— Declan Murphy, Harbour Holdings (5 buildings on Gower St)</p>
        </div>
        <div className="stamp">ST. JOHN&rsquo;S · NL · EST. 2024</div>
      </div>
      <div className="login-form-side">
        <div className="login-form">
          <h1>{mode === 'signin' ? 'Welcome back.' : 'Create an account.'}</h1>
          <p className="sub">
            {mode === 'signin'
              ? 'Sign in to your Canary account.'
              : 'Get started with Canary.'}
          </p>

          <button
            className="login-google"
            onClick={handleGoogle}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--line)',
              borderRadius: 8,
              background: 'var(--bg-elev)',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 20px', color: 'var(--ink-4)', fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            or
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>

          <form onSubmit={handleEmailAuth}>
            {mode === 'signup' && (
              <input
                className="login-input"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            )}
            <input
              className="login-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
            />

            {mode === 'signin' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-3)', margin: '6px 2px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" defaultChecked /> Keep me signed in
                </label>
                <a style={{ cursor: 'pointer' }}>Forgot password?</a>
              </div>
            )}

            {error && (
              <div style={{ color: 'var(--red, #d14343)', fontSize: 13, padding: '8px 0' }}>
                {error}
              </div>
            )}

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="login-alt">
            {mode === 'signin' ? (
              <>Don&rsquo;t have an account? <button onClick={() => { setMode('signup'); setError(''); }} style={{ color: 'var(--ink)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}>Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => { setMode('signin'); setError(''); }} style={{ color: 'var(--ink)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}>Sign in</button></>
            )}
            {' · '}
            <Link href="/" style={{ color: 'var(--ink-3)' }}>Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

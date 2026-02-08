import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase', met: /[A-Z]/.test(password) },
    { label: 'Contains number', met: /[0-9]/.test(password) },
    { label: 'Passwords match', met: password === confirmPassword && password.length > 0 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    setShowOtpInput(true);
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Mock Google signup
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-accent overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 mx-auto">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Start Your Free Trial
            </h2>
            <p className="text-white/80 mb-8">
              No credit card required. Get started in minutes.
            </p>
            <ul className="space-y-3 text-left">
              {['14-day free trial', 'Full feature access', 'Cancel anytime'].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">SubscriptIQ</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">
            Get started with your 14-day free trial
          </p>

          {!showOtpInput ? (
            <>
              <Button
                variant="outline"
                className="w-full h-12 mb-6"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or register with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 input-focus"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 input-focus"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 input-focus"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-12 input-focus"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {passwordRequirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <CheckCircle
                        className={`w-3.5 h-3.5 ${req.met ? 'text-success' : 'text-muted-foreground'}`}
                      />
                      <span className={req.met ? 'text-success' : 'text-muted-foreground'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{' '}
                    <a href="#" className="text-primary hover:underline">Terms</a>
                    {' '}and{' '}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 border-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center p-6 rounded-xl bg-muted/50">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Check your email</h3>
                <p className="text-muted-foreground text-sm">
                  We've sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Verification Code</Label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-14 text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || isLoading}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 border-0"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              <button
                onClick={() => setShowOtpInput(false)}
                className="w-full text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to registration
              </button>
            </motion.div>
          )}

          <p className="text-center text-muted-foreground mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-5" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">SubscriptIQ</span>
        </Link>

        <div className="p-8 rounded-2xl border border-border bg-card/80 backdrop-blur-xl">
          {!isSubmitted ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">Forgot password?</h1>
              <p className="text-muted-foreground text-center mb-8">
                No worries, we'll send you reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 border-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email?{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:underline"
                >
                  Click to resend
                </button>
              </p>
            </motion.div>
          )}

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground mt-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;

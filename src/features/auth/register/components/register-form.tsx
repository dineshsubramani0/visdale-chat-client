// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/api/hooks/use-auth';
import { registerSchema } from './validation/validation';
import type { z } from 'zod';
import type {
  RequestOtpDto,
  VerifyOtpDto,
  RegisterDto,
} from '@/@types/auth/register.interface';

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'verify' | 'password'>(
    'details'
  );
  const [isSending, setIsSending] = useState(false);
  const [userDetails, setUserDetails] = useState<RequestOtpDto | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { requestOtpMutation, verifyOtpMutation, registerMutation } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // -------------------- Step 1: Send OTP --------------------
  const handleSendOtp = async () => {
    const valid = await trigger(['firstName', 'lastName', 'email']);
    if (!valid) return;

    const payload: RequestOtpDto = {
      first_name: watch('firstName'),
      last_name: watch('lastName'),
      email: watch('email'),
    };

    setIsSending(true);
    try {
      const res = await requestOtpMutation.mutateAsync(payload);
      toast.success(res.data.message);
      setUserDetails(payload);
      setStep('verify');
    } catch (err: unknown) {
      if (err instanceof Error) console.log(err.message);
    } finally {
      setIsSending(false);
    }
  };

  // -------------------- Step 2: Verify OTP --------------------
  const handleVerifyOtp = async () => {
    const valid = await trigger('otp');
    if (!valid || !userDetails) return;

    const payload: VerifyOtpDto = {
      email: userDetails.email,
      otp: String(watch('otp')),
    };

    try {
      const res = await verifyOtpMutation.mutateAsync(payload);
      toast.success(res.data.message);
      setStep('password');
    } catch (err: unknown) {
      if (err instanceof Error) console.log(err.message);
    }
  };

  // -------------------- Step 3: Register --------------------
  const onSubmit = async (data: RegisterFormData) => {
    if (!userDetails) return toast.error('User details missing.');
    if (step !== 'password')
      return toast.error('Please complete OTP verification first.');

    const payload: RegisterDto = {
      ...userDetails, // first_name, last_name, email
      password: data.password || '',
    };

    try {
      const res = await registerMutation.mutateAsync(payload);
      toast.success(res.data.message);
      navigate('/login');
    } catch (err: unknown) {
      if (err instanceof Error) console.log(err.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Enter your details below to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Step 1: Details */}
          {step === 'details' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={isSending}
                className="w-full bg-primary cursor-pointer text-white hover:bg-primary/80 transition-colors">
                {isSending ? 'Sending OTP...' : 'Send Verification Code'}
              </Button>
            </>
          )}

          {/* Step 2: Verify OTP */}
          {step === 'verify' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  placeholder="6-digit code"
                  {...register('otp')}
                />
                {errors.otp && (
                  <p className="text-sm text-red-600">{errors.otp.message}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full bg-primary cursor-pointer text-white hover:bg-primary/80 transition-colors">
                Verify Code
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Didn’t get it?{' '}
                <button
                  type="button"
                  className="underline text-primary cursor-pointer hover:text-primary/80 transition-colors"
                  onClick={handleSendOtp}>
                  Resend OTP
                </button>
              </p>
            </>
          )}

          {/* Step 3: Password */}
          {step === 'password' && (
            <>
              <div className="grid gap-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute cursor-pointer right-3 top-[30px] text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2 relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 cursor-pointer top-[30px] text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer bg-primary text-white hover:bg-primary/80 transition-colors">
                Create Account
              </Button>
            </>
          )}

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="underline underline-offset-4 text-primary hover:text-primary/80 transition-colors">
              Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import { loginSchema } from './validation/validation';
import { useAuth } from '@/api/hooks/use-auth';
import { CHAT_ROUTES_CONSTANT } from '@/routers/app/chat/chat-routes.constant';
import { encrypt } from '@/lib/encryption';

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { loginMutation, meQuery } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Login
      const loginResponse = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      const accessToken = loginResponse.data?.access_token;
      if (!accessToken) throw new Error('No access token returned');

      sessionStorage.setItem('access_token', accessToken);

      // Fetch current user profile after login
      const profileResponse = await meQuery.refetch();
      const currentProfile = profileResponse?.data?.data;

      if (currentProfile) {
        sessionStorage.setItem('_ud', encrypt(JSON.stringify(currentProfile)));
      }

      toast.success('Welcome! Login successful 🎉');
      navigate(CHAT_ROUTES_CONSTANT.CHAT);
    } catch (err: unknown) {
      console.error(err, 'On Login');
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email and password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="username@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
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
                  className="absolute right-3 top-[30px] text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full cursor-pointer">
                  Login
                </Button>
              </div>
            </div>

            {/* Sign up link */}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="underline underline-offset-4 text-primary hover:text-primary/80"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { ModeToggle } from '@/components/theme/mode-toggle';
import { LoginForm } from '../components/login-form';
import { APP_FEATURES } from '@/utils/constant/common.constant';

const APP_NAME = import.meta.env.VITE_APP_NAME;
const VERSION = import.meta.env.VITE_VERSION;
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL;

const LoginPage = () => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Section - Brand Info */}
      <div className="lg:flex flex-col justify-center bg-linear-to-b from-zinc-900 to-zinc-800 text-white p-6 sm:p-10 lg:p-12">
        <div className="max-w-md mx-auto space-y-8 sm:space-y-10 text-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Welcome to {APP_NAME}
            </h1>
            <p className="mt-2 sm:mt-3 text-[clamp(0.875rem,2vw,1.125rem)] text-gray-300">
              Login to start real-time conversations and collaborate seamlessly.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-4 sm:space-y-5 text-left">
            {APP_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-2 sm:space-x-3">
                  <Icon className="h-5 sm:h-6 w-5 sm:w-6 text-gray-100" />
                  <span className="text-[clamp(0.875rem,1.8vw,1rem)] text-gray-200 font-medium">
                    {feature.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Support Section */}
          <div className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-gray-300 pt-6 sm:pt-8 border-t border-gray-700 mt-6 sm:mt-10 space-y-2">
            <p className="font-medium text-gray-200">
              Need help? Reach us anytime:
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md border-gray-500 hover:bg-gray-700 transition text-white font-medium text-[clamp(0.75rem,1.5vw,0.875rem)]">
              Email: {SUPPORT_EMAIL}
            </a>
            <p className="text-xs sm:text-sm text-gray-400">
              For urgent help, mention <code>[URGENT]</code> in your subject.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="pb-4">
            <ModeToggle />
          </div>

          <LoginForm />

          <div className="pt-4 sm:pt-6 w-full text-sm sm:text-base text-[hsl(var(--muted-foreground))] font-medium text-right">
            <span>
              version:{' '}
              <span className="text-[hsl(var(--accent))]">{VERSION}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

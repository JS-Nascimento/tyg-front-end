import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useLoading } from '@/app/components/LoadingSystem';
import TygLogo from '@/app/components/TygLogo';

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  'remember-me': HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const LoginForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { startLoading, stopLoading } = useLoading();

  const handleSubmit = async (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      startLoading();

      const form = event.currentTarget;
      const formData = new FormData(form);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      // Tenta fazer login usando o NextAuth
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        'callbackUrl': '/home',
      });

      // Verifica se houve erro no login
      if (result?.error) {
        setError('Invalid credentials, please try again.');
      } else {
        // Redireciona para a página inicial após o login bem-sucedido
        window.location.href = '/home';
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.' + error);
    } finally {
      stopLoading(); // Garante que o loading será removido mesmo em caso de erro
    }
  };

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div
          className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="md:max-w-md w-full px-4 py-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-12">
                <h3 className="text-gray-800 text-3xl font-extrabold">Sign in</h3>
                {error && <p className="text-red-500">{error}</p>}
                <p className="text-sm mt-4 text-gray-800">
                  Don&#39;t have an account? <a href="/auth/register"
                                                className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">Register
                  here</a>
                </p>
              </div>
              <div>
                <label className="text-gray-800 text-xs block mb-2">Email</label>
                <div className="relative flex items-center">
                  <input name="email" type="email" required
                         className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                         placeholder="Enter email" />
                </div>
              </div>
              <div className="mt-8">
                <label className="text-gray-800 text-xs block mb-2">Password</label>
                <div className="relative flex items-center">
                  <input name="password" type="password" required
                         className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                         placeholder="Enter password" />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox"
                         className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">Remember me</label>
                </div>
                <div>
                  <a href="/auth/forgot-password" className="text-blue-600 font-semibold text-sm hover:underline">Forgot
                    Password?</a>
                </div>
              </div>
              <div className="mt-12">
                <button type="submit"
                        className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">Sign
                  in
                </button>
              </div>
            </form>
          </div>
          <div className="md:h-full bg-[#000842] rounded-xl lg:p-12 p-8">
            <div className="md:h-full bg-[#000842] rounded-xl lg:p-12 p-8 relative min-h-[300px]">
              <TygLogo/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

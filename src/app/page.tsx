// app/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import LoginForm from '@/app/auth/login/LoginForm';


export default function Index() {
  const { status } = useSession();

  if (status === 'authenticated') {
    redirect('/home');
  }

  return <LoginForm />;
}
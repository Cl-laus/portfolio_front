'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export function useProtectedRoute() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const router = useRouter();

  useEffect(function () {
    const auth = authService.isAuthenticated();
    setIsAuth(auth);
    setCheckingAuth(false);
    if (!auth) {
      router.push('/batcave');
    }
  }, [router]);

  return { isAuth, checkingAuth };
}
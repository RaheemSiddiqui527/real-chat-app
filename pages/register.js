// pages/register.js
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();

  // Redirect to main page with register parameter
  if (typeof window !== 'undefined') {
    router.push('/?page=register');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
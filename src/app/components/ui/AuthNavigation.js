// components/ui/AuthNavigation.js
import { useRouter } from 'next/router';

const AuthNavigation = ({ currentPage }) => {
  const router = useRouter();

  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-600">
        {currentPage === 'login' ? (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthNavigation;
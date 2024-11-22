import { Link } from 'react-router-dom';

export function EmailConfirmation() {
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Check your email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a confirmation email to your inbox. Please click the link in the email to verify your account.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Didn't receive the email? Check your spam folder or{' '}
          <button className="text-primary-600 hover:text-primary-500 font-medium">
            click here to resend
          </button>
        </p>
        <Link
          to="/login"
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Return to login
        </Link>
      </div>
    </div>
  );
}

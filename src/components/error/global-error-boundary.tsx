import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

const GlobalErrorBoundary = () => {
  const error = useRouteError();
  let title = 'Something went wrong!';
  let message = 'An unknown error occurred.';
  let errorDetails = '';

  if (isRouteErrorResponse(error)) {
    title = `Error ${error.status}`;
    message = error.statusText || 'An unexpected error occurred.';
    errorDetails = JSON.stringify(error.data, null, 2);
  } else if (error instanceof Error) {
    message = error.message;
    errorDetails = error.stack ?? 'No stack trace available.';
  } else if (typeof error === 'object' && error !== null) {
    errorDetails = JSON.stringify(error, null, 2);
  } else {
    errorDetails = String(error);
  }

  return (
    <section className="flex flex-col items-center justify-center w-auto min-h-full p-6 text-center">
      <div className="w-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-red-600">{title}</h1>
        <h2 className="w-full mt-2 text-lg text-gray-700">{message}</h2>
        <pre className="p-4 mt-4 overflow-auto text-sm text-red-800 mx-auto my-0 bg-red-100 rounded-lg max-h-60 w-[60vw]">
          {errorDetails}
        </pre>

        <Link
          to="/"
          className="inline-block px-4 py-2 mt-6 text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700">
          Go Dashboard
        </Link>
      </div>
    </section>
  );
};

export default GlobalErrorBoundary;

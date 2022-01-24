import toast from 'react-hot-toast';

type ToastType = 'error' | 'warning' | 'success';
const ToastComponent = ({
  type,
  title,
  description,
  onDismiss,
}: {
  type: ToastType;
  title: string;
  description?: string;
  onDismiss: () => void;
}) => (
  <div className="w-full py-3 px-1">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        {type === 'warning' && (
          <svg
            className="h-6 w-6 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {type === 'error' && (
          <svg
            className="h-6 w-6 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {type === 'success' && (
          <svg
            className="h-6 w-6 text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>
      <div className="ml-3 w-0 flex-1 pt-0.5">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={onDismiss}
          className="rounded-md inline-flex text-gray-700 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="sr-only">Close</span>
          {/* <!-- Heroicon name: x --> */}
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

const createToast = (type: ToastType, title: string, description?: string) =>
  toast(
    (t) => (
      <ToastComponent
        type={type}
        title={title}
        description={description}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ),
    {
      duration: 5000,
    }
  );

export const error = (message: string, description?: string): string =>
  createToast('error', message, description);
export const warning = (message: string, description?: string): string =>
  createToast('warning', message, description);
export const success = (message: string, description?: string): string =>
  createToast('success', message, description);
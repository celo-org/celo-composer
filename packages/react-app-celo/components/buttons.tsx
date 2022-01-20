
   
import { ButtonHTMLAttributes } from 'react';

export function PrimaryButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
): React.ReactElement {
  return (
    <button
      {...props}
      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 ${
        props.disabled
          ? 'cursor-not-allowed'
          : 'hover:from-purple-700 hover:to-indigo-700'
      } mt-2 ml-auto ${props.className || ''}`}
    />
  );
}

export function SecondaryButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
): React.ReactElement {
  return (
    <button
      {...props}
      className={`px-4 py-2 border border-transparent rounded-md text-base font-medium text-gradient bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 outline-none focus:outline-none ${
        props.className || ''
      }`}
    />
  );
}
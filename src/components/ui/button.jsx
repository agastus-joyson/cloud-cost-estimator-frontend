import React from 'react';
import classNames from 'classnames';

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors',
        'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

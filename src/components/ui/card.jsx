import React from 'react';
import classNames from 'classnames';

export const Card = ({ children, className }) => {
  return (
    <div className={classNames('bg-white shadow-md rounded-lg', className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return (
    <div className={classNames('p-4', className)}>
      {children}
    </div>
  );
};

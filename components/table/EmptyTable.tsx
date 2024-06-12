import classNames from 'classnames';
import React from 'react';

export const EmptyTable = ({ totalItem }: { totalItem: number }) => {
  if (totalItem < 0) return null;
  return (
    <div className="w-full relative">
      {Array(Math.max(totalItem, 0))
        .fill({})
        .map((e, index) => {
          return (
            <div
              key={index}
              className={classNames(
                index == 0 && 'border-t',
                'text-xs w-full truncate border-l border-line border-b flex items-center px-1 justify-start text-dark cell-height',
              )}
            />
          );
        })}
    </div>
  );
};

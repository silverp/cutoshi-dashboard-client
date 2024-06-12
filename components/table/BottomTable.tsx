import { useAppSelector } from '@/hooks/useConnect';
import { ColumnFiltersState } from '@tanstack/react-table';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BottomTableProps {
  totalPages: number;
  loading: boolean;
  options?: {
    page: number;
    limit: number;
    filter: ColumnFiltersState;
  };
  onOptionsChange?: Function;
}
export const BottomTable = ({
  totalPages,
  loading,
  options = {
    page: 1,
    limit: 10,
    filter: [],
  },
  onOptionsChange,
}: BottomTableProps) => {
  const { t } = useTranslation();

  const [inputPage, setInputPage] = useState<number>(1);

  useEffect(() => {
    setInputPage(options.page);
  }, [options.page]);

  return (
    <div
      className={classNames(
        loading ? 'hide' : 'block',
        'flex gap-1 flex-row w-full justify-between mt-4 items-center',
      )}
    >
      <button
        onClick={(event) => {
          event.preventDefault();
          if (options.page > 1) {
            const target = options.page - 1;
            onOptionsChange && onOptionsChange((cur: any) => ({ ...cur, page: target }));
            setInputPage(target);
          }
        }}
        className={classNames(
          options.page > 1 ? 'text-black' : 'text-black/80',
          'border w-1/4 border-gray_border text-sm flex justify-center items-center h-10 bg-background_card truncate px-0.5',
        )}
      >
        {t('previous')}
      </button>
      <div className=" flex flex-col lg:flex-row items-center gap-1">
        <div className={classNames('text-black text-sm flex items-center flex-row')}>
          {t('page')}
          <input
            className="border border-gray_border text-center bg-transparent h-10 w-16 mx-1 text-sm"
            value={inputPage}
            onKeyDown={(event) => {
              if (event.code !== 'Enter') return;
              if (!inputPage) {
                setInputPage(options.page);
              } else if (inputPage !== options.page) {
                onOptionsChange && onOptionsChange((cur: any) => ({ ...cur, page: inputPage }));
              }
            }}
            onBlur={() => {
              if (!inputPage) {
                setInputPage(options.page);
              } else if (inputPage !== options.page) {
                onOptionsChange && onOptionsChange((cur: any) => ({ ...cur, page: inputPage }));
              }
            }}
            onChange={(event) => {
              event.preventDefault();
              const { value } = event.target;
              const page = value
                ? parseInt(value) > totalPages
                  ? totalPages
                  : parseInt(value)
                : 1;
              setInputPage(page);
            }}
          />
          <div className="w-max text-sm">{`${t('of')} ${totalPages}`}</div>
        </div>

        <select
          id="row-navigate"
          name="navigate"
          className="bg-transparent text-black text-sm ml-2 w-20 border border-gray_border h-10"
          onChange={(event) => {
            event.preventDefault();
            const target = event.target.value;
            setInputPage(1);
            onOptionsChange && onOptionsChange((cur: any) => ({ ...cur, limit: target, page: 1 }));
          }}
          defaultValue={options.limit}
        >
          <option value={5}>5 {t('rows')}</option>
          <option value={10}>10 {t('rows')}</option>
          <option value={20}>20 {t('rows')}</option>
          <option value={50}>50 {t('rows')}</option>
          <option value={100}>100 {t('rows')}</option>
        </select>
      </div>

      <button
        onClick={(event) => {
          event.preventDefault();
          if (options.page < totalPages) {
            const target = options.page + 1;
            onOptionsChange && onOptionsChange((cur: any) => ({ ...cur, page: target }));
            setInputPage(target);
          }
        }}
        className={classNames(
          options.page < totalPages ? 'text-black' : 'text-black/80',
          'border w-1/4 border-gray_border text-sm flex flex-col justify-center items-center h-10 bg-background_card line-clamp-1 px-0.5',
        )}
      >
        {t('next')}
      </button>
    </div>
  );
};

import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { ColumnFiltersState, Table, flexRender } from '@tanstack/react-table';
import FilterTable from './FilterTable';
import { EmptyTable } from './EmptyTable';
import { BottomTable } from './BottomTable';
import Loading from '../common/Loading';
import { useTranslation } from 'react-i18next';

interface TableProps {
  loading: boolean;
  data: any[];
  table: Table<any>;
  totalPages: number;
  headerHeight?: string;
  rightAction?: ReactNode;
  hideBottom?: boolean;
  titleTable?: string | ReactNode;
  options?: {
    page: number;
    limit: number;
    filter: ColumnFiltersState;
  };
  onOptionsChange?: Function;
}
const Table = ({
  loading,
  data,
  table,
  totalPages,
  headerHeight,
  rightAction,
  hideBottom = false,
  titleTable,
  options = {
    page: 1,
    limit: 10,
    filter: [],
  },
  onOptionsChange,
}: TableProps) => {
  const { t } = useTranslation();
  return (
    <div className={classNames('p-5 flex flex-col h-auto', loading && 'h-full')}>
      {rightAction}
      <div className={classNames('box-table h-auto', loading && 'h-full')}>
        {!!titleTable &&
          (typeof titleTable === 'string' ? (
            <span className="font-medium text-sm text-primary">{titleTable}</span>
          ) : (
            titleTable
          ))}

        {loading && (
          <div className="w-full h-full flex-1 flex justify-center items-center">
            <Loading />
          </div>
        )}
        <div className="mt-4 w-full relative ">
          {data.length == 0 && !loading && (
            <div className="text-black inset-0 text-sm m-auto absolute h-fit z-10 bg-background w-fit px-2 rounded">
              {t('no_data_to_show')}
            </div>
          )}
          <div className="flex flex-col w-full ">
            <div
              className={classNames(
                'overflow-x-auto scrollbar-thin relative scrollbar-thumb-primary',
                loading ? 'hidden' : 'block',
              )}
            >
              <div className="w-full">
                {table.getHeaderGroups().map((headerGroup: any) => (
                  <div key={headerGroup.id} className="flex header-table flex-row">
                    {headerGroup.headers.map((header: any) => {
                      return (
                        <div
                          key={header.id}
                          style={{
                            position: 'relative',
                            flexGrow: header.getSize(),
                            flexShrink: 0,
                            flexBasis: 'auto',
                            width: header.getSize(),
                          }}
                        >
                          <div
                            style={{
                              height: headerHeight ?? '60px',
                            }}
                            className={classNames(
                              'text-black text-xs font-medium text-center border-solid border-line border-t border-b border-l leading-2 p-1',
                            )}
                          >
                            <>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanResize() && (
                                <div
                                  onMouseDown={header.getResizeHandler()}
                                  onTouchStart={header.getResizeHandler()}
                                  className={`resizer`}
                                ></div>
                              )}
                            </>
                          </div>
                          <div className="rt-thead -header">
                            {header.column.getCanFilter() ? (
                              <FilterTable column={header.column} />
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div className="body flex flex-col">
                  {table.getRowModel().rows.map((row: any, indexRow: number) => {
                    return (
                      <div key={row.id} className="flex items-center flex-row">
                        {row.getVisibleCells().map((cell: any) => {
                          return (
                            <div
                              key={cell.id}
                              style={{
                                flexGrow: cell.column.getSize(),
                                flexShrink: 0,
                                flexBasis: 'auto',
                                width: cell.column.getSize(),
                              }}
                              className={classNames('table-cell', indexRow == 0 && 'border-t')}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                {/* Add width header for width Empty Item */}

                {table.getHeaderGroups().map((headerGroup: any) => (
                  <div key={headerGroup.id} className="flex header-table flex-row">
                    {headerGroup.headers.map((header: any) => {
                      return (
                        <div
                          key={header.id}
                          style={{
                            flexGrow: header.getSize(),
                            flexShrink: 0,
                            flexBasis: 'auto',
                            width: header.getSize(),
                          }}
                        >
                          <EmptyTable
                            totalItem={options.limit - table?.getRowModel()?.rows?.length ?? 0}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className={classNames(hideBottom && 'hidden', loading ? 'hidden' : 'block')}>
              <BottomTable
                loading={loading}
                options={options}
                onOptionsChange={onOptionsChange}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Table;

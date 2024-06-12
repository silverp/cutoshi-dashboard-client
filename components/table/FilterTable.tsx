import { Column } from '@tanstack/react-table';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

type AddMoreProps = { label: string; value: string };

const FilterTable = ({ column }: { column: Column<any, any> }) => {
  const { t } = useTranslation();
  if (column.columnDef.enableColumnFilter && (column.columnDef as any)?.selections) {
    return (
      <div className={classNames('border-line h-full', column.id !== 'id' && 'border-l')}>
        <select
          id="form-session"
          name="filterHeader"
          form="form-session"
          className="text-black text-xs w-full rounded-sm p-1 cell-height bg-primary"
          onChange={({ target: { value } }) => column.setFilterValue(value)}
        >
          {(column.columnDef as any as { selections: AddMoreProps[] })?.selections.map(
            (e, index) => {
              return (
                <option key={index} value={e.value}>
                  {e.label}
                </option>
              );
            },
          )}
        </select>
      </div>
    );
  }

  if (column.columnDef.enableColumnFilter) {
    return (
      <div className={classNames('border-line cell-height', column.id !== 'id' && 'border-l')}>
        <input
          type="text"
          placeholder={t('search')}
          value={(column.getFilterValue() ?? '') as string}
          onChange={({ target: { value } }) => column.setFilterValue(value)}
          className="w-full text-xs font-medium border-solid bg-primary cell-height text-dark px-1 placeholder:text-dark"
        />
      </div>
    );
  }

  return (
    <div
      className={classNames('p-1 cell-height border-line', column.id !== 'id' && 'border-l')}
    ></div>
  );
};
export default FilterTable;

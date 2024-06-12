import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getColorStatus } from '@/helpers/converts';
import { thousandsFormat } from '@/helpers/format';
import { useAppSelector } from '@/hooks/useConnect';
import { useDebounce } from '@/hooks/useDebounce';
import { Paging, Transaction } from '@/types';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import moment from 'moment';
import axios from '../api/axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import toast from '@/helpers/toast';
import Table from '@/components/table';
import { TOKEN_SYMBOL } from '@/constants/information';
import PayingPayment from '@/components/modal/PayingPayment';

const Transactions = () => {
  const { t } = useTranslation();
  const currencies = useAppSelector((state) => state.settings?.constants?.currencies ?? []);
  const paymentStatus = useAppSelector((state) => state.settings?.constants?.paymentStatus ?? []);

  const balance = useAppSelector((state) => state?.account.balance);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [options, setOptions] = useState<{
    page: number;
    limit: number;
    filter: ColumnFiltersState;
  }>({ page: 1, limit: 10, filter: [] });

  const [modalPaymentDetail, setModalPaymentDetail] = useState<{
    isOpen: boolean;
    data?: Transaction;
  }>({
    isOpen: false,
    data: undefined,
  });
  const [data, setData] = useState<Transaction[]>([]);
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: 'paymentId',
        enableColumnFilter: true,
        header: () => <p className="line-clamp-2">{t('trx_number')}</p>,
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className="table-cell-child">
              {row.original.publicId}
            </div>
          );
        },
      },

      {
        accessorKey: 'date',
        header: () => <p className="line-clamp-2">{t('date_time')}</p>,
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className="table-cell-child">
              {row.original.date && moment(row.original.date).format('DD-MM-YYYY HH:mm:ss')}
            </div>
          );
        },
      },
      {
        accessorKey: 'tokenPriceInUsd',
        header: () => (
          <p className="line-clamp-2">
            ${TOKEN_SYMBOL} {t('price')}
          </p>
        ),
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className="table-cell-child">
              {row.original.tokenPriceInUsd}
            </div>
          );
        },
      },
      {
        accessorKey: 'requestTokens',
        header: () => (
          <p className="line-clamp-2">
            ${TOKEN_SYMBOL} {t('amount')}
          </p>
        ),
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className="table-cell-child">
              {thousandsFormat(row.original.requestTokens)}
            </div>
          );
        },
      },
      {
        accessorKey: 'tokens',
        header: () => (
          <p className="line-clamp-3">{t('actual_amount', { value: `$${TOKEN_SYMBOL}` })}</p>
        ),
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className="table-cell-child">
              {thousandsFormat(row.original.tokens)}
            </div>
          );
        },
      },
      {
        accessorKey: 'currency',
        header: () => <p className="line-clamp-2">{t('payment_currency')}</p>,
        enableColumnFilter: true,
        selections: [
          {
            label: 'Show All',
            value: 'all',
          },
          ...currencies,
        ],
        size: 150,
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className="table-cell-child">
              {currencies.find((e) => e.value == row.original.currency)?.label}
            </div>
          );
        },
      },
      {
        accessorKey: 'requestAmountInPc',
        header: () => <p className="line-clamp-2">{t('payment_amount')}</p>,
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className="table-cell-child">
              {thousandsFormat(row.original.requestAmountInPc)}
            </div>
          );
        },
      },
      {
        accessorKey: 'amountInPc',
        header: () => <p className="line-clamp-3">{t('actual_payment_amount')}</p>,
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className="table-cell-child">
              {thousandsFormat(row.original.amountInPc)}
            </div>
          );
        },
      },
      {
        accessorKey: 'requestAmountInUsd',
        header: () => <p className="line-clamp-3">{t('amount_in_usd')}</p>,
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className="table-cell-child">
              {row.original.requestAmountInUsd}
            </div>
          );
        },
      },
      {
        accessorKey: 'amountInUsd',
        header: () => <p className="line-clamp-3">{t('actual_amount_in_usd')}</p>,
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className="table-cell-child">
              {row.original.amountInUsd}
            </div>
          );
        },
      },

      {
        accessorKey: 'trxStatus',
        header: () => <p className="line-clamp-2">{t('trx_status')}</p>,
        enableColumnFilter: true,
        selections: [
          {
            label: 'Show All',
            value: 'all',
          },
          ...paymentStatus,
        ],
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className="table-cell-child">
              <div
                style={{ backgroundColor: getColorStatus(row.original.status) }}
                className={twMerge(
                  'w-full text-center border-solid flex items-center justify-center rounded-full px-2 py-1 text-white text-xs',
                )}
              >
                {paymentStatus.find((e) => e.value === row.original.status)?.label ?? ''}
              </div>
            </div>
          );
        },
      },
      {
        id: 'action',
        accessorKey: 'status',
        header: () => <span>{t('actions')}</span>,
        cell: ({ row }) => (
          <div className="table-cell-child justify-center">
            {row.original.status === 'waiting' ? (
              <button
                onClick={() => {
                  setModalPaymentDetail({
                    isOpen: true,
                    data: row.original,
                  });
                }}
                className="text-black text-xs flex justify-center items-center border border-primary py-1 px-2 rounded-full"
              >
                Payment Details
              </button>
            ) : (
              <p className="text-center">---</p>
            )}
          </div>
        ),
      },
    ],
    [paymentStatus, currencies, t],
  );

  const dataQuery = useCallback(async (page: number, limit: number, filter: ColumnFiltersState) => {
    try {
      setLoading(true);
      const params: any = {
        page: page,
        limit: limit,
      };

      if (filter && filter.length) {
        const paymentId = filter.find((e) => e.id === 'paymentId')?.value;
        if (paymentId && paymentId !== '') params['paymentId'] = paymentId;

        const status = filter.find((e) => e.id === 'trxStatus')?.value;
        if (status && status !== 'all') params['status'] = status;

        const currency = filter.find((e) => e.id === 'currency')?.value;
        if (currency && currency !== 'all') params['currency'] = currency;

        const type = filter.find((e) => e.id === 'type')?.value;
        if (type && type !== 'all') params['type'] = type;
      }
      const res: Paging<Transaction> = await axios.get('/transactions/clients', {
        params: params,
      });
      setTotalPages(res.totalPages);
      setData(res.data);
    } catch (e: any) {
      toast(e.message, {
        type: 'error',
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedAmountRequest = useDebounce(() => {
    setOptions((cur) => ({ ...cur, page: 1, filter: columnFilters }));
  });

  useEffect(() => {
    const { page, limit, filter } = options;
    dataQuery(page, limit, filter);
  }, [dataQuery, JSON.stringify(options)]);

  useEffect(() => {
    debouncedAmountRequest();
  }, [columnFilters, debouncedAmountRequest]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    enableColumnFilters: true,
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <DashboardLayout title="Cutoshi | User Dashboard">
        <div className="p-3 flex flex-col gap-5">
          <div className="flex flex-col bg-background_card rounded-xl p-5 mb-5 shadow-md">
            <p className="text text-black text-xl lg:text-3xl font-bold uppercase font-playfair mb-9">
              ${TOKEN_SYMBOL} {t('token_balances')}
            </p>
            <div className="w-full h-[2px] bg-white mb-9"></div>
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex flex-col flex-1 gap-0.5">
                <p className="text text-black text-lg lg:text-2xl font-semibold">
                  {t('tokens_purchase')}
                </p>
                <p className="text text-black text-xl lg:text-3xl">
                  {thousandsFormat(balance?.balance)}
                </p>
              </div>
              <div className="flex flex-col flex-1 gap-0.5">
                <p className="text text-black text-lg lg:text-2xl font-semibold">
                  {t('referral_tokens')}
                </p>
                <p className="text text-black text-xl lg:text-3xl">
                  {thousandsFormat(balance?.refBalance)}
                </p>
              </div>
              <div className="flex flex-col flex-1 gap-0.5">
                <p className="text text-black text-lg lg:text-2xl font-semibold">
                  {t('bonus_tokens')}
                </p>
                <p className="text text-black text-xl lg:text-3xl">
                  {thousandsFormat(balance?.bonusBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white h-auto block rounded-xl">
            <Table
              data={data}
              options={options}
              onOptionsChange={setOptions}
              table={table}
              totalPages={totalPages}
              loading={loading}
            />
          </div>
        </div>
      </DashboardLayout>

      <PayingPayment
        disableViewTransaction
        closeModal={() => {
          setModalPaymentDetail({ isOpen: false, data: undefined });
        }}
        isOpen={modalPaymentDetail.isOpen}
        data={modalPaymentDetail.data}
      />
    </>
  );
};

export default Transactions;

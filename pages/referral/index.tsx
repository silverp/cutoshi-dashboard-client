import axios from '@/pages/api/axios';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import toast from '@/helpers/toast';
import { Paging, Referral } from '@/types';
import Image from 'next/image';
import { useAppSelector } from '@/hooks/useConnect';
import { useRouter } from 'next/router';
import Table from '@/components/table';
import { useDebounce } from '@/hooks/useDebounce';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { TOKEN_NAME } from '@/constants/information';
import UserReferral from '@/components/UserReferral';

const Referral = () => {
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const referralPercentage = useAppSelector(
    (state) => state.account?.referralOverView?.referralPercentage,
  );
  const user = useAppSelector((state) => state.account?.user);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [options, setOptions] = useState<{
    page: number;
    limit: number;
    filter: ColumnFiltersState;
  }>({ page: 1, limit: 10, filter: [] });

  const { t } = useTranslation();
  const [data, setData] = React.useState<Referral[]>([]);

  const columns = React.useMemo<ColumnDef<Referral>[]>(
    () => [
      {
        accessorKey: 'user',
        textStyle: 'justify-end text-black',
        enableColumnFilter: true,
        size: 220,
        header: () => <p className="line-clamp-2">{t('full_name')}</p>,
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className={'table-cell-child'}>
              {`${row.original.firstName} ${row.original.lastName}`}
            </div>
          );
        },
      },
      {
        accessorKey: 'refBalance',
        textStyle: 'justify-end text-black',
        size: 220,
        header: () => <p className="line-clamp-2">{t('earn_token')}</p>,
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className={'table-cell-child'}>
              {row.original.refBalance}
            </div>
          );
        },
      },
      {
        accessorKey: 'refBalance',
        textStyle: 'justify-end text-black',
        size: 220,
        header: () => <p className="line-clamp-2">{t('register_date')}</p>,
        footer: (props) => props.column.id,
        cell: ({ row }) => {
          return (
            <div key={row.id} className={'table-cell-child'}>
              {moment(row.original.createdAt).format('DD-MM-YYYY HH:mm')}
            </div>
          );
        },
      },
    ],
    [t],
  );

  const dataQuery = useCallback(async (page: number, limit: number, filter: ColumnFiltersState) => {
    try {
      setLoading(true);
      let params: any = {
        page: page,
        limit: limit,
      };
      if (filter && filter.length) {
        const user = filter.find((e) => e.id === 'user')?.value;
        if (user !== '') params['fullName'] = user;
      }
      const res: Paging<Referral> = await axios.get('/users/me/referrals', {
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
    <DashboardLayout title="Cutoshi | User Dashboard">
      <div className="p-5 w-full">
        <div className={classNames('flex m-2 flex-col h-full max-w-[800px]')}>
          <div className="flex flex-col bg-background_card gap-4 py-3 px-4 rounded-lg">
            <div onClick={router.back} className="flex flex-row gap-1 cursor-pointer">
              <Image src="/svg/arrow-left.svg" width={15} height={15} alt="" />
              <p className="text-primary text-sm">{t('back')}</p>
            </div>

            <p className="text-black text-xl font-medium">{t('referral')}</p>

            <div className="flex flex-col gap-4 w-full mb-4">
              <p className="text-sm text-black">
                {t('earn_tokens_by_referring_friends_and_family', { value: TOKEN_NAME })}
              </p>
              <p className="text-sm text-black">
                {t('we_have_created_a_referral_system_that_benefits_everyone_who_takes_part')}
              </p>
              <p className="text-sm text-black">
                {t(
                  'when_friends_are_referred_they_will_receive_a_additional_tokens_bonus_on_their_first_purchase_you_as_the_referrer_will_receive_the_same_additional_tokens_bonus_from_that_purchase',
                  { value: referralPercentage },
                )}
              </p>
            </div>
            <p className="text-black text-xl font-medium">{t('referral')} URL</p>

            <UserReferral />
            <p className="text-black text-xl font-medium">{t('referral_list')}</p>
          </div>

          <div className="bg-white h-auto block">
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
      </div>
    </DashboardLayout>
  );
};
export default Referral;

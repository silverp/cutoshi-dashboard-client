import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { UrlObject } from 'url';

interface TabProps {
  tabs: Array<{ label: string; href: UrlObject; key: string }>;
  tabActive: string;
}

export const Tab = ({ tabs, tabActive }: TabProps) => {
  return (
    <div className="flex flex-row w-full gap-10 border-b border-b-primary">
      {tabs.map((e, index) => {
        const isActive = tabActive === e.key;
        return (
          <Link key={index} href={e.href}>
            <div className="relative pb-4">
              <p
                className={classNames(
                  'text-sm font-bold',
                  isActive ? 'text-black' : ' text-black/40',
                )}
              >
                {e.label}
              </p>

              {isActive && <div className="absolute bottom-0 w-full h-1 bg-primary" />}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

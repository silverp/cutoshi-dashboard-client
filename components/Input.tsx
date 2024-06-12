import classNames from 'classnames';
import Image from 'next/image';
import React, { ReactNode, useState } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  editable?: boolean;
  require?: boolean;
  leftItem?: ReactNode;
  type?: string;
  security?: boolean;
  renderRight?: any;
  changeText?: (value: string) => void;
}
export const Input = ({
  label,
  editable = true,
  value,
  require,
  type = 'text',
  security = false,
  leftItem,
  renderRight,
  placeholder,
  changeText,
}: InputProps) => {
  const [isShowingPassword, setShowingPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2 relative">
      {require && (
        <p className="text-primary absolute top-0" style={{ right: -10 }}>
          *
        </p>
      )}

      {label && <p className="text-black text-sm">{label}</p>}

      {!editable ? (
        <div className="block-input bg-white/60">
          <div>
            <p className={classNames('text-sm truncate', value ? 'text-black' : 'text-black/80')}>
              {(!security && value) || placeholder}
            </p>
          </div>
          {renderRight && renderRight()}
          {security && (
            <div className="flex-1 justify-end flex">
              <Image src="/show-password-eye-gray.svg" alt="Icon" width={24} height={24} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-row h-fit w-full relative ">
          {leftItem}
          <input
            autoComplete="off"
            type={security && !isShowingPassword ? 'password' : type}
            placeholder={placeholder}
            value={value}
            onChange={(event) => changeText?.(event.target.value)}
            className="block-input"
          />
          {security && (
            <button
              type="button"
              onMouseDown={() => setShowingPassword(true)}
              onMouseLeave={() => setShowingPassword(false)}
              onMouseUp={() => setShowingPassword(false)}
              className="absolute right-4 z-0 top-0 bottom-0 m-auto h-full"
            >
              <Image src="/show-password-eye-gray.svg" alt="Icon" width={24} height={24} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

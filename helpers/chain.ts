export interface Chain {
  icon: string;
  label: string;
  value: string;
}

export const chains: Array<Chain> = [
  {
    icon: '/svg/eth.svg',
    label: 'Ethereum (ETH)',
    value: 'ETH',
  },
  {
    icon: '/svg/bnbbsc.svg',
    label: 'Binance Smart Chain - BEP20 (BNBBSC)',
    value: 'BNBBSC',
  },
  {
    icon: '/svg/usdterc20.svg',
    label: 'Tether ERC-20(USDTERC20)',
    value: 'USDTERC20',
  },
  {
    icon: '/svg/usdttrc20.svg',
    label: 'Tether TRC-20(USDTTRC20))',
    value: 'USDTTRC20',
  },
  {
    icon: '/svg/btc.svg',
    label: 'Bitcoin (BTC)',
    value: 'BTC',
  },
  {
    icon: '/svg/bnbmainnet.svg',
    label: 'Binance Coin Mainnet (BNBMAINNET)',
    value: 'BNBMAINNET',
  },
  {
    icon: '/svg/doge.svg',
    label: 'Dogecoin (DOGE)',
    value: 'DOGE',
  },
  {
    icon: '/svg/shib.svg',
    label: 'Shiba Inu (SHIB)',
    value: 'SHIB',
  },
  {
    icon: '/svg/sol.svg',
    label: 'Solana (SOL)',
    value: 'SOL',
  },
  {
    icon: '/svg/sand.svg',
    label: 'The Sandbox (SAND)',
    value: 'SAND',
  },
  {
    icon: '/svg/mana.svg',
    label: 'Decentraland (MANA)',
    value: 'MANA',
  },
];

type TBlockchain =
  | "Osmosis"
  | "Ethereum"
  | "Arbitrum"
  | "Zilliqa"
  | "Neo"
  | string;

const PRIORITY_MAP: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

interface IWalletBalance {
  currency: string;
  amount: number;
  blockchain: TBlockchain;
}

interface WalletBalanceListProps {
  balances: IWalletBalance[];
  prices: Record<string, number>;
}

const getPriority = (blockchain: string): number => {
  return PRIORITY_MAP[blockchain] ?? -99;
};

const WalletBalanceList: React.FC<WalletBalanceListProps> = ({
  balances,
  prices,
}) => {
  return (
    <>
      {balances.map((balance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        const formattedAmount = balance.amount.toFixed(2);

        return (
          <WalletRow
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={formattedAmount}
          />
        );
      })}
    </>
  );
};

const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: IWalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort(
        (lhs: IWalletBalance, rhs: IWalletBalance) =>
          getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
      );
  }, [balances]);

  return (
    <div {...rest}>
      <WalletBalanceList balances={sortedBalances} prices={prices} />
    </div>
  );
};

export default WalletPage;

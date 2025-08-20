// Missing blockchain
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// extend from empty object => unnecessary 
interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // We can move this to outside of component and rewrite it
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // lhsPriority was not define, this will break the app => use balancePriority instead
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            // Do we allow to 0 balance
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // blockchain does not exist on WalletBalance
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        //  Missing default return (equal case) => Should return 0 to avoid unstable sort
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]); // prices is not used in this memo => can be removed from deps

  // formattedBalances was create but never use
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(), // Can we add toFixed(2)
    };
  });

  const rows = sortedBalances.map(
    // This should be WalletBalance instead of FormattedWalletBalance
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // use index as Key might be a problem if the data has been change
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted} // WalletBalance dont have formatted
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};

//Missing export default component
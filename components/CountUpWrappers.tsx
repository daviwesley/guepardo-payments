import CountUpNumber from './CountUpNumber';

interface CountUpCurrencyProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function CountUpCurrency({ value, duration = 2, delay = 0, className }: CountUpCurrencyProps) {
  const formatter = (num: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  return (
    <CountUpNumber
      to={value}
      duration={duration}
      delay={delay}
      className={className}
      formatter={formatter}
    />
  );
}

interface CountUpIntegerProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function CountUpInteger({ value, duration = 2, delay = 0, className }: CountUpIntegerProps) {
  const formatter = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(Math.round(num));
  };

  return (
    <CountUpNumber
      to={value}
      duration={duration}
      delay={delay}
      className={className}
      formatter={formatter}
    />
  );
}
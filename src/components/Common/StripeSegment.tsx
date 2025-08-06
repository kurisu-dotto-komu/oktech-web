import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function StripeSegment({ children, className = "" }: Props) {
  return (
    <section
      className={`bg-primary/20 py-50 ${className} [clip-path:polygon(0_5%,100%_0,100%_95%,0_100%)] sm:[clip-path:polygon(0_10%,100%_0,100%_90%,0_100%)] md:[clip-path:polygon(0_15%,100%_0,100%_85%,0_100%)]`}
    >
      {children}
    </section>
  );
}

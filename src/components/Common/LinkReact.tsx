import { forwardRef } from "react";
import { resolveInternalHref } from "@/utils/urlResolver";

export interface LinkReactProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const LinkReact = forwardRef<HTMLAnchorElement, LinkReactProps>(
  function LinkReact({ href, children, ...rest }, ref) {
    const finalHref = resolveInternalHref(href);

    return (
      <a ref={ref} href={finalHref} {...rest}>
        {children}
      </a>
    );
  }
);

export default LinkReact;

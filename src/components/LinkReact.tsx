import React from "react";
import { resolveHref } from "../utils/resolveHref";

export interface LinkReactProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

/**
 * React equivalent of `Link.astro`. Prepends `import.meta.env.BASE_URL` to
 * internal links and filters out duplicate slashes.
 */
const LinkReact = React.forwardRef<HTMLAnchorElement, LinkReactProps>(
  ({ href, children, ...rest }, ref) => {
    const finalHref = resolveHref(href);

    return (
      <a ref={ref} href={finalHref} {...rest}>
        {children}
      </a>
    );
  },
);

export default LinkReact;

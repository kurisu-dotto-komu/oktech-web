/**
 * Safari (WebKit bug 199134) ignores prefers-color-scheme rules when an SVG is embedded via <img>.
 * That breaks our multi-theme logos specifically on iOS Safari. Instead of duplicating assets,
 * we ship the normal SVG for most browsers and fall back to an inline React version with JS-managed
 * CSS variables only on iOS Safari. Research references:
 *  - https://bugs.webkit.org/show_bug.cgi?id=199134
 *  - https://mediaformat.org/2025/03/light-dark-limitations/
 */
import {
  type ComponentType,
  type ImgHTMLAttributes,
  type SVGProps,
  useEffect,
  useMemo,
  useState,
} from "react";

type VariableDefinition = {
  name: string;
  light: string;
  dark: string;
};

type SafariIOSDarkdmodeBugfixProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  imgSrc: string;
  Svg: ComponentType<SVGProps<SVGSVGElement>>;
  variables: VariableDefinition[];
};

function isIOSSafari(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const ua = navigator.userAgent;
  const isIOS = /iP(hone|od|ad)/.test(ua);
  const isSafari = /Safari/i.test(ua) && !/(CriOS|FxiOS|EdgiOS)/.test(ua);
  return isIOS && isSafari;
}

function getInitialIsDark(needsPatch: boolean) {
  if (!needsPatch || typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function SafariIOSDarkdmodeBugfix({
  imgSrc,
  Svg,
  variables,
  className,
  style,
  alt,
  role,
  "aria-hidden": ariaHidden,
  ...imgProps
}: SafariIOSDarkdmodeBugfixProps) {
  const needsPatch = useMemo(isIOSSafari, []);
  const [isDark, setIsDark] = useState(() => getInitialIsDark(needsPatch));

  useEffect(() => {
    if (!needsPatch || typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      setIsDark(mediaQuery.matches);
    };

    handleChange();

    // WebKit bug 199134 prevents prefers-color-scheme CSS inside an <img> SVG from applying.
    // Community write-ups (e.g. https://mediaformat.org/2025/03/light-dark-limitations/) confirm
    // the issue persists, so we mirror the behavior manually when embedded inline.
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [needsPatch]);

  if (!needsPatch) {
    return <img src={imgSrc} className={className} style={style} alt={alt} role={role} aria-hidden={ariaHidden} {...imgProps} />;
  }

  const variableStyle = variables.reduce<Record<string, string>>((acc, { name, light, dark }) => {
    acc[name] = isDark ? dark : light;
    return acc;
  }, {});

  const svgStyle = { ...style, ...variableStyle } as SVGProps<SVGSVGElement>["style"];

  return (
    <Svg
      className={className}
      style={svgStyle}
      role={role ?? (alt ? "img" : undefined)}
      aria-label={alt}
      aria-hidden={ariaHidden}
    />
  );
}

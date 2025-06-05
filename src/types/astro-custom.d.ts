/// <reference types="astro/client" />

declare module "astro-icon/components" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function Icon(props: any): any;
}

declare module "astro:assets" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Image: (props: any) => any;
}
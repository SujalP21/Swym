import type { PropsWithChildren } from "react";

export const PageContainer = ({ children }: PropsWithChildren) => (
  <section className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8">{children}</section>
);

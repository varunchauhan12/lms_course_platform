import { ReactNode } from "react";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={'flex items-center justify-center relative min-h-svh'}>
      <div className={'flex flex-col gap-6 max-w-sm w-full'}>{children}</div>
    </div>
  );
}


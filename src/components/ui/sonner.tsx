'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner className="toaster group" toastOptions={{ classNames: { toast: 'group toast px-4 py-3' } }} {...props} />;
};

export { Toaster };

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:dark:bg-black group-[.toaster]:bg-white group-[.toaster]:dark:text-white group-[.toaster]:text-black group-[.toaster]:border group-[.toaster]:dark:border-white group-[.toaster]:border-black group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-neutral-500",
          actionButton:
            "group-[.toast]:bg-neutral-900 group-[.toast]:text-neutral-50",
          cancelButton:
            "group-[.toast]:bg-neutral-100 group-[.toast]:text-neutral-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

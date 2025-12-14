import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

const Toaster = ({
  ...props
}) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      closeButton
      duration={3000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-slate-600",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600",
          success: "group-[.toaster]:bg-green-50 group-[.toaster]:border-green-200 group-[.toaster]:text-green-800",
          error: "group-[.toaster]:bg-red-50 group-[.toaster]:border-red-200 group-[.toaster]:text-red-800",
          warning: "group-[.toaster]:bg-blue-50 group-[.toaster]:border-blue-200 group-[.toaster]:text-blue-800",
          info: "group-[.toaster]:bg-blue-50 group-[.toaster]:border-blue-200 group-[.toaster]:text-blue-800",
        },
      }}
      {...props} />
  );
}

export { Toaster, toast }

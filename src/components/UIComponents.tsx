import React, {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from "react";

interface AlertProps {
  children: ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = "default",
}) => {
  const bgColor = variant === "destructive" ? "bg-red-100" : "bg-blue-100";
  const textColor =
    variant === "destructive" ? "text-red-800" : "text-blue-800";

  return (
    <div className={`p-4 ${bgColor} ${textColor} rounded-md`}>{children}</div>
  );
};

interface AlertTitleProps {
  children: ReactNode;
}

export const AlertTitle: React.FC<AlertTitleProps> = ({ children }) => (
  <h5 className="font-medium mb-1">{children}</h5>
);

interface AlertDescriptionProps {
  children: ReactNode;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
}) => <p className="text-sm">{children}</p>;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => (
  <button
    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} text-black`}
      ref={ref}
      {...props}
    />
  )
);

Input.displayName = "Input";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  htmlFor: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  ...props
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 mb-1"
    {...props}
  >
    {children}
  </label>
);

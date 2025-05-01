import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  fullWidth = false,
  size = "default", // new prop: small, default, large
  icon = null, // new prop: icon component
}) => {
  const { darkMode } = useContext(ThemeContext);

  const variants = {
    primary: `${
      darkMode
        ? "bg-indigo-700 hover:bg-indigo-800 text-white"
        : "bg-indigo-600 hover:bg-indigo-700 text-white"
    }`,
    secondary: `${
      darkMode
        ? "bg-gray-700 hover:bg-gray-800 text-white"
        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
    }`,
    success: `${
      darkMode
        ? "bg-green-700 hover:bg-green-800 text-white"
        : "bg-green-500 hover:bg-green-600 text-white"
    }`,
    danger: `${
      darkMode
        ? "bg-red-700 hover:bg-red-800 text-white"
        : "bg-red-500 hover:bg-red-600 text-white"
    }`,
    outline: `${
      darkMode
        ? "bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-900"
        : "bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
    }`,
  };

  const sizes = {
    small: "px-3 py-1 text-sm",
    default: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      className={`
        ${sizes[size]}
        rounded-md font-medium transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        ${variants[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${fullWidth ? "w-full" : ""}
        ${icon ? "flex items-center justify-center" : ""}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;

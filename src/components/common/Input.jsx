import { forwardRef, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      placeholder,
      error,
      className = "",
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const { darkMode } = useContext(ThemeContext);

    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className={`block text-sm font-medium mb-1 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 rounded-md shadow-sm
            transition-colors duration-200
            focus:outline-none focus:ring-2
            ${
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "focus:ring-indigo-500 focus:border-indigo-500"
            }
            ${
              disabled
                ? darkMode
                  ? "bg-gray-700 text-gray-400 border-gray-600"
                  : "bg-gray-100 text-gray-500 border-gray-300"
                : darkMode
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300"
            }
          `}
          {...rest}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

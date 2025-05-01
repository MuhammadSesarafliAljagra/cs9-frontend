import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const PageContainer = ({
  children,
  title,
  subtitle,
  actions,
  className = "",
  contentClass = "",
}) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`animate-fadeIn ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-6">
          <div>
            {title && (
              <h1
                className={`text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                className={`mt-2 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>

          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={contentClass}>{children}</div>
    </div>
  );
};

export default PageContainer;

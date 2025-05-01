const Section = ({
  title,
  linkTo,
  linkText = "View all",
  className = "",
  children,
  animationDelay = "",
}) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <section className={`animate-fadeUp ${animationDelay} ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl md:text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </h2>
        {linkTo && (
          <Link
            to={linkTo}
            className={`flex items-center ${
              darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            }`}
          >
            {linkText} <BsArrowRight className="ml-2" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
};
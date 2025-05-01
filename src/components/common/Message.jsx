const Message = ({ type = "info", children }) => {
  const styles = {
    success:
      "bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300",
    error:
      "bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300",
    warning:
      "bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300",
    info: "bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300",
  };

  return (
    <div className={`px-4 py-3 rounded my-4 border ${styles[type]}`}>
      {children}
    </div>
  );
};

export default Message;

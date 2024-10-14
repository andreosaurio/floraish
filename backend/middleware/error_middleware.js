const handleNotFound = (req, res, next) => {
    res.status(404).json({
      status: "fail",
      message: `La URL solicitada no se ha encontrado ${req.originalUrl}.`,
    });
  };
  
  const globalErrorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    res.status(statusCode).json({
      status: "error",
      error: err.name || "Server Error",
      message: err.message || "An unexpected error occurred",
    });
  };
  
  export { handleNotFound, globalErrorHandler };
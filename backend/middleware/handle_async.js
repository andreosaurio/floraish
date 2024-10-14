const handle_async = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default handle_async;
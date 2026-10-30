type Handler = (req: { url: string }) => string;
const routes: Record<string, Handler> = {};

function get(path: string, h: Handler) {
  routes[path] = h;
}

get("/users", (req) => {
  return "users " + req.url;
});

get("/orders", (req) => {
  return "orders: " + req.url;
});

export { routes };

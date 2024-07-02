import Home from "../pages/home";
import Orders from "../pages/orders";
import Products from "../pages/products";
import Analytics from "../pages/analytics";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/analytics",
    element: <Analytics />,
  },
];

export default routes;

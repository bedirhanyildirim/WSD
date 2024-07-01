import Home from "../pages/home";
import Orders from "../pages/orders";
import Products from "../pages/products";

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
];

export default routes;

import { useRoutes } from "react-router-dom";
import routes from "./routers/index";

function App() {
  return useRoutes(routes);
}

export default App;

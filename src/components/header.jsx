import { useDispatch } from "react-redux";
import { setSelectedCountry } from "../store/countrySlice";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export const Header = () => {
  const dispatch = useDispatch();

  const handleSelectChange = (e) => {
    dispatch(setSelectedCountry(e.target.value));
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="w-full flex items-center justify-between px-2 py-4">
          <a href="/">
            <img src={logo} width={140} alt="Orzax Logo png" />
          </a>
          <select
            className="p-2 w-44 border border-zinc-300 rounded"
            defaultValue={
              localStorage.getItem("selectedCountry") || "orzax-inc"
            }
            onChange={handleSelectChange}
          >
            <option value="orzax-inc">USA | Orzax Inc.</option>
            <option value="orzax-ltd">UK | Orzax Ltd.</option>
            <option value="orzax-gmbh">D | Orzax GmbH</option>
            <option value="orzax-spzoo">PL | Orzax Sp. z o.o.</option>
          </select>
        </div>
        <Navbar />
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="w-full px-4 py-3 border-b">
      <ul className="flex gap-10 items-center justify-center">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
      </ul>
    </div>
  );
};

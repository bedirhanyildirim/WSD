/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import logo from "../assets/logo.png";

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState("orzax-inc");

  return (
    <>
      <Header setSelectedCompany={setSelectedCompany} />
    </>
  );
}

export const Header = ({ setSelectedCompany }) => {
  const handleSelectChange = (e) => {
    setSelectedCompany(e.target.value);
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
            defaultValue="orzax-inc"
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
          <a href="/">Dashboard</a>
        </li>
        <li>
          <a href="/products">Products</a>
        </li>
        <li>
          <a href="/orders">Orders</a>
        </li>
      </ul>
    </div>
  );
};

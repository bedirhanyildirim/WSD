/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Loader, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";

const currencyMap = {
  "orzax-inc": "$",
  "orzax-ltd": "£",
  "orzax-spzoo": "PLN",
  "orzax-gmbh": "€",
};

const isDataStale = (lastFetchTime, maxAgeMinutes) => {
  const now = new Date();
  const lastFetch = new Date(lastFetchTime);
  const diffMs = now - lastFetch;
  const diffMins = Math.floor(diffMs / 60000);
  return diffMins > maxAgeMinutes;
};

export default function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const [selectedCompany, setSelectedCompany] = useState("orzax-inc");

  const defaultCurrency = currencyMap[selectedCompany] || "$";

  useEffect(() => {
    const cachedProducts = JSON.parse(localStorage.getItem("products"));
    const lastFetchTime = localStorage.getItem("fetchTime");

    if (cachedProducts && lastFetchTime && !isDataStale(lastFetchTime, 15)) {
      // Cache'deki verileri kullan
      dispatch({
        type: "products/fetchProducts/fulfilled",
        payload: cachedProducts,
      });
    } else {
      // Verileri yeniden fetch et
      dispatch(fetchProducts());
    }
  }, [dispatch]);

  return (
    <>
      <Header setSelectedCompany={setSelectedCompany} />
      <div className="w-full max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Ürünler</h1>
        {productStatus === "loading" ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin" />
            <p className="ml-2">Veriler yükleniyor...</p>
          </div>
        ) : productStatus === "succeeded" ? (
          <ProductTable products={products} defaultCurrency={defaultCurrency} />
        ) : productStatus === "failed" ? (
          <div>{error}</div>
        ) : null}
      </div>
    </>
  );
}

const getUniqueCategories = (categories) => {
  const uniqueCategories = [
    ...new Set(categories.map((category) => decodeHtml(category.name))),
  ];
  return uniqueCategories.join(", ");
};

const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value.replace(/&amp;/g, "&");
};

const Header = ({ setSelectedCompany }) => {
  const handleSelectChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl px-2 py-4 flex items-center justify-between gap-4">
        <img src={logo} width={140} alt="Orzax Logo png" />
        <select
          className="p-2 w-44 border border-zinc-300 rounded"
          defaultValue="orzax-inc"
          onChange={handleSelectChange}
        >
          <option value="orzax-inc">Orzax Inc.</option>
          <option value="orzax-ltd">Orzax Ltd.</option>
          <option value="orzax-gmbh">Orzax GmbH</option>
          <option value="orzax-spzoo">Orzax Sp. z o.o.</option>
        </select>
      </div>
    </div>
  );
};

const ProductTable = ({ products, defaultCurrency }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">ID</th>
          <th className="py-2 px-4 border-b">İsim</th>
          <th className="py-2 px-4 border-b">Fiyat</th>
          <th className="py-2 px-4 border-b">Stok Durumu</th>
          <th className="py-2 px-4 border-b">Kategoriler</th>
          <th className="py-2 px-4 border-b">Görseller</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td className="py-2 px-4 border-b">{product.id}</td>
            <td className="py-2 px-4 border-b">{decodeHtml(product.name)}</td>
            <td className="py-2 px-4 border-b whitespace-nowrap">
              {defaultCurrency} {product.price}
            </td>
            <td className="py-2 px-4 border-b text-center">
              <div className="flex justify-center items-center">
                {product.stock_status === "instock" ? (
                  <Check color="green" />
                ) : (
                  <X color="red" />
                )}
              </div>
            </td>
            <td className="py-2 px-4 border-b">
              {getUniqueCategories(product.categories)}
            </td>
            <td className="py-2 px-4 border-b">
              {product.images.length > 0 && (
                <img
                  key={product.images[0].id}
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  width={50}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

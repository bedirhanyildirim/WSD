/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Loader, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { Header } from "../components/theme/header";
import {
  isDataStale,
  currencyMap,
  getUniqueCategories,
  decodeHtml,
} from "../lib/utils";

export default function Products() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const selectedCompany = useSelector((state) => state.country.selectedCountry);

  const defaultCurrency = currencyMap[selectedCompany] || "$";

  useEffect(() => {
    const cachedProducts = JSON.parse(
      localStorage.getItem(`${selectedCompany}_products`)
    );
    const lastFetchTime = localStorage.getItem(`${selectedCompany}_fetchTime`);

    if (cachedProducts && lastFetchTime && !isDataStale(lastFetchTime, 15)) {
      dispatch({
        type: "products/fetchProducts/fulfilled",
        payload: cachedProducts,
      });
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch, selectedCompany]);

  return (
    <>
      <Header />
      <div className="w-full max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
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

const ProductTable = ({ products, defaultCurrency }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">ID</th>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Price</th>
          <th className="py-2 px-4 border-b">Stock</th>
          <th className="py-2 px-4 border-b">Categories</th>
          <th className="py-2 px-4 border-b">Image</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td className="py-2 px-4 border-b text-center">
              <a
                href={
                  import.meta.env.VITE_URL +
                  "/wp-admin/post.php?post=" +
                  product.id +
                  "&action=edit"
                }
                target="_blank"
                className="underline text-blue-700"
              >
                {product.id}
              </a>
            </td>
            <td className="py-2 px-4 border-b">{decodeHtml(product.name)}</td>
            <td className="py-2 px-4 border-b whitespace-nowrap text-center">
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
            <td className="py-2 px-4 border-b text-center">
              <div className="flex justify-center items-center aspect-square">
                {product.images.length > 0 && (
                  <img
                    key={product.images[0].id}
                    src={product.images[0].src}
                    alt={product.images[0].alt}
                    width={500}
                  />
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

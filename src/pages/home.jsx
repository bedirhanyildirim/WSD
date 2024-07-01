/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Check, X } from "lucide-react";

const apiUrl = import.meta.env.VITE_URL + "/wp-json/wc/v3/products";
const consumerKey = import.meta.env.VITE_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_CONSUMER_SECRET;

const fetchProducts = async () => {
  const auth = {
    username: consumerKey,
    password: consumerSecret,
  };

  try {
    const response = await axios.get(apiUrl, {
      params: {
        per_page: 100,
      },
      auth,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

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

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      const productsData = await fetchProducts();
      setProducts(productsData);
      setLoading(false);
    };

    fetchProductsData();
  }, []);

  return (
    <>
      <Header />
      <div className="w-full max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Son 20 Ürün</h1>
        {loading ? (
          <p>Veriler yükleniyor...</p>
        ) : (
          <ProductTable products={products} />
        )}
      </div>
    </>
  );
}

const Header = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl px-2 py-4 flex items-center justify-between gap-4">
        <img src={logo} width={140} alt="Orzax Logo png" />
        <select
          className="p-2 w-44 border border-zinc-300 rounded"
          defaultValue="orzax-inc"
        >
          <option value="orzax-inc">Orzax Inc.</option>
          <option value="orzax-ltd">Orzax Ltd.</option>
          <option value="orzax-spzoo">Orzax Sp. z o.o.</option>
        </select>
      </div>
    </div>
  );
};

const ProductTable = ({ products }) => {
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
            <td className="py-2 px-4 border-b">
              {product.price} {product.currency}
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

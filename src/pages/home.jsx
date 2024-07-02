/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { fetchProducts } from "../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { currencyMap, isDataStale } from "../lib/utils";
import { Loader } from "lucide-react";

export default function Home() {
  const dispatch = useDispatch();
  const [bundleProductCount, setBundleProductCount] = useState(0);
  const [singleProductCount, setSingleProductCount] = useState(0);
  const [draftProductCount, setDraftProductCount] = useState(0);
  const products = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const productError = useSelector((state) => state.products.error);
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
      dispatch(fetchProducts(selectedCompany));
    }
  }, [dispatch, selectedCompany]);

  useEffect(() => {
    if (products.length > 0) {
      const bundlesCount = products.filter((p) =>
        p.categories.some((c) => c.slug === "bundles")
      ).length;

      const drafts = products.filter((p) => p.status === "draft");

      const nonBundlesCount = products.length - bundlesCount;
      setBundleProductCount(bundlesCount);
      setSingleProductCount(nonBundlesCount);
      setDraftProductCount(drafts.length);
    }
  }, [products]);

  return (
    <>
      <Header />
      <div className="w-full flex justify-center">
        <div className="w-full max-w-5xl"></div>
      </div>
      {productStatus === "loading" ? (
        <div className="flex justify-center items-center p-4">
          <Loader className="animate-spin" />
          <p className="ml-2">Veriler yükleniyor...</p>
        </div>
      ) : productStatus === "succeeded" ? (
        <div className="flex flex-col gap-4">
          <TimePeriedButtonGroup />
          <KPIwrapper
            productCount={products.length}
            singleProductCount={singleProductCount}
            bundleProductCount={bundleProductCount}
            draftProductCount={draftProductCount}
          />
        </div>
      ) : productStatus === "failed" ? (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-5xl p-4">{productError}</div>
        </div>
      ) : null}
    </>
  );
}

const TimePeriedButtonGroup = () => {
  return (
    <div className="w-full flex justify-center mt-4">
      <div className="w-full max-w-5xl">
        <div className="w-full flex gap-4">
          <div className="text-sm bg-slate-100 border border-slate-200 rounded py-1.5 px-3 hover:bg-slate-200 hover:cursor-pointer">
            Today
          </div>
          <div className="text-sm bg-slate-100 border border-slate-200 rounded py-1.5 px-3 hover:bg-slate-200 hover:cursor-pointer">
            This Week
          </div>
          <div className="text-sm bg-slate-100 border border-slate-200 rounded py-1.5 px-3 hover:bg-slate-200 hover:cursor-pointer">
            This Month
          </div>
          <div className="text-sm bg-slate-100 border border-slate-200 rounded py-1.5 px-3 hover:bg-slate-200 hover:cursor-pointer">
            Last 7 Days
          </div>
          <div className="text-sm bg-slate-100 border border-slate-200 rounded py-1.5 px-3 hover:bg-slate-200 hover:cursor-pointer">
            Last 30 Days
          </div>
          <div className="text-sm bg-slate-100 border border-slate-200 rounded py-1.5 px-3 hover:bg-slate-200 hover:cursor-pointer">
            Last 31 Days
          </div>
        </div>
      </div>
    </div>
  );
};

const KPIwrapper = ({
  productCount,
  singleProductCount,
  bundleProductCount,
  draftProductCount,
}) => {
  const totalPrductSubTitle = `Total ${productCount} with drafts`;
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="w-full grid gap-2 grid-cols-3">
          <KPIbox
            title="Products on Sale"
            value={productCount - draftProductCount}
            subtitle={totalPrductSubTitle}
          />
          <KPIbox title="Singel Products" value={singleProductCount} />
          <KPIbox title="Bundles" value={bundleProductCount} />
          <KPIbox title="Gross sales" value="$1,804.97" />
          <KPIbox title="Net sales" value="$1,432.68" />
          <KPIbox title="Coupons" value="$20,00" />
          <KPIbox title="Returns" value="$0,00" />
          <KPIbox title="Taxes" value="$0,00" />
          <KPIbox title="Shipping" value="$200,00" />
          <KPIbox title="Total Orders" value="66" />
          <KPIbox title="Total Products Sold" value="80" />
          <KPIbox title="Items Per Order" value="1.22" />
          <KPIbox title="Total Subscription" value="16" />
          <KPIbox title="New Subscription" value="2" />
          <KPIbox title="Canceled Subscription" value="1" />
        </div>
      </div>
    </div>
  );
};

const KPIbox = ({ title = "", value = "", subtitle = "" }) => {
  return (
    <div className="w-full flex flex-col p-4 bg-slate-100 border border-slate-200 rounded gap-2">
      <div className="text-sm text-gray-700">{title}</div>
      <div className="text-4xl">{value}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
    </div>
  );
};

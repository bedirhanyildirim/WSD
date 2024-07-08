import { useDispatch, useSelector } from "react-redux";
import { fetchUSAOrders, fetchUSAProducts } from "../../store/usaSlice";
import { useEffect, useState } from "react";
import { isDataStale } from "../../lib/utils";
import LoaderComponent from "../common/loader";

export default function USALiveDashboard() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.usa.products.items);
  const productStatus = useSelector((state) => state.usa.products.status);
  const productError = useSelector((state) => state.usa.products.error);

  const orders = useSelector((state) => state.usa.orders.items);
  const orderStatus = useSelector((state) => state.usa.orders.status);
  const orderError = useSelector((state) => state.usa.orders.error);

  const currency = "$";

  const [bundleProductCount, setBundleProductCount] = useState(0);
  const [singleProductCount, setSingleProductCount] = useState(0);
  const [draftProductCount, setDraftProductCount] = useState(0);

  // fetch data
  useEffect(() => {
    // fetch products
    const cachedProducts = JSON.parse(localStorage.getItem("usa_products"));
    const lastProductsFetchTime = localStorage.getItem("usa_fetchTime");
    if (
      cachedProducts &&
      lastProductsFetchTime &&
      !isDataStale(lastProductsFetchTime, 15)
    ) {
      dispatch({
        type: "usa/fetchProducts/fulfilled",
        payload: cachedProducts,
      });
    } else {
      dispatch(fetchUSAProducts());
    }

    // fetch orders
    const cachedOrders = JSON.parse(localStorage.getItem("usa_orders"));
    const orderLastFetchTime = localStorage.getItem("usa_ordersFetchTime");
    if (
      cachedOrders &&
      orderLastFetchTime &&
      !isDataStale(orderLastFetchTime, 15)
    ) {
      dispatch({ type: "usa/fetchOrders/fulfilled", payload: cachedOrders });
    } else {
      dispatch(fetchUSAOrders());
    }
  }, [dispatch]);

  // count of products
  useEffect(() => {
    if (products.length > 0) {
      // find bundles
      const bundlesCount = products.filter((p) =>
        p.categories.some((c) => c.slug === "bundles")
      ).length;
      // find drafts
      const drafts = products.filter((p) => p.status === "draft");
      // calculate singles
      const nonBundlesCount = products.length - bundlesCount;
      setBundleProductCount(bundlesCount);
      setSingleProductCount(nonBundlesCount);
      setDraftProductCount(drafts.length);
    }
  }, [products]);

  return (
    <div className="w-full flex flex-col gap-4">
      <TimePeriedButtonGroup />
      {productStatus === "loading" ? (
        <LoaderComponent />
      ) : productStatus === "succeeded" ? (
        <div className="flex flex-col gap-4">
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
    </div>
  );
}

const TimePeriedButtonGroup = () => {
  return (
    <div className="w-full flex justify-center">
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

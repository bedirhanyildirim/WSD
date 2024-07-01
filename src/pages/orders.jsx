/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../store/ordersSlice";
import { Loader } from "lucide-react";
import { Header } from "./home";

const isDataStale = (lastFetchTime, maxAgeMinutes) => {
  const now = new Date();
  const lastFetch = new Date(lastFetchTime);
  const diffMs = now - lastFetch;
  const diffMins = Math.floor(diffMs / 60000);
  return diffMins > maxAgeMinutes;
};

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.items);
  const orderStatus = useSelector((state) => state.orders.status);
  const orderError = useSelector((state) => state.orders.error);

  useEffect(() => {
    const cachedOrders = JSON.parse(localStorage.getItem("orders"));
    const orderLastFetchTime = localStorage.getItem("ordersFetchTime");

    if (
      cachedOrders &&
      orderLastFetchTime &&
      !isDataStale(orderLastFetchTime, 15)
    ) {
      // Cache'deki verileri kullan
      dispatch({ type: "orders/fetchOrders/fulfilled", payload: cachedOrders });
    } else {
      // Verileri yeniden fetch et
      dispatch(fetchOrders());
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="w-full max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        {orderStatus === "loading" ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin" />
            <p className="ml-2">Veriler yükleniyor...</p>
          </div>
        ) : orderStatus === "succeeded" ? (
          <OrderTable orders={orders} />
        ) : orderStatus === "failed" ? (
          <div>{orderError}</div>
        ) : null}
      </div>
    </>
  );
}

const OrderTable = ({ orders }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">ID</th>
          <th className="py-2 px-4 border-b">Müşteri Adı</th>
          <th className="py-2 px-4 border-b">Toplam</th>
          <th className="py-2 px-4 border-b">Durum</th>
          <th className="py-2 px-4 border-b">Tarih</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="py-2 px-4 border-b">{order.id}</td>
            <td className="py-2 px-4 border-b">
              {order.billing.first_name} {order.billing.last_name}
            </td>
            <td className="py-2 px-4 border-b">{order.total}</td>
            <td className="py-2 px-4 border-b">{order.status}</td>
            <td className="py-2 px-4 border-b">
              {new Date(order.date_created).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

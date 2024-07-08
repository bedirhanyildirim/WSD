import { Loader } from "lucide-react";

export default function LoaderComponent() {
  return (
    <div className="flex justify-center items-center p-4">
      <Loader className="animate-spin" />
      <p className="ml-2">Veriler yükleniyor...</p>
    </div>
  );
}

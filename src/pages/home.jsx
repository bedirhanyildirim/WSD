import logo from "../assets/logo.png";

export default function Home() {
  return (
    <>
      <Header />
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

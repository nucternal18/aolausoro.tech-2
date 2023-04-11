import Loader from "components/Loader";
export default function loading() {
  return (
    <section className="w-full h-[500px] flex justify-center items-center">
      <Loader classes="text-2xl" />
    </section>
  );
}

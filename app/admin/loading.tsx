import Loader from "components/Loader";
export default function loading() {
  return (
    <section className="w-full min-h-screen flex justify-center items-center">
      <Loader classes="w-8 h-8" />
    </section>
  );
}

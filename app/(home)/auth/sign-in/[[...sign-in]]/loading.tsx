import Loader from "@components/loader";
export default function loading() {
  return (
    <section className="w-full min-h-screen flex justify-center items-center">
      <Loader classes="h-8 w-8" />
    </section>
  );
}

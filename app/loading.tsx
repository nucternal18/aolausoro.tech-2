import Loader from "components/Loader";

export default function Loading() {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <Loader classes="w-12 h-12" />
    </section>
  );
}

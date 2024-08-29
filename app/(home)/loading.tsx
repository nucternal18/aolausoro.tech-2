import Loader from "@components/loader";

export default function Loading() {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <Loader classes="w-8 h-8" />
    </section>
  );
}

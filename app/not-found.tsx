export default function NotFound() {
  return (
    <>
      <section className="flex flex-col items-center mt-20">
        <h1 className="my-5 text-6xl text-gray-800">Whoops!</h1>
        <h2 className="mb-5 text-4xl text-gray-700">Not Found.</h2>
        <p className="mb-5 text-2xl text-gray-500">
          Could not find requested resource
        </p>
      </section>
    </>
  );
}

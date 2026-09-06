import Loader from '@components/Loader'
export default function loading() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center">
      <Loader classes="w-8 h-8" />
    </section>
  )
}

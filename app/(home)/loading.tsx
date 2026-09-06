import Loader from '@components/Loader'

export default function Loading() {
  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <Loader classes="w-8 h-8" />
    </section>
  )
}

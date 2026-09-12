function ErrorMessage({
  children,
  variant,
}: {
  children: React.ReactNode
  variant: 'success' | 'danger' | 'default'
}) {
  const color = {
    success: 'text-green-500 text-sm',
    danger: 'text-red-500 text-sm',
    default: 'text-yellow-500 text-sm',
  }
  return <div className={`${color[variant]} py-1 text-center font-medium italic`}>{children}</div>
}

export default ErrorMessage

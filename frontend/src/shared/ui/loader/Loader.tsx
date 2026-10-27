type LoaderProps = {
  label?: string
  size?: 'sm' | 'md'
}

const Loader = ({ label = 'Загрузка', size = 'md' }: LoaderProps) => (
  <span role="status" className="inline-flex shrink-0 align-middle">
    <span
      aria-hidden="true"
      className={`animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none ${size === 'sm' ? 'size-4' : 'size-6'}`}
    />
    <span className="sr-only">{label}</span>
  </span>
)

export default Loader

import { useParams } from 'react-router'

type PlaceholderPageProps = {
  title: string
}

// Temporary route content until the corresponding MVP pages are implemented.
const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  const { routeId, tripId } = useParams()
  const id = routeId ?? tripId

  return (
    <>
      <h1 className="text-xl leading-7 font-semibold">{title}</h1>
      {id && <p className="mt-2 text-sm text-muted">ID: {id}</p>}
    </>
  )
}

export default PlaceholderPage

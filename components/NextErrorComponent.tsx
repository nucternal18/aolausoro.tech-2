export default function NextErrorComponent({ statusCode }) {
    return (
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    )
  }

NextErrorComponent.getInitialProps = async ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    const hasGetInitialPropsRun = true
  return { statusCode, hasGetInitialPropsRun }
}
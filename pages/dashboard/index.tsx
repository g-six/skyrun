import { ReactElement } from 'react'
import AuthedLayout from 'components/authenticated'

export default function Dashboard() {
    return <div>Welcome</div>
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
      <AuthedLayout>{page}</AuthedLayout>
    )
}
  
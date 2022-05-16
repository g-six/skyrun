import { ReactElement } from 'react'
import { Tab } from '@headlessui/react'
import AuthedLayout from 'components/authenticated'

export default function Dashboard() {
    return <>
        <header className="hidden bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
            </div>
            {/* /End replace */}
          </div>
        </main>
    </>
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
      <AuthedLayout>{page}</AuthedLayout>
    )
}
  
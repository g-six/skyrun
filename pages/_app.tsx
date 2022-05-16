import 'styles/globals.css'
import { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

type NextPageWithLayout = NextPage & {
  getLayout?(page: ReactElement): ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function Skyrun({ Component }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page)

  return getLayout(<Component />)
}

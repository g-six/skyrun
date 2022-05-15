import { ReactElement } from 'react'
import { AppWrapper } from './authenticated'

export default function Layout({
  children,
}: {
  children: ReactElement
}) {
  return (
    <AppWrapper key="un-auth">
      <div className="h-screen">{children}</div>
    </AppWrapper>
  )
}

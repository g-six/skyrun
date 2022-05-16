import { ReactElement } from 'react';

type UIProps = {
    className?: string
}
export function LoginInfo({
    className,
}: UIProps): ReactElement {
    return <div className={`
    ${className}`}>
        <h2 className='font-bold text-2xl'>The login form</h2>
        <main>
            <p>Logging</p>
        </main>
    </div>
}
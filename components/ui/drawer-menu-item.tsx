import FeatherIcon from './feather-icon';

type Props = {
    label: string
    onClick(): void
}
export function DrawerMenuItem({ label, onClick }: Props) {
    return <button type='button' className='p-4 border-b font-semibold text-gray-900 flex justify-between items-center hover:bg-slate-800 hover:text-white transition-all ease-out duration-500' onClick={() => { onClick() }}>
        <span>{label}</span> <FeatherIcon icon='chevron-right' />
    </button>
}
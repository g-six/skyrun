import FeatherIcon from 'components/ui/feather-icon'

type Props = {
    label: string
    onClick(): void
}
export function DrawerMenuItem({ label, onClick }: Props) {
    return <button type='button' className='px-6 py-4 border-b border-t border-b-white font-semibold text-gray-900 flex justify-between items-center hover:bg-slate-800 hover:text-white transition-all ease-out duration-500' onClick={() => { onClick() }}>
        <span>{label}</span> <FeatherIcon icon='chevron-right' />
    </button>
}
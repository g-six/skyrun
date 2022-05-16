import { useRouter } from 'next/router'
import { DrawerMenuItem } from './drawer-menu-item'

export function Drawer() {
    const router = useRouter()
    return <div className="flex flex-col md:w-68 bg-white shadow">
        <DrawerMenuItem label='Dashboard' onClick={() => {
        router.push('/dashboard')
        }} />

        <DrawerMenuItem label='Repositories' onClick={() => {
        router.push('/repositories')
        }} />

        <DrawerMenuItem label='Experiences' onClick={() => {
        router.push('/experiences')
        }} />

        <DrawerMenuItem label='Skills' onClick={() => {
        router.push('/skills')
        }} />

        <DrawerMenuItem label='Achievements' onClick={() => {
        router.push('/achievements')
        }} />

        <DrawerMenuItem label='Past / Current Projects' onClick={() => {
        router.push('/projects')
        }} />

        <DrawerMenuItem label='Character References' onClick={() => {
        router.push('/references')
        }} />

        <DrawerMenuItem label='Interests' onClick={() => {
        router.push('/dashboard')
        }} />
    </div>
}

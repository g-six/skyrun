export type FeatherIconProps = {
    icon?: string
    dimensions?: number
}
export function FeatherIcon(p: FeatherIconProps) {
    return <svg
        width={p.dimensions || 18}
        height={p.dimensions || 18}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <use href={`/feather-sprite.svg#${p.icon || 'circle'}`}/>
    </svg>
}

export default FeatherIcon
import clsx from 'clsx'

const GRADIENTS = [
  'from-violet-400 to-violet-600',
  'from-blue-400 to-blue-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
  'from-cyan-400 to-cyan-600',
  'from-brand-400 to-brand-600',
  'from-orange-400 to-orange-600',
]

const SIZE = {
  xs:  'w-6 h-6 text-[10px]',
  sm:  'w-7 h-7 text-xs',
  md:  'w-8 h-8 text-xs',
  lg:  'w-10 h-10 text-sm',
  xl:  'w-12 h-12 text-base',
  '2xl': 'w-16 h-16 text-xl',
}

function getGradient(name = '') {
  const code = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return GRADIENTS[code % GRADIENTS.length]
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

export default function Avatar({ name = '', src, size = 'md', className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx('rounded-full object-cover shrink-0', SIZE[size], className)}
      />
    )
  }

  return (
    <div
      title={name}
      className={clsx(
        'rounded-full flex items-center justify-center font-bold text-white shrink-0 select-none',
        `bg-gradient-to-br ${getGradient(name)}`,
        SIZE[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}

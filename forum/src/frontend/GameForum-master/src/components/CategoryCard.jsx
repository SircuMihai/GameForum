import { Scroll, Swords, Flag, Handshake, Wrench, ChevronRight } from 'lucide-react'

export function CategoryCard({
  title,
  description,
  iconName,
  topicCount,
  postCount,
  backgroundImage,
  index,
}) {
  const getIcon = () => {
    const props = { className: 'w-8 h-8 text-gold-500' }
    switch (iconName) {
      case 'Swords':
        return <Swords {...props} />
      case 'Flag':
        return <Flag {...props} />
      case 'Handshake':
        return <Handshake {...props} />
      case 'Wrench':
        return <Wrench {...props} />
      default:
        return <Scroll {...props} />
    }
  }

  return (
    <div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="relative h-full overflow-hidden rounded-sm border-2 border-wood-600 bg-wood-900 shadow-lg transition-all duration-300 group-hover:border-gold-500 group-hover:shadow-glow-bronze group-hover:-translate-y-1">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
            draggable={false}
          />
          <div className="absolute inset-0 bg-linear-to-t from-wood-900 via-wood-900/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-wood-800/80 border border-gold-700 rounded-full shadow-inner-wood group-hover:bg-wood-800 group-hover:border-gold-500 transition-colors">
              {getIcon()}
            </div>
            <ChevronRight className="text-wood-600 group-hover:text-gold-500 transition-colors transform group-hover:translate-x-1" />
          </div>

          <h3 className="text-xl font-display font-bold text-parchment-200 mb-2 group-hover:text-gold-400 transition-colors text-shadow-black">
            {title}
          </h3>

          <p className="text-parchment-400 text-sm font-serif leading-relaxed mb-6 grow">
            {description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-wood-700/50 text-xs font-bold uppercase tracking-wider text-bronze-500">
            <div className="flex gap-4">
              <span>{Number(topicCount || 0).toLocaleString()} Topics</span>
              <span>{Number(postCount || 0).toLocaleString()} Posts</span>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-wood-500 rounded-tl-sm z-20 pointer-events-none group-hover:border-gold-600" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-wood-500 rounded-tr-sm z-20 pointer-events-none group-hover:border-gold-600" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-wood-500 rounded-bl-sm z-20 pointer-events-none group-hover:border-gold-600" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-wood-500 rounded-br-sm z-20 pointer-events-none group-hover:border-gold-600" />
      </div>
    </div>
  )
}

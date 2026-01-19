import { ForumLayout } from '../components/ForumLayout'
import { CategoryCard } from '../components/CategoryCard'
import { categories } from '../data/mockData'

export function Home() {
  return (
    <ForumLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative"
        >
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3/4 h-32 bg-black/40 blur-3xl -z-10 rounded-full"></div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-gold-400 mb-4 text-shadow-black">
            Imperial Council
          </h1>

          <p className="text-xl text-parchment-200 font-serif max-w-2xl mx-auto text-shadow-black">
            Gather, commanders. Discuss strategies, share tales of conquest, and
            shape the history of the New World.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8 opacity-80">
            <div className="h-px w-24 bg-linear-to-r from-transparent to-gold-500"></div>
            <div className="w-2 h-2 rotate-45 bg-gold-500"></div>
            <div className="h-px w-24 bg-linear-to-l from-transparent to-gold-500"></div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} {...category} index={index} />
          ))}
        </div>

        {/* Stats */}
        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 bg-wood-900/80 border border-wood-600 p-6 rounded-sm backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-gold-400 font-display font-bold text-lg mb-1">
                Forum Statistics
              </h3>
              <p className="text-parchment-400 text-sm">
                Our growing empire in numbers
              </p>
            </div>

            <div className="flex gap-8 md:gap-12">
              <div>
                <span className="block text-2xl font-bold text-parchment-200 font-display">
                  12,450
                </span>
                <span className="text-xs text-wood-500 uppercase tracking-widest">
                  Members
                </span>
              </div>

              <div>
                <span className="block text-2xl font-bold text-parchment-200 font-display">
                  85,291
                </span>
                <span className="text-xs text-wood-500 uppercase tracking-widest">
                  Posts
                </span>
              </div>

              <div>
                <span className="block text-2xl font-bold text-gold-500 font-display">
                  142
                </span>
                <span className="text-xs text-wood-500 uppercase tracking-widest">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ForumLayout>
  )
}

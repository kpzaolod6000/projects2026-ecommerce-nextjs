import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db'

export async function CategoryGrid() {
  const dbCategories = await db.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
    take: 10,
  })

  return (
    <section className="bg-surface py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">Shop by Category</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            All categories →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
          {dbCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-colors hover:bg-white"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white shadow-sm ring-2 ring-transparent transition-all group-hover:ring-primary">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 text-xs">
                    ?
                  </div>
                )}
              </div>
              <span className="text-xs font-medium leading-tight text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

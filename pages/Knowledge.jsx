import { useState, useMemo } from 'react'
import { Search, Plus, BookOpen, Eye, ThumbsUp, Edit2 } from 'lucide-react'
import { mockArticles, categories } from '../mock-data/knowledge'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import clsx from 'clsx'

export default function Knowledge() {
  const [search,       setSearch]       = useState('')
  const [category,     setCategory]     = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    let r = [...mockArticles]
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
      )
    }
    if (category !== 'All') r = r.filter(a => a.category === category)
    if (statusFilter !== 'all') r = r.filter(a => a.status === statusFilter)
    return r
  }, [search, category, statusFilter])

  const totalViews   = mockArticles.reduce((a, c) => a + c.views,   0)
  const totalHelpful = mockArticles.reduce((a, c) => a + c.helpful, 0)
  const published    = mockArticles.filter(a => a.status === 'published').length

  return (
    <div className="space-y-5">
      <PageHeader
        title="Knowledge Base"
        subtitle="Self-service articles that reduce ticket volume"
        actions={
          <button className="btn-primary">
            <Plus className="w-4 h-4" /> New Article
          </button>
        }
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Articles',      value: mockArticles.length },
          { label: 'Published',     value: published },
          { label: 'Total Views',   value: totalViews.toLocaleString() },
          { label: 'Helpful Votes', value: totalHelpful.toLocaleString() },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles, tags, categories…"
            className="input pl-9 h-9"
          />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={clsx(
                'px-3 py-1 rounded-xl text-xs font-semibold transition-all',
                category === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status chips */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Status:</span>
          {['all', 'published', 'draft'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                'px-3 py-1 rounded-xl text-xs font-semibold transition-all',
                statusFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Article list ── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No articles found"
          description="Try a different search or remove the category filter."
          action={
            <button onClick={() => { setSearch(''); setCategory('All'); setStatusFilter('all') }} className="btn-secondary text-sm">
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_140px_110px_100px_110px_36px] gap-4 px-5 py-3 bg-slate-50/60 border-b border-slate-50">
            {['Article', 'Category', 'Status', 'Views', 'Helpful', ''].map(h => (
              <div key={h} className="table-header">{h}</div>
            ))}
          </div>

          <div className="divide-y divide-slate-50/80">
            {filtered.map(article => {
              const helpRate = (article.helpful + article.notHelpful) > 0
                ? Math.round((article.helpful / (article.helpful + article.notHelpful)) * 100)
                : null

              return (
                <div
                  key={article.id}
                  className="grid lg:grid-cols-[1fr_140px_110px_100px_110px_36px] gap-4 items-center px-5 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  {/* Title + meta */}
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                      {article.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      by {article.author} · Updated {article.updatedAt}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {article.tags.slice(0, 3).map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="hidden lg:block text-xs text-slate-600 font-semibold">
                    {article.category}
                  </span>

                  <div className="hidden lg:block">
                    <span className={clsx(
                      'badge',
                      article.status === 'published' ? 'badge-resolved' : 'badge-pending'
                    )}>
                      {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                    </span>
                  </div>

                  <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-700">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold tabular-nums">{article.views.toLocaleString()}</span>
                  </div>

                  <div className="hidden lg:block">
                    {helpRate !== null ? (
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-800 tabular-nums">{helpRate}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>

                  <button className="hidden lg:flex btn-icon text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}
          </div>

          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/40">
            <p className="text-xs text-slate-400">{filtered.length} article{filtered.length !== 1 ? 's' : ''} shown</p>
          </div>
        </div>
      )}
    </div>
  )
}

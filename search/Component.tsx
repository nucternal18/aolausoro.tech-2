'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search as SearchIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter, useSearchParams } from 'next/navigation'

export const Search: React.FC = () => {
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    const nextQuery = debouncedValue ? `?q=${encodeURIComponent(debouncedValue)}` : ''
    const currentQuery = searchParams.get('q') ? `?q=${searchParams.get('q')}` : ''
    if (nextQuery === currentQuery) return
    router.replace(`/search${nextQuery}`)
  }, [debouncedValue, router, searchParams])

  return (
    <form onSubmit={(e) => e.preventDefault()} className="border-edge shadow-hard flex border-2">
      <span className="border-edge flex items-center border-r-2 px-4 text-ink">
        <SearchIcon className="h-[19px] w-[19px]" />
      </span>
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <Input
        id="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search"
        className="h-auto flex-1 border-0 px-4 py-4.5 font-mono text-lg"
      />
      <button
        type="submit"
        className="bg-accent-hot text-on-accent border-edge border-l-2 px-6 font-mono text-xs tracking-[0.12em]"
      >
        SEARCH
      </button>
    </form>
  )
}

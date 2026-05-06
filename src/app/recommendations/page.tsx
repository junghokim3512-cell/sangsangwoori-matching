'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type MatchWithJob = {
  id: string
  score: number
  status: string
  jobs: {
    id: string
    title: string
    region: string
    job_type: string
    required_career: number | null
  }
}

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score === 6
      ? 'bg-amber-100 text-amber-700 border-amber-500'
      : score >= 4
        ? 'bg-green-100 text-green-700 border-green-500'
        : 'bg-gray-100 text-gray-600 border-gray-400'
  return (
    <span className={`inline-block px-4 py-1 text-xl font-bold border-2 rounded-full ${cls}`}>
      {score}점
    </span>
  )
}

function RecommendationsContent() {
  const searchParams = useSearchParams()
  const seniorId = searchParams.get('senior_id')

  const [seniorName, setSeniorName] = useState<string>('')
  const [matches, setMatches] = useState<MatchWithJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!seniorId) { setLoading(false); return }

    async function fetchData() {
      setLoading(true)

      const [{ data: senior }, { data: matchData }] = await Promise.all([
        supabase.from('seniors').select('name').eq('id', seniorId!).single(),
        supabase
          .from('matches')
          .select('id, score, status, jobs(id, title, region, job_type, required_career)')
          .eq('senior_id', seniorId!)
          .gt('score', 0)
          .order('score', { ascending: false }),
      ])

      setSeniorName(senior?.name ?? '')
      setMatches((matchData as unknown as MatchWithJob[]) ?? [])
      setLoading(false)
    }

    fetchData()
  }, [seniorId])

  // senior_id 없이 접근한 경우 — 시니어 목록 링크 안내
  if (!seniorId) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">맞춤 일자리 추천</h1>
          <div className="p-6 bg-blue-50 border-2 border-blue-400 rounded-xl">
            <p className="text-xl text-blue-700 font-semibold">
              담당자는 아래 관리 페이지에서 시니어별 "상세 보기"를 눌러 이동하세요.
            </p>
            <a
              href="/admin"
              className="mt-4 inline-block px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              담당자 대시보드로 이동
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-gray-900">맞춤 일자리 추천</h1>
          <a href="/admin" className="text-lg text-blue-600 hover:underline">← 대시보드</a>
        </div>

        {seniorName && (
          <p className="text-2xl text-gray-600 mb-8">
            <span className="font-bold text-gray-900">{seniorName}</span>님의 추천 결과입니다.
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-2xl text-gray-400">불러오는 중...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="p-8 bg-gray-50 border-2 border-gray-300 rounded-xl text-center">
            <p className="text-2xl font-semibold text-gray-500">현재 매칭되는 일자리가 없습니다</p>
            <p className="mt-2 text-lg text-gray-400">
              지역·직종이 맞는 일자리가 등록되면 자동으로 표시됩니다.
            </p>
          </div>
        ) : (
          <>
            <p className="text-lg text-gray-500 mb-5">점수 높은 순 · 총 {matches.length}건</p>
            <div className="flex flex-col gap-4">
              {matches.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 flex items-start justify-between gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-2xl font-bold text-gray-900">{m.jobs.title}</p>
                    <p className="text-lg text-gray-500">
                      {m.jobs.region} · {m.jobs.job_type}
                      {m.jobs.required_career != null
                        ? ` · 경력 ${m.jobs.required_career}년 이상`
                        : ' · 경력 무관'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <ScoreBadge score={m.score} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default function RecommendationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-2xl text-gray-400">불러오는 중...</p>
        </div>
      }
    >
      <RecommendationsContent />
    </Suspense>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

const REGIONS = ['서울', '경기', '인천', '기타'] as const
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타'] as const

type Job = {
  id: string
  title: string
  region: string
  job_type: string
  required_career: number | null
  created_at: string
}

type JobForm = {
  title: string
  region: string
  job_type: string
  required_career: string
}

type JobFormErrors = Partial<Record<keyof JobForm, string>>

const INPUT_CLASS =
  'h-12 px-3 text-lg border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:outline-none w-full'

const MATCH_TABS = [
  { label: '미매칭', description: '아직 일자리가 연결되지 않은 시니어' },
  { label: '매칭 대기', description: '추천은 됐으나 담당자 확인 전' },
  { label: '배정 완료', description: '담당자가 배정을 확정한 건' },
] as const

export default function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [form, setForm] = useState<JobForm>({ title: '', region: '', job_type: '', required_career: '' })
  const [formErrors, setFormErrors] = useState<JobFormErrors>({})
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function fetchJobs() {
    setLoadingJobs(true)
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    setJobs(data ?? [])
    setLoadingJobs(false)
  }

  useEffect(() => { fetchJobs() }, [])

  function validateForm(): JobFormErrors {
    const e: JobFormErrors = {}
    if (!form.title.trim()) e.title = '공고명을 입력해 주세요.'
    if (!form.region) e.region = '지역을 선택해 주세요.'
    if (!form.job_type) e.job_type = '직종을 선택해 주세요.'
    return e
  }

  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateForm()
    setFormErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    const { error } = await supabase.from('jobs').insert({
      title: form.title.trim(),
      region: form.region,
      job_type: form.job_type,
      required_career: form.required_career ? parseInt(form.required_career, 10) : null,
    })
    setSaving(false)

    if (!error) {
      setForm({ title: '', region: '', job_type: '', required_career: '' })
      setFormErrors({})
      await fetchJobs()
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    await supabase.from('jobs').delete().eq('id', id)
    setDeletingId(null)
    await fetchJobs()
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-5xl mx-auto">

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">담당자 대시보드</h1>
          <p className="mt-2 text-xl text-gray-600">매칭 현황을 단계별로 확인하고 관리하세요.</p>
        </div>

        {/* 매칭 현황 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {MATCH_TABS.map((tab) => (
            <div key={tab.label} className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <p className="text-lg font-semibold text-gray-500">{tab.label}</p>
              <p className="mt-1 text-5xl font-bold text-gray-900">0</p>
              <p className="mt-2 text-base text-gray-400">{tab.description}</p>
            </div>
          ))}
        </div>

        {/* 매칭 현황 테이블 (다음 단계에서 구현) */}
        {MATCH_TABS.map((tab) => (
          <section key={tab.label} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{tab.label}</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 bg-gray-100 px-6 py-3 text-lg font-semibold text-gray-600">
                <span>시니어 이름</span>
                <span>희망 직종</span>
                <span>추천 일자리</span>
                <span>매칭 점수</span>
              </div>
              <div className="flex items-center justify-center py-10">
                <p className="text-xl text-gray-400">데이터가 없습니다</p>
              </div>
            </div>
          </section>
        ))}

        {/* 구분선 */}
        <hr className="my-12 border-gray-300" />

        {/* ───── 일자리 관리 섹션 ───── */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">일자리 관리</h2>
          <p className="text-xl text-gray-600 mb-8">일자리를 등록하고 목록을 관리합니다.</p>

          {/* 일자리 추가 폼 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-5">새 일자리 등록</h3>
            <form onSubmit={handleAddJob} noValidate className="flex flex-col gap-4">

              {/* 공고명 */}
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold text-gray-700" htmlFor="job-title">
                  공고명 <span className="text-red-500">*</span>
                </label>
                {formErrors.title && (
                  <div className="p-2 bg-red-50 border-2 border-red-400 rounded-lg">
                    <p className="text-base font-medium text-red-600">{formErrors.title}</p>
                  </div>
                )}
                <input
                  id="job-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="예: 아파트 경비원 모집"
                  className={INPUT_CLASS}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 지역 */}
                <div className="flex flex-col gap-1">
                  <label className="text-lg font-semibold text-gray-700" htmlFor="job-region">
                    지역 <span className="text-red-500">*</span>
                  </label>
                  {formErrors.region && (
                    <div className="p-2 bg-red-50 border-2 border-red-400 rounded-lg">
                      <p className="text-base font-medium text-red-600">{formErrors.region}</p>
                    </div>
                  )}
                  <select
                    id="job-region"
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    className={INPUT_CLASS}
                  >
                    <option value="">선택</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* 직종 */}
                <div className="flex flex-col gap-1">
                  <label className="text-lg font-semibold text-gray-700" htmlFor="job-type">
                    직종 <span className="text-red-500">*</span>
                  </label>
                  {formErrors.job_type && (
                    <div className="p-2 bg-red-50 border-2 border-red-400 rounded-lg">
                      <p className="text-base font-medium text-red-600">{formErrors.job_type}</p>
                    </div>
                  )}
                  <select
                    id="job-type"
                    value={form.job_type}
                    onChange={(e) => setForm({ ...form, job_type: e.target.value })}
                    className={INPUT_CLASS}
                  >
                    <option value="">선택</option>
                    {JOB_TYPES.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>

                {/* 요구 경력 */}
                <div className="flex flex-col gap-1">
                  <label className="text-lg font-semibold text-gray-700" htmlFor="job-career">
                    요구 경력 (년)
                  </label>
                  <input
                    id="job-career"
                    type="number"
                    min="0"
                    max="60"
                    value={form.required_career}
                    onChange={(e) => setForm({ ...form, required_career: e.target.value })}
                    placeholder="0"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="self-start h-12 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
              >
                {saving ? '저장 중...' : '+ 일자리 등록'}
              </Button>
            </form>
          </div>

          {/* 일자리 목록 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">등록된 일자리</h3>
              <span className="text-lg text-gray-500">총 {jobs.length}건</span>
            </div>

            {loadingJobs ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-xl text-gray-400">불러오는 중...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-xl text-gray-400">등록된 일자리가 없습니다</p>
              </div>
            ) : (
              <table className="w-full text-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">공고명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">지역</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">직종</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">요구 경력</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, i) => (
                    <tr key={job.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                      <td className="px-4 py-4 text-gray-700">{job.region}</td>
                      <td className="px-4 py-4 text-gray-700">{job.job_type}</td>
                      <td className="px-4 py-4 text-gray-700">
                        {job.required_career != null ? `${job.required_career}년` : '무관'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Button
                          variant="destructive"
                          disabled={deletingId === job.id}
                          onClick={() => handleDelete(job.id)}
                          className="h-10 px-5 text-base font-bold cursor-pointer"
                        >
                          {deletingId === job.id ? '삭제 중...' : '삭제'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>
    </main>
  )
}

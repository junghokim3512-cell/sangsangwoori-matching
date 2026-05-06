'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

const REGIONS = ['서울', '경기', '인천', '기타'] as const
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타'] as const

type FormState = {
  name: string
  region: string
  desired_job: string
  career_years: string
}

type Errors = Partial<Record<keyof FormState, string>>

const FIELD_CLASS =
  'h-14 px-4 text-xl border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:outline-none w-full'

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    region: '',
    desired_job: '',
    career_years: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate(): Errors {
    const e: Errors = {}
    if (!form.name.trim()) e.name = '이름을 입력해 주세요.'
    if (!form.region) e.region = '지역을 선택해 주세요.'
    if (!form.desired_job) e.desired_job = '희망 직종을 선택해 주세요.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(false)

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    const { error } = await supabase.from('seniors').insert({
      name: form.name.trim(),
      region: form.region,
      desired_job: form.desired_job,
      career_years: form.career_years ? parseInt(form.career_years, 10) : null,
    })
    setLoading(false)

    if (error) {
      setErrors({ name: '저장 중 오류가 발생했습니다. 다시 시도해 주세요.' })
    } else {
      setSuccess(true)
      setForm({ name: '', region: '', desired_job: '', career_years: '' })
    }
  }

  function field(key: keyof FormState, label: string, required: boolean, children: React.ReactNode) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xl font-semibold text-gray-800" htmlFor={key}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {errors[key] && (
          <div className="p-3 bg-red-50 border-2 border-red-400 rounded-lg">
            <p className="text-lg font-medium text-red-600">{errors[key]}</p>
          </div>
        )}
        {children}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">시니어 프로필 등록</h1>
        <p className="text-xl text-gray-600 mb-10">
          기본 정보를 입력하시면 맞춤 일자리를 추천해 드립니다.
        </p>

        {success && (
          <div className="mb-8 p-5 bg-green-50 border-2 border-green-500 rounded-xl">
            <p className="text-2xl font-bold text-green-700">등록이 완료되었습니다 ✓</p>
            <p className="mt-1 text-lg text-green-600">프로필이 저장되었습니다. 추천 탭에서 결과를 확인해 보세요.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          {field('name', '이름', true,
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="홍길동"
              className={FIELD_CLASS}
            />
          )}

          {field('region', '지역', true,
            <select
              id="region"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className={FIELD_CLASS}
            >
              <option value="">선택해 주세요</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          )}

          {field('desired_job', '희망 직종', true,
            <select
              id="desired_job"
              value={form.desired_job}
              onChange={(e) => setForm({ ...form, desired_job: e.target.value })}
              className={FIELD_CLASS}
            >
              <option value="">선택해 주세요</option>
              {JOB_TYPES.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          )}

          {field('career_years', '경력 (년)', false,
            <input
              id="career_years"
              type="number"
              min="0"
              max="60"
              value={form.career_years}
              onChange={(e) => setForm({ ...form, career_years: e.target.value })}
              placeholder="0"
              className={FIELD_CLASS}
            />
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-2 cursor-pointer"
          >
            {loading ? '저장 중...' : '프로필 등록하기'}
          </Button>
        </form>
      </div>
    </main>
  )
}

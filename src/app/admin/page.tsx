const TABS = [
  { label: "미매칭", count: 0, description: "아직 일자리가 연결되지 않은 시니어" },
  { label: "매칭 대기", count: 0, description: "추천은 됐으나 담당자 확인 전" },
  { label: "배정 완료", count: 0, description: "담당자가 배정을 확정한 건" },
] as const;

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">담당자 대시보드</h1>
          <p className="mt-2 text-xl text-gray-600">
            매칭 현황을 단계별로 확인하고 관리하세요.
          </p>
        </div>

        {/* 요약 카드 3개 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {TABS.map((tab) => (
            <div
              key={tab.label}
              className="bg-white border-2 border-gray-200 rounded-xl p-6"
            >
              <p className="text-lg font-semibold text-gray-500">{tab.label}</p>
              <p className="mt-1 text-5xl font-bold text-gray-900">{tab.count}</p>
              <p className="mt-2 text-base text-gray-400">{tab.description}</p>
            </div>
          ))}
        </div>

        {/* 섹션별 테이블 뼈대 */}
        {TABS.map((tab) => (
          <section key={tab.label} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{tab.label}</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
              {/* 테이블 헤더 */}
              <div className="grid grid-cols-4 bg-gray-100 px-6 py-3 text-lg font-semibold text-gray-600">
                <span>시니어 이름</span>
                <span>희망 직종</span>
                <span>추천 일자리</span>
                <span>매칭 점수</span>
              </div>
              {/* 빈 행 */}
              <div className="flex items-center justify-center py-12">
                <p className="text-xl text-gray-400">데이터가 없습니다</p>
              </div>
            </div>
          </section>
        ))}

        <p className="text-base text-gray-400 text-center">
          ※ 매칭 기능 준비 중입니다.
        </p>
      </div>
    </main>
  );
}

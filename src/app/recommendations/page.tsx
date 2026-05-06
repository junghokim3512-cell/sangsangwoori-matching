export default function RecommendationsPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl">
        {/* 헤더 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">맞춤 일자리 추천</h1>
        <p className="text-xl text-gray-600 mb-10">
          회원님의 프로필과 가장 잘 맞는 일자리를 점수 순으로 보여드립니다.
        </p>

        {/* 정렬 안내 */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg text-gray-500">추천 점수 내림차순</span>
          <span className="text-lg font-semibold text-gray-700">총 0건</span>
        </div>

        {/* 추천 카드 목록 자리 */}
        <div className="flex flex-col gap-4">
          {/* 빈 상태 */}
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-2xl text-gray-400 font-medium">추천 결과가 없습니다</p>
            <p className="mt-2 text-lg text-gray-400">
              먼저 시니어 프로필을 등록해 주세요.
            </p>
            <a
              href="/register"
              className="mt-6 inline-block px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              프로필 등록하러 가기
            </a>
          </div>

          {/* 카드 뼈대 예시 (데이터 연동 전 placeholder) */}
          <div className="border-2 border-gray-100 rounded-xl p-6 opacity-30 pointer-events-none select-none">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">일자리 제목</p>
                <p className="mt-1 text-lg text-gray-500">지역 · 직종</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">점수 00</span>
            </div>
            <p className="mt-3 text-lg text-gray-600">필요 경력: 0년 이상</p>
          </div>
        </div>

        <p className="mt-8 text-base text-gray-400 text-center">
          ※ 자동 매칭 기능 준비 중입니다.
        </p>
      </div>
    </main>
  );
}

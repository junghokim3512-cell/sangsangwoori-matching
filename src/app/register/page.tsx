export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* 헤더 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">시니어 프로필 등록</h1>
        <p className="text-xl text-gray-600 mb-10">
          기본 정보를 입력하시면 맞춤 일자리를 추천해 드립니다.
        </p>

        {/* 등록 폼 뼈대 */}
        <form className="flex flex-col gap-6">
          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800" htmlFor="name">
              이름
            </label>
            <input
              id="name"
              type="text"
              placeholder="홍길동"
              disabled
              className="h-14 px-4 text-xl border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* 지역 */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800" htmlFor="region">
              지역
            </label>
            <input
              id="region"
              type="text"
              placeholder="서울특별시 강남구"
              disabled
              className="h-14 px-4 text-xl border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* 희망 직종 */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800" htmlFor="desiredJob">
              희망 직종
            </label>
            <input
              id="desiredJob"
              type="text"
              placeholder="사무보조, 경비, 청소 등"
              disabled
              className="h-14 px-4 text-xl border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* 경력 (년) */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800" htmlFor="careerYears">
              경력 (년)
            </label>
            <input
              id="careerYears"
              type="number"
              placeholder="0"
              disabled
              className="h-14 px-4 text-xl border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled
            className="mt-4 h-16 text-xl font-bold text-white bg-blue-600 rounded-lg cursor-not-allowed opacity-50"
          >
            프로필 등록하기
          </button>
        </form>

        <p className="mt-6 text-base text-gray-400 text-center">
          ※ 기능 준비 중입니다. 곧 이용하실 수 있습니다.
        </p>
      </div>
    </main>
  );
}

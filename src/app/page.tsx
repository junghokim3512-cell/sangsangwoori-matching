const LINKS = [
  {
    href: "/register",
    title: "시니어 프로필 등록",
    desc: "이름, 지역, 희망 직종, 경력을 입력해 주세요.",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    href: "/recommendations",
    title: "맞춤 일자리 추천",
    desc: "등록된 프로필 기반으로 점수 순 추천 목록을 확인합니다.",
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    href: "/admin",
    title: "담당자 대시보드",
    desc: "미매칭 · 매칭 대기 · 배정 완료 현황을 관리합니다.",
    color: "bg-gray-700 hover:bg-gray-800",
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-3">상상우리</h1>
        <p className="text-2xl text-gray-600 mb-12">
          시니어 ↔ 일자리 자동 매칭 시스템
        </p>

        <div className="flex flex-col gap-5">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`flex flex-col items-start px-8 py-6 rounded-2xl text-white transition-colors ${link.color}`}
            >
              <span className="text-2xl font-bold">{link.title}</span>
              <span className="mt-1 text-lg opacity-90">{link.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

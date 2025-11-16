import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-6xl font-bold text-zinc-900 dark:text-zinc-50">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        요청하신 상품이 존재하지 않거나 삭제되었습니다.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-zinc-900 px-6 py-3 text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}

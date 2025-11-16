'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: '배송은 어떻게 되나요?',
    answer:
      '모든 상품은 디지털 상품으로, 구매 완료 후 즉시 이메일로 다운로드 링크를 받으실 수 있습니다. 물리적 배송은 없습니다.',
  },
  {
    question: '환불 정책은 어떻게 되나요?',
    answer:
      '디지털 상품 특성상 구매 후 7일 이내에만 환불이 가능합니다. 환불 요청은 고객 지원팀으로 문의해주세요.',
  },
  {
    question: 'DRM 보호가 있나요?',
    answer:
      '일부 상품은 DRM 보호가 적용되어 있을 수 있습니다. 상품 상세 페이지에서 확인하실 수 있습니다.',
  },
  {
    question: '세금은 어떻게 계산되나요?',
    answer:
      '구매자의 위치에 따라 자동으로 세금이 계산됩니다. 결제 페이지에서 최종 금액을 확인하실 수 있습니다.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        자주 묻는 질문
      </h2>
      <div className="space-y-2">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-zinc-500 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="border-t border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

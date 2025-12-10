import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const commentsByPostId: Record<string, Array<{
  id: string
  postId: string
  content: string
  anonymousId: string
  createdAt: string
}>> = {
  "1": [
    {
      id: "c1_1",
      postId: "1",
      content: "Супер идея! Аз също имам нужда от място за учене вечер.",
      anonymousId: "anon_123",
      createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "c1_2",
      postId: "1",
      content: "Би било добре, но как ще се осигури персонал толкова дълго?",
      anonymousId: "anon_456",
      createdAt: new Date(Date.now() - 1.3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "c1_3",
      postId: "1",
      content: "Може и да се работи на смени, или доброволци?",
      anonymousId: "anon_789",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "2": [
    {
      id: "c2_1",
      postId: "2",
      content: "Да! Вегетарианското меню трябва да се подобри.",
      anonymousId: "anon_234",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "c2_2",
      postId: "2",
      content: "Съгласна съм. Нека има повече салати и супи.",
      anonymousId: "anon_567",
      createdAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "3": [
    {
      id: "c3_1",
      postId: "3",
      content: "WiFi-то наистина е ужасно вечер.",
      anonymousId: "anon_111",
      createdAt: new Date(Date.now() - 0.8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "c3_2",
      postId: "3",
      content: "Подкрепям! Нужен е модерен рутер.",
      anonymousId: "anon_222",
      createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "c3_3",
      postId: "3",
      content: "Директорът обеща да разгледа въпроса.",
      anonymousId: "anon_333",
      createdAt: new Date(Date.now() - 0.3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "4": [
    {
      id: "c4_1",
      postId: "4",
      content: "Г-жа Иванова е най-добрият учител!",
      anonymousId: "anon_444",
      createdAt: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "5": [
    {
      id: "c5_1",
      postId: "5",
      content: "Това е сериозен проблем. Как да се концентрираме в жегата?",
      anonymousId: "anon_555",
      createdAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "c5_2",
      postId: "5",
      content: "Подкрепям идеята за ремонт!",
      anonymousId: "anon_666",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "6": [
    {
      id: "c6_1",
      postId: "6",
      content: "Чудесна идея! Би спестило много пари.",
      anonymousId: "anon_777",
      createdAt: new Date(Date.now() - 3.8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "c6_2",
      postId: "6",
      content: "Как би работило? Някакъв онлайн каталог?",
      anonymousId: "anon_888",
      createdAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "7": [
    {
      id: "c7_1",
      postId: "7",
      content: "Да, новите пейки са необходими!",
      anonymousId: "anon_999",
      createdAt: new Date(Date.now() - 5.5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "8": [
    {
      id: "c8_1",
      postId: "8",
      content: "Страхотно! Аз ще се включа.",
      anonymousId: "anon_101",
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get("postId")

  if (postId && commentsByPostId[postId]) {
    return NextResponse.json({
      comments: commentsByPostId[postId],
    })
  }

  return NextResponse.json(commentsByPostId)
}

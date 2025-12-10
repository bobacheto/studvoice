import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const posts = [
  {
    id: "1",
    title: "Удължено работно време на библиотеката по време на изпити",
    content: "Учениците се нуждаят от повече място за учене по време на сесията. Предлагам библиотеката да работи до 20:00ч през периода на изпитите.",
    status: "under-review",
    anonymousId: "anon_student_42",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      LIKE: 156,
      SUPPORT: 89,
      GREAT: 45,
      THINKING: 12,
    },
    commentCount: 23,
  },
  {
    id: "2",
    title: "Повече вегетариански опции в столовата",
    content: "Сегашните опции са ограничени и повтарящи се. Би било чудесно да имаме по-разнообразно меню за вегетарианци и вегани.",
    status: "accepted",
    anonymousId: "anon_student_17",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      LIKE: 89,
      SUPPORT: 134,
      GREAT: 67,
      THINKING: 8,
    },
    commentCount: 12,
  },
  {
    id: "3",
    title: "Подобрения на Wi-Fi в общежитията",
    content: "Връзката често прекъсва вечер когато всички са онлайн. Нуждаем се от модернизация на мрежата.",
    status: "pending",
    anonymousId: "anon_student_99",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      LIKE: 234,
      SUPPORT: 198,
      GREAT: 87,
      THINKING: 15,
    },
    commentCount: 45,
  },
  {
    id: "4",
    title: "Благодарност към г-жа Иванова за помощта по математика",
    content: "Искам да изкажа огромна благодарност на г-жа Иванова която ми помогна да подготвя изпита по математика. Нейната подкрепа беше безценна!",
    status: "completed",
    anonymousId: "anon_student_55",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      LIKE: 67,
      SUPPORT: 43,
      GREAT: 92,
      THINKING: 2,
    },
    commentCount: 8,
  },
  {
    id: "5",
    title: "Климатиците в кабинета по химия не работят",
    content: "Климатиците в кабинет 304 не работят от началото на есенния семестър. Лятото е невъзможно да се учи там.",
    status: "under-review",
    anonymousId: "anon_student_31",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      LIKE: 78,
      SUPPORT: 112,
      GREAT: 12,
      THINKING: 34,
    },
    commentCount: 19,
  },
  {
    id: "6",
    title: "Предложение за система за споделяне на учебници",
    content: "Много ученици купуват едни и същи учебници всяка година. Може ли да създадем система за обмяна или споделяне на учебници?",
    status: "pending",
    anonymousId: "anon_student_88",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      LIKE: 145,
      SUPPORT: 167,
      GREAT: 89,
      THINKING: 23,
    },
    commentCount: 31,
  },
  {
    id: "7",
    title: "Нови пейки в училищния двор",
    content: "Много от пейките са стари и неудобни. Нови пейки в двора ще подобрят средата за отдих между часовете.",
    status: "accepted",
    anonymousId: "anon_student_64",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      LIKE: 92,
      SUPPORT: 78,
      GREAT: 45,
      THINKING: 7,
    },
    commentCount: 14,
  },
  {
    id: "8",
    title: "Търся съученици за групово учене по физика",
    content: "Организирам учебна група за подготовка по физика всяка сряда следобед в библиотеката. Който иска да се присъедини - заповядайте!",
    status: "completed",
    anonymousId: "anon_student_22",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      LIKE: 34,
      SUPPORT: 56,
      GREAT: 28,
      THINKING: 5,
    },
    commentCount: 11,
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get("limit")
  const status = searchParams.get("status")

  let filteredPosts = [...posts]

  if (status) {
    filteredPosts = filteredPosts.filter((p) => p.status.toLowerCase() === status.toLowerCase())
  }

  if (limit) {
    filteredPosts = filteredPosts.slice(0, parseInt(limit, 10))
  }

  return NextResponse.json({
    posts: filteredPosts,
  })
}

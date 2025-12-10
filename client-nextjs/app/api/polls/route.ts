import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const polls = [
  {
    id: "poll_1",
    title: "Да има ли по-дълга голяма междучасие?",
    description: "Сега голямото междучасие е 20 минути. Достатъчно ли е?",
    createdByAnonymousId: "anon_teacher_01",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    options: [
      {
        id: "opt_1_1",
        text: "Да, 30 минути е по-добре",
        voteCount: 342,
      },
      {
        id: "opt_1_2",
        text: "Не, 20 минути са достатъчни",
        voteCount: 156,
      },
      {
        id: "opt_1_3",
        text: "Нека остане както е",
        voteCount: 89,
      },
    ],
    votedOptionId: null,
  },
  {
    id: "poll_2",
    title: "Искате ли нови шкафчета в коридора?",
    description: "Планираме да закупим допълнителни шкафчета за учениците.",
    createdByAnonymousId: "anon_director",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    options: [
      {
        id: "opt_2_1",
        text: "Да, много са нужни",
        voteCount: 421,
      },
      {
        id: "opt_2_2",
        text: "Не, не са толкова важни",
        voteCount: 87,
      },
      {
        id: "opt_2_3",
        text: "По-скоро да",
        voteCount: 234,
      },
    ],
    votedOptionId: null,
  },
  {
    id: "poll_3",
    title: "Предпочитан формат за изпитния график?",
    description: "Как предпочитате да бъде разпределен изпитния период?",
    createdByAnonymousId: "anon_admin_12",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    options: [
      {
        id: "opt_3_1",
        text: "Разпределени в две седмици",
        voteCount: 567,
      },
      {
        id: "opt_3_2",
        text: "Концентрирани в една седмица",
        voteCount: 234,
      },
      {
        id: "opt_3_3",
        text: "Разпределени в три седмици",
        voteCount: 145,
      },
    ],
    votedOptionId: null,
  },
  {
    id: "poll_4",
    title: "Какво събитие да организираме следващия месец?",
    description: "Гласувайте за предпочитаното събитие!",
    createdByAnonymousId: "anon_student_council",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    options: [
      {
        id: "opt_4_1",
        text: "Филмова вечер",
        voteCount: 289,
      },
      {
        id: "opt_4_2",
        text: "Спортен турнир",
        voteCount: 198,
      },
      {
        id: "opt_4_3",
        text: "Музикален концерт",
        voteCount: 167,
      },
      {
        id: "opt_4_4",
        text: "Викторина",
        voteCount: 92,
      },
    ],
    votedOptionId: null,
  },
]

export async function GET() {
  return NextResponse.json({
    polls,
  })
}

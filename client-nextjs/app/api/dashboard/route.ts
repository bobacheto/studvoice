import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const trendingPosts = [
  {
    id: "3",
    title: "Подобрения на Wi-Fi в общежитията",
    content: "Връзката често прекъсва вечер когато всички са онлайн. Нуждаем се от модернизация на мрежата.",
    status: "PENDING",
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
    id: "6",
    title: "Предложение за система за споделяне на учебници",
    content: "Много ученици купуват едни и същи учебници всяка година. Може ли да създадем система за обмяна или споделяне на учебници?",
    status: "PENDING",
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
    id: "1",
    title: "Удължено работно време на библиотеката по време на изпити",
    content: "Учениците се нуждаят от повече място за учене по време на сесията. Предлагам библиотеката да работи до 20:00ч през периода на изпитите.",
    status: "UNDER_REVIEW",
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
]

const activePolls = [
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
]

const activeAMAs = [
  {
    id: "ama_1",
    title: "Попитай директора - Планиране на учебната година",
    description: "Директор Иванов отговаря на вашите въпроси за предстоящата учебна година и планираните промени.",
    schoolId: "school_125",
    isActive: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: {
      id: "user_director_1",
      firstName: "Петър",
      lastName: "Иванов",
      role: "Директор",
    },
    _count: {
      questions: 15,
    },
  },
  {
    id: "ama_2",
    title: "AMA с треньор Петров - Обновяване на спортните съоръжения",
    description: "Спортният директор отговаря на въпроси относно планираното обновяване на спортните зали и игрища.",
    schoolId: "school_125",
    isActive: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: {
      id: "user_coach_1",
      firstName: "Георги",
      lastName: "Петров",
      role: "Спортен директор",
    },
    _count: {
      questions: 8,
    },
  },
]

const weeklyDigest = {
  ideasThisWeek: 14,
  newPosts: 5,
  totalVotes: 892,
  acceptedIdeas: 3,
  mostSupportedIdea: {
    id: "3",
    title: "Подобрения на Wi-Fi в общежитията",
    supportCount: 534,
  },
}

export async function GET() {
  return NextResponse.json({
    trendingPosts,
    activePolls,
    activeAMAs,
    weeklyDigest,
  })
}

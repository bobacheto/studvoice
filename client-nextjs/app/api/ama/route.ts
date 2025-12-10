import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const amaSessions = [
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
    questions: [
      {
        id: "q_1_1",
        amaId: "ama_1",
        content: "Кога точно ще бъдат поставени новите климатици?",
        anonymousId: "anon_student_42",
        status: "ANSWERED",
        createdAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
        answer: {
          id: "ans_1_1",
          questionId: "q_1_1",
          content: "Климатиците ще бъдат инсталирани до края на следващия месец. Вече сме одобрили бюджета.",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          answeredBy: {
            id: "user_director_1",
            firstName: "Петър",
            lastName: "Иванов",
            role: "Директор",
          },
        },
      },
      {
        id: "q_1_2",
        amaId: "ama_1",
        content: "Ще има ли нови извънкласни дейности тази година?",
        anonymousId: "anon_student_88",
        status: "PENDING",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "q_1_3",
        amaId: "ama_1",
        content: "Разглежда ли се идеята за система за споделяне на учебници?",
        anonymousId: "anon_student_64",
        status: "PENDING",
        createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
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
    questions: [
      {
        id: "q_2_1",
        amaId: "ama_2",
        content: "Кога ще бъде завършен ремонта на игрището за баскетбол?",
        anonymousId: "anon_student_22",
        status: "ANSWERED",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        answer: {
          id: "ans_2_1",
          questionId: "q_2_1",
          content: "Ремонтът започна миналата седмица и очакваме завършване до края на месеца.",
          createdAt: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString(),
          answeredBy: {
            id: "user_coach_1",
            firstName: "Георги",
            lastName: "Петров",
            role: "Спортен директор",
          },
        },
      },
      {
        id: "q_2_2",
        amaId: "ama_2",
        content: "Ще има ли нови топки и екипировка?",
        anonymousId: "anon_student_77",
        status: "PENDING",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "ama_3",
    title: "Библиотекар - Нови книги и работно време",
    description: "Библиотекарят обсъжда плановете за разширяване на библиотечния фонд и промени в работното време.",
    schoolId: "school_125",
    isActive: false,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: {
      id: "user_librarian_1",
      firstName: "Мария",
      lastName: "Димитрова",
      role: "Библиотекар",
    },
    _count: {
      questions: 5,
    },
    questions: [
      {
        id: "q_3_1",
        amaId: "ama_3",
        content: "Ще има ли удължено работно време по време на изпитите?",
        anonymousId: "anon_student_42",
        status: "ANSWERED",
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        answer: {
          id: "ans_3_1",
          questionId: "q_3_1",
          content: "Да, планираме да удължим работното време до 20:00ч през изпитния период.",
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          answeredBy: {
            id: "user_librarian_1",
            firstName: "Мария",
            lastName: "Димитрова",
            role: "Библиотекар",
          },
        },
      },
    ],
  },
]

export async function GET() {
  return NextResponse.json({
    sessions: amaSessions.filter((s) => s.isActive),
  })
}

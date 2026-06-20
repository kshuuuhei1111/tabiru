import type { Trip } from "@tabiru/shared";

export const mockTrips: Trip[] = [
  {
    id: "trip-1",
    title: "京都・大阪 3泊4日",
    startDate: "2024-08-10",
    endDate: "2024-08-13",
    inviteToken: "abc123",
    members: [
      { userId: "u1", displayName: "田中", role: "owner" },
      { userId: "u2", displayName: "佐藤", role: "editor" },
      { userId: "u3", displayName: "鈴木", role: "editor" },
    ],
    days: [
      {
        id: "day-1",
        date: "2024-08-10",
        spots: [
          {
            id: "spot-1",
            name: "金閣寺",
            category: "観光",
            location: { lat: 35.0394, lng: 135.7292 },
            order: 0,
            plan: { scheduledAt: "10:00", notes: "朝早めに行く" },
          },
          {
            id: "spot-2",
            name: "嵐山",
            category: "観光",
            location: { lat: 35.0094, lng: 135.6781 },
            order: 1,
            plan: { scheduledAt: "14:00" },
          },
        ],
      },
      {
        id: "day-2",
        date: "2024-08-11",
        spots: [
          {
            id: "spot-3",
            name: "道頓堀",
            category: "グルメ",
            location: { lat: 34.6687, lng: 135.5013 },
            order: 0,
            plan: { scheduledAt: "12:00", notes: "たこ焼き食べる" },
          },
        ],
      },
    ],
  },
  {
    id: "trip-2",
    title: "沖縄 2泊3日",
    startDate: "2024-09-20",
    endDate: "2024-09-22",
    inviteToken: "xyz789",
    members: [
      { userId: "u1", displayName: "田中", role: "owner" },
      { userId: "u4", displayName: "山田", role: "editor" },
    ],
    days: [],
  },
];

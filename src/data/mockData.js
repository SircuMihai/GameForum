// Mock Data (JS)

export const achievements = [
  { id: '1', title: 'First Battle', description: 'Posted your first message', iconName: 'Swords' },
  { id: '2', title: 'Town Founder', description: 'Joined the community', iconName: 'Map' },
  { id: '3', title: 'Veteran Commander', description: 'Reached 100 posts', iconName: 'Medal' },
  { id: '4', title: 'Master Strategist', description: 'Created a topic with 50+ replies', iconName: 'Scroll' },
  { id: '5', title: 'Imperial Advisor', description: 'Became a moderator or admin', iconName: 'Crown' },
  { id: '6', title: 'Explorer', description: 'Visited every category', iconName: 'Flag' },
]

export const users = {
  u1: {
    id: 'u1',
    username: 'Napoleon_Bonaparte',
    role: 'admin',
    avatarUrl:
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&q=80&w=200&h=200',
    joinDate: 'Oct 15, 2005',
    postCount: 1805,
    bio: 'Emperor of the French. Strategy enthusiast.',
    achievements: ['1', '2', '3', '4', '5', '6'],
  },
  u2: {
    id: 'u2',
    username: 'Queen_Isabella',
    role: 'moderator',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
    joinDate: 'Jan 22, 2006',
    postCount: 842,
    bio: 'Funding expeditions to the New World.',
    achievements: ['1', '2', '3', '5'],
  },
  u3: {
    id: 'u3',
    username: 'Morgan_Black',
    role: 'user',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200',
    joinDate: 'Nov 03, 2023',
    postCount: 45,
    bio: 'Knight of St. John. Defending the Circle.',
    achievements: ['1', '2'],
  },
  u4: {
    id: 'u4',
    username: 'Lizzie',
    role: 'user',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
    joinDate: 'Dec 12, 2023',
    postCount: 12,
    bio: 'Just here for the history.',
    achievements: ['1', '2'],
  },
}

export const categories = [
  {
    id: 'c1',
    title: 'General Discussion',
    description: 'Discuss anything related to Age of Empires III: Definitive Edition.',
    iconName: 'Scroll',
    topicCount: 1245,
    postCount: 8932,
    backgroundImage:
      'https://cdn.magicpatterns.com/uploads/nqwtAMDkoHEAhDJ5qQpqJn/aoe-3.jpg',
  },
  {
    id: 'c2',
    title: 'Strategy & Tactics',
    description: 'Share build orders, combat tactics, and deck strategies.',
    iconName: 'Swords',
    topicCount: 856,
    postCount: 5421,
    backgroundImage:
      'https://cdn.magicpatterns.com/uploads/7bcwMP2sqDrc7nC6BGz1Yc/age-of-empires-35.jpg',
  },
  {
    id: 'c3',
    title: 'Civilizations',
    description: 'In-depth discussion about specific civilizations and their bonuses.',
    iconName: 'Flag',
    topicCount: 632,
    postCount: 4102,
    backgroundImage:
      'https://cdn.magicpatterns.com/uploads/7Heyziq6jW2xmPj6yEFs9N/ss_be0280e3c0013234dd6f55eedd021afcb4184594.1920x1080.jpg',
  },
  {
    id: 'c4',
    title: 'Multiplayer',
    description: 'Find players, discuss ranked play, and organize tournaments.',
    iconName: 'Handshake',
    topicCount: 421,
    postCount: 2100,
    backgroundImage:
      'https://cdn.magicpatterns.com/uploads/qNTG87Q4PGpGDmtU6Ae4oF/images.jpg',
  },
  {
    id: 'c5',
    title: 'Modding & Scenarios',
    description: 'Share your custom scenarios, mods, and map creations.',
    iconName: 'Wrench',
    topicCount: 312,
    postCount: 1540,
    backgroundImage:
      'https://cdn.magicpatterns.com/uploads/6VtQfUQujsm64DA7sH3hZT/181b573ea4b11e13a45344356c114e38035f584d.jpg',
  },
]

export const topics = [
  {
    id: 't1',
    categoryId: 'c1',
    title: 'Welcome to the New Imperial Forum',
    authorId: 'u1',
    createdAt: '2023-10-15T10:00:00Z',
    replyCount: 156,
    viewCount: 5432,
    lastActivity: '2 hours ago',
    isPinned: true,
  },
  {
    id: 't2',
    categoryId: 'c2',
    title: 'Dutch FF Strategy Guide (2024)',
    authorId: 'u2',
    createdAt: '2024-01-20T14:30:00Z',
    replyCount: 42,
    viewCount: 1205,
    lastActivity: '5 mins ago',
  },
  {
    id: 't3',
    categoryId: 'c2',
    title: 'How to counter Ottoman rush?',
    authorId: 'u3',
    createdAt: '2024-02-10T09:15:00Z',
    replyCount: 18,
    viewCount: 450,
    lastActivity: '1 day ago',
  },
  {
    id: 't4',
    categoryId: 'c3',
    title: 'USA Civ: State Militia vs Regulars',
    authorId: 'u4',
    createdAt: '2024-02-12T16:45:00Z',
    replyCount: 8,
    viewCount: 210,
    lastActivity: '3 hours ago',
  },
  {
    id: 't5',
    categoryId: 'c1',
    title: 'Patch 13.5469 Discussion',
    authorId: 'u1',
    createdAt: '2024-02-01T11:00:00Z',
    replyCount: 89,
    viewCount: 3400,
    lastActivity: '10 mins ago',
    isPinned: true,
  },
]

export const posts = [
  {
    id: 'p1',
    topicId: 't1',
    authorId: 'u1',
    content:
      'Greetings, Governors and Generals! Welcome to the newly renovated Imperial Forum. Here you may discuss matters of state, strategy, and conquest. Please adhere to the Articles of War (rules) and treat your fellow commanders with respect.',
    createdAt: '2023-10-15T10:00:00Z',
  },
  {
    id: 'p2',
    topicId: 't1',
    authorId: 'u2',
    content:
      'A magnificent upgrade! The new parchment feels much more authentic than the old paper. I look forward to sharing my naval strategies here.',
    createdAt: '2023-10-15T10:15:00Z',
  },
  {
    id: 'p3',
    topicId: 't1',
    authorId: 'u3',
    content:
      'Finally, a place worthy of the Circle of Ossus. The wood carving detail is exquisite.',
    createdAt: '2023-10-15T11:30:00Z',
  },
  {
    id: 'p4',
    topicId: 't2',
    authorId: 'u2',
    content:
      'The Dutch Fast Fortress is a classic strategy. Start by building a bank as soon as possible. Send 3 Settlers, then 700 Wood. Use the wood to build a barracks and houses...',
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'p5',
    topicId: 't2',
    authorId: 'u4',
    content:
      'Does this still work in the current patch? I feel like the timing is tighter now with the skirmisher cost changes.',
    createdAt: '2024-01-20T15:45:00Z',
  },
]

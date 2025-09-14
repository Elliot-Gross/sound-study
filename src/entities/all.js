/**
 * Minimal local mocks so pages render without Base44 backend.
 * You can expand/replace these later with real data calls.
 */
export const Song = {
  async list(order = "-created_date", limit = 50) {
    const subjects = ["math","science","history","literature"];
    const songs = Array.from({ length: 24 }).map((_, i) => ({
      id: String(i + 1),
      title: `Sample Song ${i + 1}`,
      subject: subjects[i % subjects.length],
      plays: Math.floor(Math.random() * 300),
      created_date: new Date(Date.now() - i * 36e5).toISOString(),
    }));
    let list = [...songs];
    if (order === "-created_date") list.sort((a,b)=> (a.created_date < b.created_date ? 1 : -1));
    if (order === "plays") list.sort((a,b)=> b.plays - a.plays);
    return list.slice(0, limit);
  },
};

export const User = {
  async me() {
    return { id: "u1", name: "You", interests: ["math","music"] };
  },
};

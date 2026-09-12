const skillCategories = [
  {
    category: 'Frontend',
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'Expo',
      'React Native',
    ],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST APIs', 'NestJS'],
  },
  {
    category: 'Tools & Platform',
    skills: ['Git', 'Docker', 'Vercel', 'AWS', 'CI/CD', 'GitHub Actions', 'Digital Ocean'],
  },
  {
    category: 'Design',
    skills: ['UI/UX Design', 'Figma', 'Responsive Design', 'Accessibility', 'Web Performance'],
  },
]

export function Skills() {
  return (
    <section
      id="skills"
      className="bg-card border-border mx-4 max-w-5xl rounded-lg border-y px-4 py-20 md:mx-auto md:px-12"
    >
      <div className="mb-12 space-y-4">
        <p className="text-primary text-sm font-semibold tracking-wider uppercase">Expertise</p>
        <h2 className="text-foreground text-4xl font-bold md:text-5xl">Skills & Technologies</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {skillCategories.map((cat, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-foreground text-lg font-bold">{cat.category}</h3>
            <ul className="list-inside list-disc space-y-2">
              {cat.skills.map((skill, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="text-muted-foreground">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

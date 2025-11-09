const skillCategories = [
  {
    category: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Expo", "React Native"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs", "NestJS"],
  },
  {
    category: "Tools & Platform",
    skills: ["Git", "Docker", "Vercel", "AWS", "CI/CD", "GitHub Actions", "Digital Ocean"],
  },
  {
    category: "Design",
    skills: [
      "UI/UX Design",
      "Figma",
      "Responsive Design",
      "Accessibility",
      "Web Performance",
    ],
  },
];

export function Skills() {
  return (
    <section
      id="skills"
      className="px-4 py-20 mx-4 max-w-5xl rounded-lg md:mx-auto bg-card border-y border-border md:px-12"
    >
      <div className="mb-12 space-y-4">
        <p className="text-sm font-semibold tracking-wider uppercase text-primary">
          Expertise
        </p>
        <h2 className="text-4xl font-bold md:text-5xl text-foreground">
          Skills & Technologies
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {skillCategories.map((cat, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              {cat.category}
            </h3>
            <ul className="space-y-2 list-disc list-inside">
              {cat.skills.map((skill, idx) => (
                <li key={idx} className="flex gap-3 items-center">
                  
                  <span className="text-muted-foreground">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

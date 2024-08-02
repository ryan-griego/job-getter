export const useGlobalState = () => {
  const state = useState('global', () => ({
    rowData: null,
    keywords: [
      "PHP",
      "JavaScript",
      "TypeScript",
      "React",
      "NextJS",
      "Next.js",
      "Vue",
      "Nuxt",
      "HTML",
      "CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "SQL",
      "Git",
      "GitHub",
      "Webpack",
      "Babel",
      "GSAP",
      "MySQL",
      "Tailwind CSS",
      "AWS",
    ]
  }))

  return state
}

export const useGlobalState = () => {
  const state = useState('global', () => ({
    rowData: null,
    keywords: [
      "PHP",
      "Nuxt.js",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "React",
      "Vue",
      "HTML",
      "CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "SQL",
      "Git",
      "Webpack",
      "Babel",
      "GSAP",
      "MySQL",
      "Tailwind CSS",
    ]
  }))

  return state
}

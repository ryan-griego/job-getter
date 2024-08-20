export const useGlobalState = () => {
  const state = useState('global', () => ({
    hiringContacts: [
      {
        "first_name": "John",
        "last_name": "Doe",
        "company_email": "ryangriego@gmail.com",
        "linkedin_url": "https://linkedin.com/in/johndoe"
      },
      {
        "first_name": "Jane",
        "last_name": "Smith",
        "company_email": "ryangriego@gmail.com",
        "linkedin_url": "https://linkedin.com/in/janesmith"
      },
      {
        "first_name": "Alice",
        "last_name": "Johnson",
        "company_email": "ryangriego@gmail.com",
        "linkedin_url": "https://linkedin.com/in/alicejohnson"
      }
    ],

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

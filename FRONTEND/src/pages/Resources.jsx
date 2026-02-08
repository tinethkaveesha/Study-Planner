export default function Resources() {
  const resources = [
    {
      id: 1,
      title: "Calculus Basics",
      type: "Video",
      subject: "Mathematics",
      duration: "45 min",
      difficulty: "Beginner",
      url: "https://www.youtube.com/watch?v=mRCXh__pexQ&list=PLmdFyQYShrjd4Qn42rcBeFvF6Qs-b6e-L",
    },
    {
      id: 2,
      title: "Newton's Laws of Motion",
      type: "Article",
      subject: "Physics",
      duration: "20 min read",
      difficulty: "Intermediate",
      url: "https://en.wikipedia.org/wiki/Newton%27s_laws_of_motion",
    },
    {
      id: 3,
      title: "Organic Chemistry Reactions",
      type: "Interactive",
      subject: "Chemistry",
      duration: "60 min",
      difficulty: "Intermediate",
      url: "https://interactivechemistry.org/",
    },
    {
      id: 4,
      title: "Shakespeare's Sonnets",
      type: "Document",
      subject: "English",
      duration: "30 min read",
      difficulty: "Beginner",
      url: "https://nosweatshakespeare.com/sonnets/",
    },
    // Mathematics

    // Extra Learning
    {
      id: 45,
      title: "Study Skills",
      type: "Article",
      subject: "General",
      duration: "20 min read",
      difficulty: "Beginner",
      url: "https://www.mindtools.com/pages/main/newMN_HTE.htm",
    },
    {
      id: 46,
      title: "Time Management",
      type: "Video",
      subject: "General",
      duration: "25 min",
      difficulty: "Beginner",
      url: "https://www.youtube.com/watch?v=oTugjssqOT0",
    },
    {
      id: 47,
      title: "Critical Thinking",
      type: "Article",
      subject: "General",
      duration: "30 min read",
      difficulty: "Intermediate",
      url: "https://www.skillsyouneed.com/learn/critical-thinking.html",
    },
    {
      id: 48,
      title: "Problem Solving",
      type: "Course",
      subject: "General",
      duration: "1 hr",
      difficulty: "Intermediate",
      url: "https://www.coursera.org/learn/problem-solving",
    },
    {
      id: 49,
      title: "Exam Preparation Tips",
      type: "Article",
      subject: "General",
      duration: "15 min read",
      difficulty: "Beginner",
      url: "https://www.topuniversities.com/student-info/health-and-support/exam-preparation-tips",
    },

    // More Mathematics
    {
      id: 50,
      title: "Coordinate Geometry",
      type: "Video",
      subject: "Mathematics",
      duration: "40 min",
      difficulty: "Intermediate",
      url: "https://www.khanacademy.org/math/geometry/hs-geo-analytic-geometry",
    },
    {
      id: 51,
      title: "Functions & Graphs",
      type: "Article",
      subject: "Mathematics",
      duration: "30 min read",
      difficulty: "Intermediate",
      url: "https://www.mathsisfun.com/sets/function.html",
    },
    {
      id: 52,
      title: "Limits & Continuity",
      type: "Video",
      subject: "Mathematics",
      duration: "50 min",
      difficulty: "Advanced",
      url: "https://www.khanacademy.org/math/calculus-1/cs1-limits-and-continuity",
    },
    {
      id: 53,
      title: "Matrices",
      type: "Article",
      subject: "Mathematics",
      duration: "25 min read",
      difficulty: "Intermediate",
      url: "https://www.mathsisfun.com/algebra/matrix-introduction.html",
    },
    {
      id: 54,
      title: "Differentiation",
      type: "Video",
      subject: "Mathematics",
      duration: "45 min",
      difficulty: "Advanced",
      url: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives",
    },

    // Physics Continued
    {
      id: 55,
      title: "Laws of Motion Problems",
      type: "Article",
      subject: "Physics",
      duration: "30 min read",
      difficulty: "Intermediate",
      url: "https://www.physicsclassroom.com/class/newtlaws",
    },
    {
      id: 56,
      title: "Gravitation",
      type: "Video",
      subject: "Physics",
      duration: "35 min",
      difficulty: "Intermediate",
      url: "https://www.khanacademy.org/science/physics/centripetal-force-and-gravitation",
    },
    {
      id: 57,
      title: "Magnetism",
      type: "Article",
      subject: "Physics",
      duration: "25 min read",
      difficulty: "Beginner",
      url: "https://www.britannica.com/science/magnetism",
    },
    {
      id: 58,
      title: "Thermodynamics",
      type: "Video",
      subject: "Physics",
      duration: "50 min",
      difficulty: "Advanced",
      url: "https://www.khanacademy.org/science/physics/thermodynamics",
    },
    {
      id: 59,
      title: "Nuclear Physics",
      type: "Article",
      subject: "Physics",
      duration: "35 min read",
      difficulty: "Advanced",
      url: "https://www.britannica.com/science/nuclear-physics",
    },

    // Chemistry Continued
    {
      id: 60,
      title: "Atomic Structure",
      type: "Video",
      subject: "Chemistry",
      duration: "30 min",
      difficulty: "Beginner",
      url: "https://www.khanacademy.org/science/chemistry/atomic-structure-and-properties",
    },
    {
      id: 61,
      title: "Thermochemistry",
      type: "Article",
      subject: "Chemistry",
      duration: "30 min read",
      difficulty: "Intermediate",
      url: "https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry",
    },
    {
      id: 62,
      title: "Chemical Kinetics",
      type: "Video",
      subject: "Chemistry",
      duration: "40 min",
      difficulty: "Advanced",
      url: "https://www.khanacademy.org/science/chemistry/chemical-reactions-rates",
    },
    {
      id: 63,
      title: "Solutions & Solubility",
      type: "Article",
      subject: "Chemistry",
      duration: "25 min read",
      difficulty: "Intermediate",
      url: "https://www.britannica.com/science/solution-chemistry",
    },
    {
      id: 64,
      title: "Environmental Chemistry",
      type: "Video",
      subject: "Chemistry",
      duration: "35 min",
      difficulty: "Beginner",
      url: "https://www.khanacademy.org/science/ap-chemistry-beta/x2eef969c74e0d802:applications-of-chemistry",
    },

    // Biology Continued
    {
      id: 65,
      title: "Cell Division",
      type: "Video",
      subject: "Biology",
      duration: "30 min",
      difficulty: "Beginner",
      url: "https://www.khanacademy.org/science/biology/cellular-molecular-biology/mitosis-meiosis",
    },
    {
      id: 66,
      title: "Respiration",
      type: "Article",
      subject: "Biology",
      duration: "20 min read",
      difficulty: "Beginner",
      url: "https://www.britannica.com/science/cellular-respiration",
    },
    {
      id: 67,
      title: "Nervous System",
      type: "Video",
      subject: "Biology",
      duration: "40 min",
      difficulty: "Intermediate",
      url: "https://www.khanacademy.org/science/biology/human-biology/neuron-nervous-system",
    },
    {
      id: 68,
      title: "Immune System",
      type: "Article",
      subject: "Biology",
      duration: "30 min read",
      difficulty: "Intermediate",
      url: "https://www.nature.com/subjects/immune-system",
    },
    {
      id: 69,
      title: "Biotechnology",
      type: "Video",
      subject: "Biology",
      duration: "45 min",
      difficulty: "Advanced",
      url: "https://www.khanacademy.org/science/ap-biology/gene-expression-and-regulation",
    },

    // Computer Science Continued
    {
      id: 70,
      title: "Python Basics",
      type: "Course",
      subject: "Computer Science",
      duration: "2 hrs",
      difficulty: "Beginner",
      url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
    },
    {
      id: 71,
      title: "Algorithms Intro",
      type: "Video",
      subject: "Computer Science",
      duration: "50 min",
      difficulty: "Intermediate",
      url: "https://www.khanacademy.org/computing/computer-science/algorithms",
    },
    {
      id: 72,
      title: "Git & GitHub",
      type: "Article",
      subject: "Computer Science",
      duration: "30 min read",
      difficulty: "Beginner",
      url: "https://www.atlassian.com/git/tutorials",
    },
    {
      id: 73,
      title: "APIs Explained",
      type: "Video",
      subject: "Computer Science",
      duration: "25 min",
      difficulty: "Intermediate",
      url: "https://www.youtube.com/watch?v=GZvSYJDk-us",
    },
    {
      id: 74,
      title: "Cybersecurity Basics",
      type: "Article",
      subject: "Computer Science",
      duration: "35 min read",
      difficulty: "Beginner",
      url: "https://www.cloudflare.com/learning/",
    },

    // English Continued
    {
      id: 75,
      title: "Comprehension Skills",
      type: "Article",
      subject: "English",
      duration: "20 min read",
      difficulty: "Beginner",
      url: "https://www.readingrockets.org/strategies",
    },
    {
      id: 76,
      title: "Speech Writing",
      type: "Video",
      subject: "English",
      duration: "30 min",
      difficulty: "Intermediate",
      url: "https://www.youtube.com/watch?v=Unzc731iCUY",
    },
    {
      id: 77,
      title: "Drama & Plays",
      type: "Article",
      subject: "English",
      duration: "30 min read",
      difficulty: "Intermediate",
      url: "https://www.britannica.com/art/drama-literature",
    },
    {
      id: 78,
      title: "Vocabulary Building",
      type: "Interactive",
      subject: "English",
      duration: "20 min",
      difficulty: "Beginner",
      url: "https://www.vocabulary.com/",
    },
    {
      id: 79,
      title: "Literary Devices",
      type: "Article",
      subject: "English",
      duration: "25 min read",
      difficulty: "Intermediate",
      url: "https://literarydevices.net/",
    },

    // History, Geography, Civics
    {
      id: 80,
      title: "Cold War",
      type: "Video",
      subject: "History",
      duration: "40 min",
      difficulty: "Intermediate",
      url: "https://www.khanacademy.org/humanities/world-history/euro-hist/cold-war-era",
    },
    {
      id: 81,
      title: "Industrial Revolution",
      type: "Article",
      subject: "History",
      duration: "35 min read",
      difficulty: "Beginner",
      url: "https://www.history.com/topics/industrial-revolution",
    },
    {
      id: 82,
      title: "Population Geography",
      type: "Video",
      subject: "Geography",
      duration: "30 min",
      difficulty: "Beginner",
      url: "https://www.khanacademy.org/humanities/ap-human-geography",
    },
    {
      id: 83,
      title: "Natural Resources",
      type: "Article",
      subject: "Geography",
      duration: "25 min read",
      difficulty: "Beginner",
      url: "https://www.nationalgeographic.org/encyclopedia/resource/",
    },
    {
      id: 84,
      title: "Democracy & Government",
      type: "Article",
      subject: "Civics",
      duration: "30 min read",
      difficulty: "Beginner",
      url: "https://www.britannica.com/topic/democracy",
    },

    // Economics, Business, Life Skills
    {
      id: 85,
      title: "Inflation Explained",
      type: "Video",
      subject: "Economics",
      duration: "20 min",
      difficulty: "Beginner",
      url: "https://www.khanacademy.org/economics-finance-domain/macroeconomics",
    },
    {
      id: 86,
      title: "Budgeting Basics",
      type: "Article",
      subject: "Economics",
      duration: "20 min read",
      difficulty: "Beginner",
      url: "https://www.investopedia.com/budgeting-basics-5184345",
    },
    {
      id: 87,
      title: "Personal Finance",
      type: "Course",
      subject: "Business",
      duration: "1 hr",
      difficulty: "Beginner",
      url: "https://www.khanacademy.org/college-careers-more/personal-finance",
    },
    {
      id: 88,
      title: "Leadership Skills",
      type: "Article",
      subject: "Business",
      duration: "25 min read",
      difficulty: "Intermediate",
      url: "https://www.mindtools.com/pages/main/newMN_LDR.htm",
    },
    {
      id: 89,
      title: "Public Speaking",
      type: "Video",
      subject: "Business",
      duration: "30 min",
      difficulty: "Intermediate",
      url: "https://www.youtube.com/watch?v=HAnw168huqA",
    },

    // General Skills
    {
      id: 90,
      title: "Memory Techniques",
      type: "Article",
      subject: "General",
      duration: "15 min read",
      difficulty: "Beginner",
      url: "https://www.verywellmind.com/memory-techniques-2795356",
    },
    {
      id: 91,
      title: "Note Taking Methods",
      type: "Video",
      subject: "General",
      duration: "20 min",
      difficulty: "Beginner",
      url: "https://www.youtube.com/watch?v=AffuwyJZTQQ",
    },
    {
      id: 92,
      title: "Mind Mapping",
      type: "Interactive",
      subject: "General",
      duration: "20 min",
      difficulty: "Beginner",
      url: "https://www.mindmeister.com/",
    },
    {
      id: 93,
      title: "Focus & Concentration",
      type: "Article",
      subject: "General",
      duration: "15 min read",
      difficulty: "Beginner",
      url: "https://www.healthline.com/health/how-to-improve-concentration",
    },
    {
      id: 94,
      title: "Stress Management",
      type: "Video",
      subject: "General",
      duration: "25 min",
      difficulty: "Beginner",
      url: "https://www.youtube.com/watch?v=hnpQrMqDoqE",
    },

    // Final Entries
    {
      id: 95,
      title: "Online Learning Tips",
      type: "Article",
      subject: "General",
      duration: "15 min read",
      difficulty: "Beginner",
      url: "https://www.edutopia.org/online-learning",
    },
    {
      id: 96,
      title: "Career Planning",
      type: "Video",
      subject: "General",
      duration: "30 min",
      difficulty: "Beginner",
      url: "https://www.youtube.com/watch?v=J5k8ZQsZJpk",
    },
    {
      id: 97,
      title: "Scholarship Search",
      type: "Article",
      subject: "General",
      duration: "20 min read",
      difficulty: "Beginner",
      url: "https://www.scholarships.com/",
    },
    {
      id: 98,
      title: "Resume Writing",
      type: "Article",
      subject: "General",
      duration: "25 min read",
      difficulty: "Intermediate",
      url: "https://zety.com/blog/resume-writing",
    },
    {
      id: 99,
      title: "Interview Skills",
      type: "Video",
      subject: "General",
      duration: "30 min",
      difficulty: "Intermediate",
      url: "https://www.youtube.com/watch?v=HG68Ymazo18",
    },
    {
      id: 100,
      title: "Lifelong Learning",
      type: "Article",
      subject: "General",
      duration: "15 min read",
      difficulty: "Beginner",
      url: "https://www.futurelearn.com/info/blog/what-is-lifelong-learning",
    },
  ];

  return (
    <main className="flex-1">
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span>📖</span>Resource Curator
            </h1>
            <p className="text-lg text-gray-600">
              Discover AI-powered learning resources tailored to your needs.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <input
              type="text"
              placeholder="Search resources..."
              className="md:col-span-2 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700">
              <option>All Types</option>
              <option>Video</option>
              <option>Article</option>
              <option>Interactive</option>
            </select>
            <select className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700">
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {resource.title}
                    </h3>
                    <p className="text-amber-700 text-sm mt-1">
                      {resource.subject}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                    {resource.type}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-gray-600 text-sm">
                    ⏱️ Duration: {resource.duration}
                  </p>
                  <p className="text-gray-600 text-sm">
                    📊 Level: {resource.difficulty}
                  </p>
                </div>

                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all text-center"
                  >
                    📥 Download Resource
                  </a>
                ) : (
                  <button className="w-full py-2 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-all">
                    📥 Download Resource
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// Simulates a delay to mimic API response time
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generateMaterials = async (jobDescription, companyDescription, resumeContext) => {
  // Simulate API delay
  await delay(2000);

  // Mock response data
  return {
    email: {
      subject_line: "Application for Software Engineer Position",
      greeting: "Dear Hiring Manager,",
      body_paragraphs: [
        "I am writing to express my strong interest in the Software Engineer position at your company. With my background in software development and experience leading engineering teams, I believe I would be a valuable addition to your organization.",
        "In my current role at Tech Corp, I have successfully led a team of 5 engineers and achieved a 40% improvement in system performance. My technical expertise in Python, FastAPI, React, and AWS aligns perfectly with your requirements.",
        "I am particularly drawn to your company's innovative approach to technology solutions and your commitment to fostering a collaborative work environment. Your focus on continuous learning and professional growth resonates with my career aspirations."
      ],
      closing: "Thank you for considering my application. I look forward to discussing how I can contribute to your team.",
      signature: "Best regards,\nJohn Doe",
      follow_up_note: "Follow up in one week if no response"
    },
    memo: {
      title: "Application Strategy Memo",
      author_info: {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "(555) 123-4567"
      },
      sections: [
        {
          title: "Background Research",
          content: "Company is a leader in technology solutions with a strong focus on innovation and team collaboration."
        },
        {
          title: "Key Qualifications",
          content: "Technical expertise matches job requirements. Leadership experience demonstrates growth potential."
        },
        {
          title: "Strategy",
          content: "Emphasize technical skills and team leadership experience. Highlight successful project outcomes."
        }
      ]
    },
    quality_score: 95,
    context_analysis: {
      job_requirements: ["Software development", "Team leadership", "System optimization"],
      company_culture: ["Innovative", "Collaborative", "Growth-oriented"],
      key_skills_matched: ["Python", "FastAPI", "React", "AWS"]
    },
    strategy: {
      approach: "Focus on technical expertise and leadership experience",
      key_points: ["Team leadership", "Performance optimization", "Technical stack alignment"]
    }
  };
}; 
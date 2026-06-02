const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const AnalysisRun = require('../models/AnalysisRun');
const { calculateATSScore } = require('../utils/atsScoring');
const { getGeminiModel } = require('../config/gemini');

/**
 * Analyze resume and generate ATS score with job suggestions
 */
exports.analyzeResume = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Get resume
    const resume = await Resume.findOne({ email });
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found. Please upload resume first.',
      });
    }

    // Calculate ATS Score
    console.log(`📊 Calculating ATS score for: ${email}`);
    const { totalScore, breakdown } = calculateATSScore(resume.extractedText);

    // Get job suggestions from Gemini
    console.log(`🤖 Generating job suggestions using Gemini AI...`);
    let jobSuggestions = [];

    try {
      const model = getGeminiModel();
      const prompt = `You are a career counselor analyzing a resume. Based on this resume, suggest 5 suitable job roles.

Resume Content:
${resume.extractedText.substring(0, 2000)}

Analyze the candidate's:
- Skills and expertise
- Experience level
- Educational background
- Career trajectory

Return ONLY a JSON array with 5 job suggestions. Each should have:
- title: Job role name
- matchPercentage: Number between 60-95 (realistic match score)
- reason: Brief explanation (1-2 sentences) why this role matches

Format:
[{"title": "Job Title", "matchPercentage": 85, "reason": "Explanation here"}]

Return ONLY the JSON array, no other text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON from response
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        // Validate and filter valid suggestions
        jobSuggestions = parsedData
          .filter(job => job.title && job.matchPercentage && job.reason)
          .slice(0, 5);

        console.log(`✅ Generated ${jobSuggestions.length} job suggestions`);
      }
    } catch (geminiError) {
      console.error('⚠️ Gemini API error:', geminiError.message);
      // Fallback job suggestions
      jobSuggestions = generateFallbackJobSuggestions(resume.extractedText);
    }

    // Ensure we have at least some suggestions
    if (jobSuggestions.length === 0) {
      jobSuggestions = generateFallbackJobSuggestions(resume.extractedText);
    }

    // Save history run
    await AnalysisRun.create({
      email,
      atsScore: totalScore,
      scoreBreakdown: breakdown,
      jobSuggestions,
    });

    // Fetch previous run to compare
    const previousRun = await AnalysisRun.findOne({ email }).sort({ createdAt: -1 }).skip(1);
    const comparison = previousRun
      ? { previousScore: previousRun.atsScore, delta: totalScore - previousRun.atsScore }
      : { previousScore: null, delta: null };

    // Generate improvement suggestions (fallback, no Gemini required)
    const improvementSuggestions = [];
    if ((breakdown.keywords || 0) < 60) {
      improvementSuggestions.push('Add role-specific keywords from job descriptions to your resume.');
    }
    if ((breakdown.formatting || 0) < 60) {
      improvementSuggestions.push('Ensure clear section headings and consistent formatting.');
    }
    if ((breakdown.experience || 0) < 60) {
      improvementSuggestions.push('Quantify achievements with metrics and outcomes.');
    }
    if ((breakdown.skills || 0) < 60) {
      improvementSuggestions.push('List core technical and soft skills relevant to the target role.');
    }
    if ((breakdown.education || 0) < 50) {
      improvementSuggestions.push('Include certifications or courses that strengthen your profile.');
    }

    // Save or update analysis
    let analysis = await Analysis.findOne({ email });

    if (analysis) {
      analysis.atsScore = totalScore;
      analysis.scoreBreakdown = breakdown;
      analysis.jobSuggestions = jobSuggestions;
      analysis.analyzedAt = Date.now();
      analysis.improvementSuggestions = improvementSuggestions;
      await analysis.save();
      console.log(`✅ Updated existing analysis for: ${email}`);
    } else {
      analysis = await Analysis.create({
        email,
        atsScore: totalScore,
        scoreBreakdown: breakdown,
        jobSuggestions,
        improvementSuggestions,
      });
      console.log(`✅ Created new analysis for: ${email}`);
    }

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: { ...analysis.toObject(), comparison },
    });
  } catch (error) {
    console.error('❌ Error in analyzeResume:', error);
    next(error);
  }
};

/**
 * Generate personalized career development plan
 */
exports.generateCareerPlan = async (req, res, next) => {
  try {
    const { email, targetJob } = req.body;

    // Validate inputs
    if (!email || !targetJob) {
      return res.status(400).json({
        success: false,
        error: 'Email and target job are required',
      });
    }

    // Get resume
    const resume = await Resume.findOne({ email });
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found. Please upload resume first.',
      });
    }

    console.log(`🎯 Generating career plan for: ${email} → ${targetJob}`);

    let planData = {};

    try {
      const model = getGeminiModel();

      const prompt = `Analyze this resume for the target job: "${targetJob}".

Resume: ${resume.extractedText.substring(0, 2500)}

Create a 3-month career development plan as plain text in this format:

**Month 1: Foundation Building**

* **Goal:** Clear objective for this month
* **Activities:**
    * Activity 1 with specific steps
    * Activity 2 with resources
    * Activity 3 with time needed
* **Deliverables:** What to complete by end of month

**Month 2: Skill Development**

* **Goal:** Clear objective for this month
* **Activities:**
    * Activity 1 with specific steps
    * Activity 2 with resources
    * Activity 3 with time needed
* **Deliverables:** What to complete by end of month

**Month 3: Portfolio & Practice**

* **Goal:** Clear objective for this month
* **Activities:**
    * Activity 1 with specific steps
    * Activity 2 with resources
    * Activity 3 with time needed
* **Deliverables:** What to complete by end of month

At the end, list:
Required Skills: skill1, skill2, skill3
Missing Skills: skill4, skill5

Make it specific and actionable for ${targetJob}.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response
      let careerPlanText = text.trim();

      // Extract skills from the text
      const requiredMatch = careerPlanText.match(/Required [Ss]kills?:\s*(.+?)(?:\n|$)/);
      const missingMatch = careerPlanText.match(/Missing [Ss]kills?:\s*(.+?)(?:\n|$)/);

      const requiredSkills = requiredMatch
        ? requiredMatch[1].split(',').map(s => s.trim()).filter(Boolean)
        : ["Technical Skills", "Communication", "Problem Solving"];

      const missingSkills = missingMatch
        ? missingMatch[1].split(',').map(s => s.trim()).filter(Boolean)
        : [];

      // Remove skill lists from plan text to keep it clean
      careerPlanText = careerPlanText
        .replace(/Required [Ss]kills?:.*$/m, '')
        .replace(/Missing [Ss]kills?:.*$/m, '')
        .trim();

      planData = {
        requiredSkills,
        missingSkills,
        careerPlan: careerPlanText
      };

      console.log(`✅ Generated career plan successfully`);

    } catch (geminiError) {
      console.error('⚠️ Gemini API error:', geminiError.message);
      planData = generateFallbackCareerPlan(targetJob);
    }

    // CRITICAL: Ensure careerPlan is always a string
    if (typeof planData.careerPlan !== 'string') {
      planData.careerPlan = String(planData.careerPlan);
    }

    // Validate arrays
    if (!Array.isArray(planData.requiredSkills)) {
      planData.requiredSkills = ["Technical Skills"];
    }
    if (!Array.isArray(planData.missingSkills)) {
      planData.missingSkills = [];
    }

    // Update analysis
    const analysis = await Analysis.findOneAndUpdate(
      { email },
      {
        targetJob: {
          title: targetJob,
          requiredSkills: planData.requiredSkills,
          missingSkills: planData.missingSkills,
        },
        careerPlan: planData.careerPlan, // Now guaranteed to be a string
      },
      { new: true, upsert: true }
    );

    console.log(`✅ Career plan saved for: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Career plan generated successfully',
      data: analysis,
    });
  } catch (error) {
    console.error('❌ Error in generateCareerPlan:', error);
    next(error);
  }
};

/**
 * Get existing analysis for a user
 */
exports.getAnalysis = async (req, res, next) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    const analysis = await Analysis.findOne({ email });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found. Please analyze your resume first.',
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('❌ Error in getAnalysis:', error);
    next(error);
  }
};

/**
 * Get analysis history runs for a user
 */
exports.getHistory = async (req, res, next) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const runs = await AnalysisRun.find({ email }).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, data: runs });
  } catch (error) {
    console.error('❌ Error in getHistory:', error);
    next(error);
  }
};
/**
 * Helper: Generate fallback job suggestions
 */
function generateFallbackJobSuggestions(resumeText) {
  const suggestions = [];
  const lowerText = resumeText.toLowerCase();

  // Check for common keywords and suggest relevant jobs
  const jobMappings = [
    {
      keywords: ['python', 'machine learning', 'data', 'ai', 'ml'],
      job: {
        title: "Data Scientist",
        matchPercentage: 75,
        reason: "Your background shows strong analytical and programming skills relevant to data science."
      }
    },
    {
      keywords: ['javascript', 'react', 'frontend', 'web', 'html', 'css'],
      job: {
        title: "Frontend Developer",
        matchPercentage: 80,
        reason: "Your web development skills align well with frontend development roles."
      }
    },
    {
      keywords: ['java', 'backend', 'api', 'database', 'sql'],
      job: {
        title: "Backend Developer",
        matchPercentage: 78,
        reason: "Your server-side development experience matches backend engineering requirements."
      }
    },
    {
      keywords: ['full stack', 'node', 'mongodb', 'mern', 'mean'],
      job: {
        title: "Full Stack Developer",
        matchPercentage: 82,
        reason: "Your diverse technology stack makes you suitable for full stack positions."
      }
    },
    {
      keywords: ['student', 'intern', 'learning', 'fresher', 'graduate'],
      job: {
        title: "Software Engineering Intern",
        matchPercentage: 85,
        reason: "Your academic background and eagerness to learn make you ideal for internship roles."
      }
    },
  ];

  jobMappings.forEach(mapping => {
    const hasKeyword = mapping.keywords.some(kw => lowerText.includes(kw));
    if (hasKeyword && suggestions.length < 5) {
      suggestions.push(mapping.job);
    }
  });

  // Add generic suggestions if not enough specific ones
  if (suggestions.length < 3) {
    suggestions.push(
      {
        title: "Software Developer",
        matchPercentage: 70,
        reason: "Your technical skills and problem-solving abilities suit software development roles."
      },
      {
        title: "Technical Support Engineer",
        matchPercentage: 68,
        reason: "Your technical knowledge can help in supporting and troubleshooting for customers."
      },
      {
        title: "Junior Developer",
        matchPercentage: 72,
        reason: "Entry-level development roles match your current skill level and experience."
      }
    );
  }

  return suggestions.slice(0, 5);
}

/**
 * Helper: Generate fallback career plan
 */
function generateFallbackCareerPlan(targetJob) {
  const jobTitle = targetJob.toLowerCase();

  // Define skill mappings for common roles
  const roleMappings = [
    {
      keywords: ['frontend', 'react', 'angular', 'vue', 'web', 'ui', 'interface'],
      skills: ["React/Vue/Angular", "JavaScript/TypeScript", "CSS/Tailwind", "Responsive Design", "State Management"],
      missing: ["Next.js", "Web Performance Optimization", "Testing (Jest/Cypress)"]
    },
    {
      keywords: ['backend', 'node', 'express', 'java', 'python', 'api', 'server', 'sql'],
      skills: ["API Design (REST/GraphQL)", "Database Management", "Server-side Logic", "Authentication/Security", "System Design"],
      missing: ["Microservices", "Containerization (Docker)", "Cloud Services (AWS/GCP)"]
    },
    {
      keywords: ['full stack', 'fullstack', 'mern', 'mean'],
      skills: ["Frontend Frameworks", "Backend Development", "Database Design", "API Integration", "Version Control"],
      missing: ["DevOps Basics", "System Architecture", "Advanced Security"]
    },
    {
      keywords: ['data', 'scientist', 'analyst', 'machine learning', 'ai', 'ml'],
      skills: ["Python/R", "Data Visualization", "Statistical Analysis", "Machine Learning Algorithms", "SQL"],
      missing: ["Deep Learning", "Big Data Tools (Spark/Hadoop)", "Model Deployment"]
    },
    {
      keywords: ['designer', 'ux', 'ui', 'product design'],
      skills: ["Figma/Adobe XD", "User Research", "Prototyping", "Visual Design", "Wireframing"],
      missing: ["Design Systems", "Interaction Design", "Frontend Basics"]
    },
    {
      keywords: ['manager', 'management', 'lead', 'product owner'],
      skills: ["Project Management", "Team Leadership", "Strategic Planning", "Stakeholder Communication", "Agile/Scrum"],
      missing: ["Risk Management", "Product Analytics", "Budgeting"]
    }
  ];

  // Find matching role
  const match = roleMappings.find(role =>
    role.keywords.some(keyword => jobTitle.includes(keyword))
  );

  const requiredSkills = match ? match.skills : [
    "Technical Proficiency",
    "Industry Knowledge",
    "Problem Solving",
    "Communication",
    "Project Management"
  ];

  const missingSkills = match ? match.missing : [
    "Advanced Specialized Tools",
    "Leadership Experience",
    "Strategic Analysis"
  ];

  return {
    requiredSkills,
    missingSkills,
    careerPlan: `**Month 1: ${match ? 'Core Concept Mastery' : 'Foundation Building'}**

* **Goal:** ${match ? `Solidify your understanding of core ${targetJob} principles` : `Establish a strong professional foundation for ${targetJob}`}
* **Activities:**
    *   **Week 1-2:** Deep dive into ${requiredSkills[0]} and ${requiredSkills[1]} through structured courses (Udemy/Coursera).
    *   **Week 3:** Build a small proof-of-concept project focusing on ${requiredSkills[2]}.
    *   **Week 4:** Analyze 5 job descriptions for "${targetJob}" to identify specific tool gaps.
* **Deliverables:** Completed course certificates, 1 mini-project, and a personalized learning roadmap.

**Month 2: ${match ? 'Advanced Implementation' : 'Skill Expansion'}**

* **Goal:** Apply skills to real-world scenarios and fill identified gaps
* **Activities:**
    *   **Week 1-2:** Start a significant personal project using ${match ? match.skills[3] : 'industry standard tools'}.
    *   **Week 3:** Focus on strictly learning ${missingSkills[0]} to enhance your marketability.
    *   **Week 4:** Contribute to an open-source project or volunteer to solve a real ${targetJob} problem.
* **Deliverables:** A deploying/working main project, code samples, or case studies.

**Month 3: ${match ? 'Professional Portfolio & Networking' : 'Market Readiness'}**

* **Goal:** Showcase your expertise and prepare for interviews
* **Activities:**
    *   **Week 1-2:** Finalize your portfolio with case studies highlighting your use of ${requiredSkills[0]}.
    *   **Week 3:** Practice interview questions specific to ${targetJob} (Technical and Behavioral).
    *   **Week 4:** Optimize your LinkedIn profile and apply to 10 targeted roles.
* **Deliverables:** Polished portfolio, updated resume, and active job applications.`
  };
}

module.exports = exports;

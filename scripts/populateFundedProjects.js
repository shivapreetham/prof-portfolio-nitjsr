const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || '67ed468b5b281d81f91a0a78';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  console.log('Current env:', process.env.MONGODB_URI);
  process.exit(1);
}

const FundedProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 500 },
  role: { type: String, maxlength: 100 },
  fundingAgency: { type: String, required: true, maxlength: 300 },
  amount: { type: String, maxlength: 100 },
  duration: { type: String, maxlength: 100 },
  projectType: { type: String, enum: ['Sponsored', 'International', 'Other'], default: 'Sponsored' },
  description: { type: String, maxlength: 3000 },
  collaborators: { type: String, maxlength: 500 },
  status: { type: String, enum: ['Ongoing', 'Completed', 'Pending'], default: 'Ongoing' },
  links: [{ type: String }]
}, { timestamps: true });

const FundedProject = mongoose.models.FundedProject || mongoose.model('FundedProject', FundedProjectSchema);

const fundedProjects = [
  {
    title: "Design and Development of Artificial Intelligence based Model for Conversion from Santali to English",
    role: "P.I.",
    fundingAgency: "JCSTI, Ranchi",
    amount: "Rs. 4,00,000/=",
    duration: "2024-2026",
    projectType: "Sponsored",
    status: "Ongoing",
    description: "",
    collaborators: "",
    links: []
  },
  {
    title: "Fusion Technology Development of Electrical Tomography and Machine Learning for High Quality Waste Plastic Recycle",
    role: "",
    fundingAgency: "DST and Japan Society for the Promotion of Science (JSPS)",
    amount: "",
    duration: "2023 [On-going]",
    projectType: "International",
    status: "Ongoing",
    description: "TPN-98840 Under Indo-Japan (JSPS)",
    collaborators: "with Prof. Masahiro Takei, Chiba University, Japan",
    links: []
  },
  {
    title: "Design and Development of Centralized Database on Scholarship/Fellowships in S&T Sector",
    role: "Co-PI",
    fundingAgency: "DST",
    amount: "Rs. 24,12,720/=",
    duration: "",
    projectType: "Sponsored",
    status: "Ongoing",
    description: "",
    collaborators: "",
    links: []
  },
  {
    title: "Design and Implementation of END TO END Object Detector using DETR AND XNOR DETR",
    role: "P.I.",
    fundingAgency: "ARTPARK",
    amount: "Rs. 5,40,000/=",
    duration: "",
    projectType: "Sponsored",
    status: "Ongoing",
    description: "",
    collaborators: "",
    links: []
  },
  {
    title: "Erasmus+ Programme / International Credit Mobility (ICM)",
    role: "",
    fundingAgency: "European Union",
    amount: "11,710 euros",
    duration: "2020",
    projectType: "International",
    status: "Completed",
    description: "",
    collaborators: "with Technical University of Crete (GREECE) - Professor Michalis Zervakis",
    links: []
  },
  {
    title: "Erasmus+ Programme / International Credit Mobility (ICM)",
    role: "",
    fundingAgency: "European Union",
    amount: "11,710 euros",
    duration: "2023",
    projectType: "International",
    status: "Ongoing",
    description: "",
    collaborators: "with Technical University of Crete (GREECE) - Professor Michalis Zervakis",
    links: []
  }
];

async function populateFundedProjects() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    console.log('\n--- Populating Funded Projects ---');

    for (const projectData of fundedProjects) {
      const project = new FundedProject({
        ...projectData,
        userId: DEFAULT_USER_ID
      });

      await project.save();
      console.log(`✓ Added: ${project.title.substring(0, 60)}...`);
    }

    console.log('\n✅ All funded projects populated successfully!');
    console.log(`Total projects added: ${fundedProjects.length}`);

  } catch (error) {
    console.error('❌ Error populating funded projects:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

populateFundedProjects();

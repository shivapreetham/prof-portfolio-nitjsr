import mongoose from 'mongoose';

// Profile Model - Single profile for the professor
const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 100 },
  profileImage: { type: String },
  bio: { type: String },
  location: { type: String, maxlength: 100 },
  linkedIn: { type: String, maxlength: 255 },
}, { timestamps: true });

export const Profile = (mongoose.models && mongoose.models.Profile) || mongoose.model('Profile', ProfileSchema);

// Student Model
export const STUDENT_TYPES = ['bachelor', 'masters', 'phd'];

const StudentSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    research_topic: { type: String, required: true },
    name_of_student: { type: String, required: true },
    completion_year: { type: String, required: true },
    heading: { type: Number, required: true },
    student_type: { type: String, required: true, enum: STUDENT_TYPES },
    image_url: { type: String }
  },
  { timestamps: true });

export const Student = (mongoose.models && mongoose.models.Student) || mongoose.model('Student', StudentSchema);
// Blog Post Model
const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true },
  imageUrl: { type: String }, // Keep for backward compatibility
  mediaFiles: [{
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true },
    filename: { type: String },
    size: { type: Number },
    mimeType: { type: String }
  }]
}, { timestamps: true });

export const BlogPost = (mongoose.models && mongoose.models.BlogPost) || mongoose.model('BlogPost', BlogPostSchema);

// Opinion Piece Model
const OpinionPieceSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true },
  imageUrl: { type: String },
  mediaFiles: [{
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true },
    filename: { type: String },
    size: { type: Number },
    mimeType: { type: String }
  }]
}, { timestamps: true });

export const OpinionPiece = (mongoose.models && mongoose.models.OpinionPiece) || mongoose.model('OpinionPiece', OpinionPieceSchema);

// Meeting Request Model
const MeetingRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 100 },
  subject: { type: String, required: true, maxlength: 200 },
  message: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

export const MeetingRequest = (mongoose.models && mongoose.models.MeetingRequest) || mongoose.model('MeetingRequest', MeetingRequestSchema);

// Teaching Experience Model
const TeachingExperienceSchema = new mongoose.Schema({
  subject: { type: String, required: true, maxlength: 200 },
  institution: { type: String, required: true, maxlength: 200 },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
}, { timestamps: true });

export const TeachingExperience = (mongoose.models && mongoose.models.TeachingExperience) || mongoose.model('TeachingExperience', TeachingExperienceSchema);

// Photo Gallery Model
const PhotoSchema = new mongoose.Schema({
  caption: { type: String },
  date: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

export const Photo = (mongoose.models && mongoose.models.Photo) || mongoose.model('Photo', PhotoSchema);

// Video Gallery Model
const VideoSchema = new mongoose.Schema({
  title: { type: String, maxlength: 200 },
  date: { type: Date, default: Date.now },
  videoUrl: { type: String },
  youtubeUrl: { type: String }
}, { timestamps: true });

export const Video = (mongoose.models && mongoose.models.Video) || mongoose.model('Video', VideoSchema);

// Project Model
// const ProjectSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   collaborators: { type: String },
//   title: { type: String, required: true, maxlength: 200 },
//   description: { type: String, required: true },
//   banner: { type: String },
//   videoUrl: { type: String },
// }, { timestamps: true });

// export const Project = (mongoose.models && mongoose.models.Project) || mongoose.model('Project', ProjectSchema);

// Research Paper Model
const ResearchPaperSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Core info
  title: { type: String, required: true, maxlength: 500 },
  description: { type: String }, // for long summaries like in your second example

  // Category enum for frontend tabs
  category: { 
    type: String, 
    enum: ['International Journal Papers', 'International Conference Papers', 'Books'], 
    required: true 
  },

  // Publication metadata
  journalOrConference: { type: String, maxlength: 500 },
  volume: { type: String },
  pages: { type: String }, // page numbers: "155733 - 155746"
  publishedAt: { type: Date, required: true },

  // Links
  pdfUrl: { type: String },
  externalLink: { type: String }, // "View Article"

  // Authors
  authors: [{ type: String }]

}, { timestamps: true });

export const ResearchPaper = (mongoose.models && mongoose.models.ResearchPaper) || mongoose.model('ResearchPaper', ResearchPaperSchema);


// Conference Model
const ConferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, maxlength: 200 },
  location: { type: String, maxlength: 200 },
  date: { type: Date, required: true },
  paperPresented: { type: Boolean, default: false },
  description: { type: String, maxlength: 3000 }, // for invited talk text
  links: [{ type: String }], // array of URLs or document links
}, { timestamps: true });


export const Conference = (mongoose.models && mongoose.models.Conference) || mongoose.model('Conference', ConferenceSchema);

// // Achievement Model
// const AchievementSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true, maxlength: 200 },
//   description: { type: String, required: true },
//   date: { type: Date, required: true },
// }, { timestamps: true });

// export const Achievement = (mongoose.models && mongoose.models.Achievement) || mongoose.model('Achievement', AchievementSchema);


// // Award Model
const AwardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 200 },
  organization: { type: String, maxlength: 200 },
  date: { type: Date, required: true },
  description: { type: String, maxlength: 3000 }, // for invited talk text
  links: [{ type: String }], // array of URLs or document links
}, { timestamps: true });

export const Award = (mongoose.models && mongoose.models.Award) || mongoose.model('Award', AwardSchema);

// // Collaboration Model
// const CollaborationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   collaboratorName: { type: String, required: true, maxlength: 200 },
//   institution: { type: String, maxlength: 200 },
//   projectTitle: { type: String, required: true, maxlength: 200 },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date },
// }, { timestamps: true });

// export const Collaboration = (mongoose.models && mongoose.models.Collaboration) || mongoose.model('Collaboration', CollaborationSchema);

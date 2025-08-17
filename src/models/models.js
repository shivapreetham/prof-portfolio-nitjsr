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
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  course: { type: String, required: true },        // e.g., B.Tech, M.Tech, Ph.D.
  branch: { type: String, required: true },        // e.g., CSE, ECE
  projectTitle: { type: String, required: true, maxlength: 200 },
  projectDescription: { type: String },            // optional, short summary
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  imageUrl: { type: String, required: true },      // uploaded image path or CDN URL
  bio: { type: String, maxlength: 500 },           // short about student
}, { timestamps: true });

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
  title: { type: String, maxlength: 200 },
  caption: { type: String },
  order: { type: Number },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

export const Photo = (mongoose.models && mongoose.models.Photo) || mongoose.model('Photo', PhotoSchema);

// Video Gallery Model
const VideoSchema = new mongoose.Schema({
  title: { type: String, maxlength: 200 },
  description: { type: String },
  order: { type: Number },
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
// const ResearchPaperSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true, maxlength: 200 },
//   abstract: { type: String, required: true },
//   pdfUrl: { type: String },
//   publishedAt: { type: Date, required: true },
// }, { timestamps: true });

// export const ResearchPaper = (mongoose.models && mongoose.models.ResearchPaper) || mongoose.model('ResearchPaper', ResearchPaperSchema);

// Conference Model
// const ConferenceSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   name: { type: String, required: true, maxlength: 200 },
//   location: { type: String, maxlength: 200 },
//   date: { type: Date, required: true },
//   paperPresented: { type: Boolean, default: false },
// }, { timestamps: true });

// export const Conference = (mongoose.models && mongoose.models.Conference) || mongoose.model('Conference', ConferenceSchema);

// // Achievement Model
// const AchievementSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true, maxlength: 200 },
//   description: { type: String, required: true },
//   date: { type: Date, required: true },
// }, { timestamps: true });

// export const Achievement = (mongoose.models && mongoose.models.Achievement) || mongoose.model('Achievement', AchievementSchema);


// // Award Model
// const AwardSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true, maxlength: 200 },
//   organization: { type: String, required: true, maxlength: 200 },
//   date: { type: Date, required: true },
// }, { timestamps: true });

// export const Award = (mongoose.models && mongoose.models.Award) || mongoose.model('Award', AwardSchema);

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

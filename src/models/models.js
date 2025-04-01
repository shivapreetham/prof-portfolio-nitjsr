
// User Model
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, maxlength: 100 },
    profileImage: { type: String },
    bio: { type: String },
    location: { type: String, maxlength: 100 },
    linkedIn: { type: String, maxlength: 255 },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Project Model
const ProjectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: { type: String },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true },
    banner: { type: String },
    videoUrl: { type: String },
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

// Research Paper Model
const ResearchPaperSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxlength: 200 },
    abstract: { type: String, required: true },
    pdfUrl: { type: String },
    publishedAt: { type: Date, required: true },
}, { timestamps: true });

export const ResearchPaper = mongoose.models.ResearchPaper || mongoose.model('ResearchPaper', ResearchPaperSchema);

// Conference Model
const ConferenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, maxlength: 200 },
    location: { type: String, maxlength: 200 },
    date: { type: Date, required: true },
    paperPresented: { type: Boolean, default: false },
}, { timestamps: true });

export const Conference = mongoose.models.Conference || mongoose.model('Conference', ConferenceSchema);

// Achievement Model
const AchievementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true },
    date: { type: Date, required: true },
}, { timestamps: true });

export const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);

// Blog Post Model
const BlogPostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxlength: 200 },
    content: { type: String, required: true },
    imageUrl: { type: String },
}, { timestamps: true });

export const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

// Teaching Experience Model
const TeachingExperienceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, maxlength: 200 },
    institution: { type: String, required: true, maxlength: 200 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
}, { timestamps: true });

export const TeachingExperience = mongoose.models.TeachingExperience || mongoose.model('TeachingExperience', TeachingExperienceSchema);

// Award Model
const AwardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxlength: 200 },
    organization: { type: String, required: true, maxlength: 200 },
    date: { type: Date, required: true },
}, { timestamps: true });

export const Award = mongoose.models.Award || mongoose.model('Award', AwardSchema);

// Collaboration Model
const CollaborationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaboratorName: { type: String, required: true, maxlength: 200 },
    institution: { type: String, maxlength: 200 },
    projectTitle: { type: String, required: true, maxlength: 200 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
}, { timestamps: true });

export const Collaboration = mongoose.models.Collaboration || mongoose.model('Collaboration', CollaborationSchema);

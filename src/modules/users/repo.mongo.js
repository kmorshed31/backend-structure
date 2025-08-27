// Mongo repository using Mongoose
let mongoose;
let User;

const map = (doc) => ({ id: String(doc._id), name: doc.name, email: doc.email });

export async function init(uri) {
  if (!uri) throw new Error('MONGO_URL is required when DB_DRIVER=mongo');
  // dynamic import to avoid hard dep when not using mongo
  const mod = await import('mongoose');
  mongoose = mod.default;
  await mongoose.connect(uri);

  const schema = new mongoose.Schema(
    {
      name: { type: String, required: true, minlength: 2 },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
        unique: true,
      },
    },
    { timestamps: true },
  );

  User = mongoose.models.User || mongoose.model('User', schema);
}

export async function health() {
  const ready = mongoose?.connection?.readyState === 1;
  return {
    driver: 'mongo',
    status: ready ? 'ok' : 'down',
    readyState: mongoose?.connection?.readyState ?? 0,
  };
}

export async function list() {
  const docs = await User.find().lean();
  return docs.map((d) => ({ id: String(d._id), name: d.name, email: d.email }));
}

export async function findById(id) {
  const d = await User.findById(id).lean();
  return d ? { id: String(d._id), name: d.name, email: d.email } : null;
}

export async function findByEmail(email) {
  const d = await User.findOne({ email: String(email).toLowerCase() }).lean();
  return d ? { id: String(d._id), name: d.name, email: d.email } : null;
}

export async function create({ name, email }) {
  const d = await User.create({ name, email: String(email).toLowerCase() });
  return map(d);
}

export async function update(id, { name, email }) {
  const d = await User.findByIdAndUpdate(
    id,
    { name, email: String(email).toLowerCase() },
    { new: true, runValidators: true },
  ).lean();
  return d ? { id: String(d._id), name: d.name, email: d.email } : null;
}

export async function remove(id) {
  const d = await User.findByIdAndDelete(id).lean();
  return Boolean(d);
}

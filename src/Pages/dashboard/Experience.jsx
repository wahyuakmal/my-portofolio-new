import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import {
  Plus,
  Trash2,
  Upload,
  Briefcase,
  X,
  ImageIcon,
  Pencil,
} from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
      {children}
    </div>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs text-blue-300/70 uppercase tracking-wider font-medium">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
    />
  </div>
);

const SkeletonCard = () => (
  <div className="relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-2xl blur opacity-10" />
    <div className="relative bg-white/5 border border-white/12 rounded-2xl p-4 flex flex-col gap-3">
      <div className="w-12 h-12 bg-white/5 animate-pulse rounded-xl" />
      <div className="h-4 bg-white/5 animate-pulse rounded-lg w-2/3" />
      <div className="h-3 bg-white/5 animate-pulse rounded-lg w-full" />
      <div className="h-3 bg-white/5 animate-pulse rounded-lg w-4/5" />
      <div className="flex justify-between items-center pt-2 border-t border-white/8 mt-auto">
        <div className="flex gap-2">
          <div className="w-7 h-7 bg-white/5 animate-pulse rounded-lg" />
          <div className="w-7 h-7 bg-white/5 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

const ExperienceCard = ({ experience, onDelete, onEdit }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Card>
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          {experience.logo ? (
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/20 relative">
              {!imgLoaded && (
                <div className="w-full h-full animate-pulse bg-white/5 absolute inset-0" />
              )}
              <img
                src={experience.logo}
                alt={experience.company}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-contain p-1 transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/20">
              <Briefcase className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-white text-sm mb-0.5">
              {experience.company}
            </h3>
            <p className="text-gray-400 text-xs">{experience.role}</p>
            <p className="text-blue-400 text-xs font-medium mt-1">{experience.year}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-white/8 mt-auto">
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(experience)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(experience.id)}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    />
    <div
      className="relative z-10 w-full max-w-2xl flex flex-col"
      style={{ maxHeight: "calc(100vh - 24px)" }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-2xl blur opacity-20 pointer-events-none" />
      <div className="relative bg-[#0a0a1a] border border-white/12 rounded-2xl flex flex-col overflow-hidden">
        {/* Fixed header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  </div>
);

const ExperienceForm = ({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save Experience",
  uploading,
}) => {
  const [form, setForm] = useState({
    company: initial?.company || "",
    role: initial?.role || "",
    year: initial?.year || "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.logo || null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form, file);
      }}
      className="p-5 sm:p-6 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <InputField
            label="Company / School Name"
            value={form.company}
            onChange={set("company")}
            placeholder="e.g. Sultan Syarif Kasim State Islamic University Riau"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <InputField
            label="Role / Position"
            value={form.role}
            onChange={set("role")}
            placeholder="e.g. Fakultas Ilmu Komputer"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <InputField
            label="Year / Duration"
            value={form.year}
            onChange={set("year")}
            placeholder="e.g. 2025 - Present"
            required
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-blue-300/70 uppercase tracking-wider font-medium">
            Logo Image
          </label>
          <label className="flex items-center gap-4 w-full bg-[#0d0d22] border border-dashed border-white/15 rounded-xl px-4 py-4 cursor-pointer hover:border-blue-500/40 hover:bg-white/4 transition-all">
            {preview ? (
              <img
                src={preview}
                className="h-16 w-16 object-contain rounded-lg border border-white/10 bg-white/5 p-1"
                alt="preview"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-300">
                {preview ? "Change image" : "Click to upload image"}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Gunakan gambar rasio 1:1 (persegi, misal 500x500px) agar rapi
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={uploading} className="relative group/s">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563eb] to-[#0891b2] rounded-xl opacity-60 blur group-hover/s:opacity-100 transition duration-300" />
          <div className="relative flex items-center gap-2 px-5 py-2 bg-[#030014] rounded-xl border border-white/10">
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-blue-400" />
            )}
            <span className="text-sm text-gray-200">
              {uploading ? "Saving..." : submitLabel}
            </span>
          </div>
        </button>
      </div>
    </form>
  );
};

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editExperience, setEditExperience] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("created_at", { ascending: false });
    setExperiences(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const uploadImage = async (f) => {
    const fileName = `exp-${Date.now()}-${f.name}`;
    await supabase.storage.from("project-images").upload(fileName, f);
    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleCreate = async (form, file) => {
    setUploading(true);
    let imgUrl = "";
    if (file) imgUrl = await uploadImage(file);
    await supabase.from("experiences").insert({
      company: form.company,
      role: form.role,
      year: form.year,
      logo: imgUrl,
    });
    setShowCreate(false);
    setUploading(false);
    fetchExperiences();
  };

  const handleEdit = async (form, file) => {
    setUploading(true);
    let imgUrl = editExperience.logo || "";
    if (file) imgUrl = await uploadImage(file);
    await supabase
      .from("experiences")
      .update({
        company: form.company,
        role: form.role,
        year: form.year,
        logo: imgUrl,
      })
      .eq("id", editExperience.id);
    setEditExperience(null);
    setUploading(false);
    fetchExperiences();
  };

  const deleteExperience = async (id) => {
    if (!confirm("Delete this experience?")) return;
    await supabase.from("experiences").delete().eq("id", id);
    fetchExperiences();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-xl blur opacity-50" />
            <div className="relative w-9 h-9 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Experience
            </h1>
            <p className="text-gray-500 text-xs">
              {loading ? "Loading..." : `${experiences.length} experiences total`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="relative group shrink-0"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563eb] to-[#0891b2] rounded-xl opacity-50 blur group-hover:opacity-80 transition duration-300" />
          <div className="relative flex items-center gap-2 px-4 py-2.5 bg-[#030014] rounded-xl border border-white/10">
            <Plus className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-200">New Experience</span>
          </div>
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Add New Experience" onClose={() => setShowCreate(false)}>
          <ExperienceForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            submitLabel="Save Experience"
            uploading={uploading}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editExperience && (
        <Modal title="Edit Experience" onClose={() => setEditExperience(null)}>
          <ExperienceForm
            initial={editExperience}
            onSubmit={handleEdit}
            onCancel={() => setEditExperience(null)}
            submitLabel="Update Experience"
            uploading={uploading}
          />
        </Modal>
      )}

      {/* Experiences Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <Briefcase className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No experience yet. Add your first one!
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onDelete={deleteExperience}
              onEdit={setEditExperience}
            />
          ))}
        </div>
      )}
    </div>
  );
}

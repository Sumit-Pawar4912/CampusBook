import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import aiApi from '../services/aiApi.js';
import bookApi from '../services/bookApi.js';

const AddBookPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({ title: '', author: '', subject: '', semester: '', condition: 'New', type: 'Sell', price: '', branch: '' });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [qualityResult, setQualityResult] = useState(null);
  const [priceSuggestion, setPriceSuggestion] = useState(null);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleFileChange = event => {
    const selectedFiles = Array.from(event.target.files).slice(0, 6);
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map(file => URL.createObjectURL(file)));
  };

  const handleOcr = async () => {
    if (!files[0]) {
      setError('Upload at least one image for OCR');
      return;
    }
    setError('');
    setOcrLoading(true);
    try {
      const response = await aiApi.ocr(files[0]);
      const data = response.data.data;
      if (data.titleSuggestion) updateField('title', data.titleSuggestion);
      if (data.authorSuggestion) updateField('author', data.authorSuggestion);
      addToast('OCR data imported successfully', 'success');
    } catch (err) {
      addToast(err.message || 'OCR scan failed', 'error');
    }
    setOcrLoading(false);
  };

  const handleImageCheck = async () => {
    if (!files[0]) {
      setError('Upload an image to check quality');
      return;
    }
    setError('');
    try {
      const response = await aiApi.checkImage(files[0]);
      setQualityResult(response.data.data);
    } catch (err) {
      addToast(err.message || 'Image quality check failed', 'error');
    }
  };

  const handlePriceSuggestion = async () => {
    if (!form.title || !form.subject || !form.semester || !form.condition) {
      setError('Title, subject, semester, and condition are required for price suggestion');
      return;
    }
    setError('');
    try {
      const response = await aiApi.suggestPrice({
        title: form.title,
        condition: form.condition,
        semester: Number(form.semester),
        subject: form.subject,
      });
      setPriceSuggestion(response.data.data.suggestedPrice);
      updateField('price', response.data.data.suggestedPrice);
      addToast('Smart price suggestion applied', 'success');
    } catch (err) {
      addToast(err.message || 'Price suggestion failed', 'error');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!files.length) {
      setError('Add at least one image for your listing');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries({ ...form, semester: Number(form.semester), price: Number(form.price || 0) }).forEach(([key, value]) => {
        formData.append(key, value);
      });
      files.forEach(file => formData.append('images', file));
      await bookApi.create(formData);
      addToast('Book created and submitted for review', 'success');
      navigate('/books');
    } catch (err) {
      addToast(err.response?.message || 'Unable to submit listing', 'error');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-950">Add a Book Listing</h1>
              <p className="mt-2 text-slate-600">List a book for sale, exchange, or donation with AI-assisted tools.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={handleOcr} disabled={ocrLoading} className="rounded-3xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700">
                {ocrLoading ? 'Scanning OCR…' : 'OCR Auto Fill'}
              </button>
              <button type="button" onClick={handleImageCheck} className="rounded-3xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-800">
                Check Image Quality
              </button>
              <button type="button" onClick={handlePriceSuggestion} className="rounded-3xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-500">
                Suggest Price
              </button>
            </div>
          </div>

          {error && <div className="mb-4 rounded-3xl bg-rose-100 p-4 text-rose-700">{error}</div>}
          {qualityResult && (
            <div className="mb-4 rounded-3xl bg-slate-50 p-4 text-slate-700">
              <p className="font-semibold">Image quality result:</p>
              <p>Blur score: {qualityResult.blurScore}</p>
              <p>{qualityResult.message}</p>
            </div>
          )}
          {priceSuggestion !== null && (
            <div className="mb-4 rounded-3xl bg-emerald-50 p-4 text-emerald-800">
              Suggested price: ₹{priceSuggestion}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={form.title}
                onChange={e => updateField('title', e.target.value)}
                placeholder="Title"
                className="rounded-3xl border border-slate-300 px-4 py-3"
                required
              />
              <input
                value={form.author}
                onChange={e => updateField('author', e.target.value)}
                placeholder="Author"
                className="rounded-3xl border border-slate-300 px-4 py-3"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={form.subject}
                onChange={e => updateField('subject', e.target.value)}
                placeholder="Subject"
                className="rounded-3xl border border-slate-300 px-4 py-3"
                required
              />
              <input
                type="text"
                value={form.branch}
                onChange={e => updateField('branch', e.target.value)}
                placeholder="Branch"
                className="rounded-3xl border border-slate-300 px-4 py-3"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <input
                type="number"
                value={form.semester}
                onChange={e => updateField('semester', e.target.value)}
                placeholder="Semester"
                min="1"
                max="12"
                className="rounded-3xl border border-slate-300 px-4 py-3"
                required
              />
              <select
                value={form.condition}
                onChange={e => updateField('condition', e.target.value)}
                className="rounded-3xl border border-slate-300 px-4 py-3"
                required
              >
                <option>New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Old</option>
              </select>
              <select
                value={form.type}
                onChange={e => updateField('type', e.target.value)}
                className="rounded-3xl border border-slate-300 px-4 py-3"
                required
              >
                <option>Sell</option>
                <option>Exchange</option>
                <option>Donate</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="number"
                value={form.price}
                onChange={e => updateField('price', e.target.value)}
                placeholder="Price"
                min="0"
                className="rounded-3xl border border-slate-300 px-4 py-3"
                step="1"
              />
              <label className="block rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-500">
                Upload images (max 6)
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mt-3 w-full" />
              </label>
            </div>

            {previews.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {previews.map((src, index) => (
                  <img key={index} src={src} alt={`Preview ${index + 1}`} className="h-40 w-full rounded-3xl object-cover" />
                ))}
              </div>
            )}

            <button type="submit" disabled={submitting} className="rounded-3xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800">
              {submitting ? 'Posting listing…' : 'Post listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookPage;

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const recognizeBookText = async buffer => {
  if (!buffer) {
    throw { statusCode: 400, message: 'Image file is required for OCR' };
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const imagePart = {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType: 'image/jpeg',
    },
  };

  const prompt = `Extract book information from this book cover image. 
Return ONLY a valid JSON object with no extra text, no markdown, no backticks:
{
  "title": "full book title here",
  "author": "author name(s) here",
  "subject": "subject or field of study here",
  "edition": "edition if visible or null"
}
If a field is not visible, use null.`;

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  return response.text();
};

const parseTitleAndAuthor = text => {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      titleSuggestion: parsed.title || '',
      authorSuggestion: parsed.author || '',
      subjectSuggestion: parsed.subject || '',
      editionSuggestion: parsed.edition || '',
    };
  } catch {
    return {
      titleSuggestion: '',
      authorSuggestion: '',
      subjectSuggestion: '',
      editionSuggestion: '',
    };
  }
};

module.exports = { recognizeBookText, parseTitleAndAuthor };
import os
import json
import re
from dotenv import load_dotenv

try:
    import google.generativeai as genai
except Exception:  # pragma: no cover - library may not be available in CI
    genai = None

load_dotenv()

API_KEY = os.getenv('GEMINI_API_KEY')
if genai and API_KEY:
    genai.configure(api_key=API_KEY)


class GeminiService:
    def __init__(self):
        self.model = None
        if genai and API_KEY:
            try:
                self.model = genai.GenerativeModel('gemini-1.5-pro')
            except Exception:
                self.model = None

        self.real_time_prompt = (
            "You are evaluating a student presentation in real-time.\n"
            "Analyze the audio transcription for: clarity (0-10), pace (0-10), confidence (0-10).\n"
            "Analyze the slide image for: relevance (0-10), structure (0-10), visual quality (0-10).\n"
            "Generate ONE thoughtful question to probe deeper understanding.\n\n"
            "Return ONLY valid JSON with no explanation:\n"
            "{\n"
            "  \"content_score\": float,\n"
            "  \"delivery_score\": float,\n"
            "  \"engagement_score\": float,\n"
            "  \"question\": \"string\"\n"
            "}"
        )

    def _extract_json(self, text: str) -> dict:
        # Try to extract JSON from possible code fences
        if not text:
            return {}
        # Match ```json ... ``` or ``` ... ```
        fence_match = re.search(r"```(?:json)?\n(.*?)```", text, re.DOTALL | re.IGNORECASE)
        if fence_match:
            text = fence_match.group(1).strip()
        # Trim surrounding text and attempt to parse
        try:
            return json.loads(text)
        except Exception:
            # Try to locate the first JSON object in the string
            brace_match = re.search(r"\{.*\}", text, re.DOTALL)
            if brace_match:
                try:
                    return json.loads(brace_match.group(0))
                except Exception:
                    pass
        return {}

    def analyze_real_time(self, audio_transcript: str, slide_image_base64: str) -> dict:
        if not self.model:
            return self._default_response()
        try:
            parts = [
                self.real_time_prompt,
                f"\n\nTranscript: {audio_transcript or ''}",
            ]
            # If the image is a data URL, keep as-is for now. The SDK typically expects bytes; this is a placeholder.
            if slide_image_base64:
                parts.append({"mime_type": "image/png", "data": slide_image_base64})

            response = self.model.generate_content(parts)
            result_text = (getattr(response, 'text', None) or '').strip()
            data = self._extract_json(result_text)
            if not data:
                return self._default_response()
            # Validate fields
            return {
                "content_score": float(data.get("content_score", 5.0)),
                "delivery_score": float(data.get("delivery_score", 5.0)),
                "engagement_score": float(data.get("engagement_score", 5.0)),
                "question": str(data.get("question", "Could you elaborate on that point?"))
            }
        except Exception:
            return self._default_response()

    def generate_final_report(self, full_transcript: str, all_slides: list) -> dict:
        if not self.model:
            return self._default_final_report()
        final_prompt = f"""
Based on the complete presentation:

Transcript: {full_transcript}

Provide a structured evaluation with:
1. Three specific strengths mapped to rubric metrics (content, delivery, engagement)
2. Three actionable improvement areas

Return JSON:
{{
  "strengths": [
    {{"metric": "string", "observation": "string"}},
    {{"metric": "string", "observation": "string"}},
    {{"metric": "string", "observation": "string"}}
  ],
  "improvements": [
    {{"metric": "string", "recommendation": "string"}},
    {{"metric": "string", "recommendation": "string"}},
    {{"metric": "string", "recommendation": "string"}}
  ]
}}
"""
        try:
            response = self.model.generate_content(final_prompt)
            result_text = (getattr(response, 'text', None) or '').strip()
            data = self._extract_json(result_text)
            return data or self._default_final_report()
        except Exception:
            return self._default_final_report()

    def _default_response(self) -> dict:
        return {
            "content_score": 5.0,
            "delivery_score": 5.0,
            "engagement_score": 5.0,
            "question": "Could you elaborate on that point?"
        }

    def _default_final_report(self) -> dict:
        return {
            "strengths": [
                {"metric": "content", "observation": "Clear structure"},
                {"metric": "delivery", "observation": "Good pacing"},
                {"metric": "engagement", "observation": "Maintained interest"}
            ],
            "improvements": [
                {"metric": "content", "recommendation": "Add more examples"},
                {"metric": "delivery", "recommendation": "Vary vocal tone"},
                {"metric": "engagement", "recommendation": "Use more visuals"}
            ]
        }


gemini_service = GeminiService()

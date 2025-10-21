import axios from 'axios';

export const customAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || '',
  timeout: 90000, // 90초로 증가 (Gemini 응답 대기)
  headers: { 'Content-Type': 'application/json' },
});

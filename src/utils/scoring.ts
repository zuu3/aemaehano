import type { Hit, ScoreResponse } from '@/types';

const cfg = {
  coefPerHit: 3,
  caps: { category: 30, pattern: 20, density: 10, totalPenalty: 100, bonus: 10 },
  categories: {
    hedge:   { severity: 3, regex: [/아마(?:도)?/g, /일지도/g, /것\s*같(?:다|아요|았|었|습니다|네요|을까요)/g, /수도\s*있/g, /~\s*듯/g, /인\s*듯/g] },
    vague:   { severity: 3, regex: [/좀/g, /약간/g, /대충/g, /적당히/g, /조만간/g, /나중에/g, /언젠가/g, /그쪽/g, /이쪽/g, /여기저기/g, /어디(?:선가|든가)/g, /괜찮\s*은\s*편/g, /얼추/g, /대략/g, /웬만하면/g] },
    softener:{ severity: 2, regex: [/개인적으로(?:는)?/g, /혹시/g, /그냥(?!\w)/g, /다만/g, /일단/g, /우선/g] },
    apology: { severity: 2, regex: [/죄송하지만/g, /실례지만/g, /염치없지만/g, /미안하지만/g, /송구스럽지만/g] },
    filler:  { severity: 2, regex: [/아무튼/g, /근데/g, /사실은/g, /어쨌든/g, /하여튼/g, /뭐랄까/g, /그러니까/g] },
  },
  patterns: { headHedge: 2, weakEnding: 3, repeat3plus: 5, shortHedge: 2 },
  bonus: { numeric: 0.5, conclusion: 0.5, assertive: 0.5, evidence: 1.0 },
};

const skipRe =
  /(```[\s\S]*?```|`[^`]*`|https?:\/\/\S+|\b\S+@\S+\b|\[[^\]]*\]\([^)]*\))/g;

export function splitSentences(text: string): string[] {
  const cleaned = text.replace(skipRe, ' ');
  const parts = cleaned
    .split(/(?<=[.!?])\s+|(?<=(?:다|요))\s+/u)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [cleaned.trim()];
}

function isEqualityAround(s: string, i: number): boolean {
  const w = s.slice(Math.max(0, i - 8), i + 8);
  return /([가-힣A-Za-z0-9]+)\s*(와|과|은|는|이|가)\s*같다/.test(w);
}

export function detect(text: string): Hit[] {
  const sents = splitSentences(text);
  const hits: Hit[] = [];
  let offset = 0;

  for (let i = 0; i < sents.length; i++) {
    const sent = sents[i];
    for (const [cat, def] of Object.entries(cfg.categories)) {
      for (const re of def.regex as RegExp[]) {
        re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(sent)) !== null) {
          if (cat === 'hedge' && /같/.test(m[0]) && isEqualityAround(sent, m.index)) continue;
          hits.push({
            term: m[0],
            cat: cat as Hit['cat'],
            start: offset + m.index,
            end: offset + m.index + m[0].length,
            sentenceIdx: i,
          });
        }
      }
    }
    offset += sent.length + 1;
  }

  hits.sort((a, b) => a.start - b.start);
  const merged: Hit[] = [];
  for (const h of hits) {
    const prev = merged[merged.length - 1];
    if (prev && h.start - prev.end <= 3 && prev.cat === prev.cat) {
      prev.end = Math.max(prev.end, h.end);
      prev.term = `${prev.term} ${h.term}`;
    } else {
      merged.push({ ...h });
    }
  }
  return merged;
}

function detectPatterns(sents: string[], hits: Hit[]) {
  let headHedge = 0;
  let weakEnding = 0;
  let repeat3plus = 0;
  let shortHedge = 0;

  const byS: Record<number, Hit[]> = {};
  hits.forEach((h) => (byS[h.sentenceIdx] ||= []).push(h));

  sents.forEach((s, i) => {
    const arr = byS[i] || [];
    if (arr.some((h) => h.cat === 'hedge' && s.indexOf(h.term) <= 5)) headHedge++;
    if (s.length < 40 && arr.some((h) => h.cat === 'hedge')) shortHedge++;
    const cnt: Record<string, number> = {};
    arr.forEach((h) => (cnt[h.cat] = (cnt[h.cat] ?? 0) + 1));
    if (Object.values(cnt).some((c) => c >= 3)) repeat3plus++;
  });

  [sents.length - 2, sents.length - 1]
    .filter((i) => i >= 0)
    .forEach((i) => {
      if (hits.some((h) => h.sentenceIdx === i && h.cat === 'hedge')) weakEnding++;
    });

  return { headHedge, weakEnding, repeat3plus, shortHedge };
}

function countNumeric(s: string[]) {
  return s.reduce(
    (a, v) =>
      a +
      ((v.match(
        /(\b\d+\.?\d*%?|\d{4}-\d{2}-\d{2}|\b\d+\s*(건|회|명|개|원|ms|MB|GB))/g,
      ) || []).length),
    0,
  );
}
function countConclusion(s: string[]) {
  return s.reduce((a, v) => a + ((v.match(/(결론적으로|요약하면|따라서|즉)/g) || []).length), 0);
}
function countAssertive(s: string[]) {
  return s.reduce(
    (a, v) => a + ((v.match(/(구현한다|배포한다|검증했다|확인했다|제출한다|진행한다)/g) || []).length),
    0,
  );
}
function countEvidence(s: string[]) {
  return s.reduce(
    (a, v) => a + ((v.match(/(자료에 따르면|로그상|데이터상|통계에 따르면)/g) || []).length),
    0,
  );
}

export function score(text: string): ScoreResponse {
  const sents = splitSentences(text);
  const hits = detect(text);
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  const catCount: Record<Hit['cat'], number> = {} as any;
  hits.forEach((h) => (catCount[h.cat] = (catCount[h.cat] ?? 0) + 1));
  let catPenalty = 0;
  for (const [cat, cnt] of Object.entries(catCount)) {
    // @ts-ignore
    const sev: number = cfg.categories[cat as keyof typeof cfg.categories].severity;
    const raw = cnt * sev * cfg.coefPerHit;
    catPenalty += Math.min(raw, cfg.caps.category);
  }

  const pat = detectPatterns(sents, hits);
  const patternRaw =
    pat.headHedge * cfg.patterns.headHedge +
    pat.weakEnding * cfg.patterns.weakEnding +
    pat.repeat3plus * cfg.patterns.repeat3plus +
    pat.shortHedge * cfg.patterns.shortHedge;
  const patternPenalty = Math.min(patternRaw, cfg.caps.pattern);

  let densityPenalty = 0;
  if (words >= 150) {
    const density = (hits.length / words) * 100;
    densityPenalty = Math.min(Math.max(0, Math.floor(density - 5)), cfg.caps.density);
  }

  const bonusRaw =
    countNumeric(sents) * cfg.bonus.numeric +
    countConclusion(sents) * cfg.bonus.conclusion +
    countAssertive(sents) * cfg.bonus.assertive +
    countEvidence(sents) * cfg.bonus.evidence;
  const bonus = Math.min(bonusRaw, cfg.caps.bonus);

  const totalPenalty = Math.min(catPenalty + patternPenalty + densityPenalty, cfg.caps.totalPenalty);
  const finalScore = Math.max(0, Math.min(100, 100 - totalPenalty + bonus));

  return { score: finalScore, hits, breakdown: { catPenalty, patternPenalty, densityPenalty, bonus } };
}

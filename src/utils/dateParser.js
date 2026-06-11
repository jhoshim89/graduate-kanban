/* -------------------------------------------------------------
 * Korean & English Natural Language Date Parser
 * Parses strings like '오늘', '내일', '다음주 금요일', '5/30', '5월 29일'
 * into standardized 'YYYY-MM-DD' strings.
 * ------------------------------------------------------------- */

/**
 * Parses natural language text into YYYY-MM-DD date string.
 * Returns null if parsing fails.
 * @param {string} text 
 * @returns {string|null}
 */
export function parseNaturalLanguageDate(text) {
  if (!text) return null;
  text = text.trim().toLowerCase();
  const compactText = text.replace(/\s+/g, "");
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Core Relative Keywords (Korean & English)
  if (/^(오늘|금일|today|d-day|dday)$/.test(compactText)) {
    return formatDate(today);
  }
  if (/^(내일|명일|tomorrow)$/.test(compactText)) {
    return formatDate(addDays(today, 1));
  }
  if (/^(모레|모래|내일모레|내일모래)$/.test(compactText)) {
    return formatDate(addDays(today, 2));
  }
  if (/^글피$/.test(compactText)) {
    return formatDate(addDays(today, 3));
  }
  if (/^(어제|작일|yesterday)$/.test(compactText)) {
    return formatDate(addDays(today, -1));
  }

  // 2. N days after / N days before (e.g. '3일 뒤', '5일 후', '2 days after')
  let match = text.match(/^(\d+)\s*일\s*(뒤|후|후에|이후)$/);
  if (match) {
    return formatDate(addDays(today, parseInt(match[1])));
  }
  match = text.match(/^(\d+)\s*days?\s*(after|later)$/);
  if (match) {
    return formatDate(addDays(today, parseInt(match[1])));
  }
  match = text.match(/^(하루|이틀|사흘|나흘)\s*(뒤|후|후에|이후)$/);
  if (match) {
    return formatDate(addDays(today, koreanDayCountToNumber(match[1])));
  }
  match = text.match(/^(\d+)\s*일\s*(전|전에|이전)$/);
  if (match) {
    return formatDate(addDays(today, -parseInt(match[1])));
  }
  match = text.match(/^(하루|이틀|사흘|나흘)\s*(전|전에|이전)$/);
  if (match) {
    return formatDate(addDays(today, -koreanDayCountToNumber(match[1])));
  }

  // 3. Day of week matching (e.g. '이번주 금요일', '다음주 월요일', '수요일')
  match = text.match(/^(이번주|다음주)?\s*(월|화|수|목|금|토|일)요일?$/);
  if (match) {
    const isNextWeek = match[1] === "다음주";
    const targetDayName = match[2];
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const targetDayIndex = dayNames.indexOf(targetDayName);
    const currentDayIndex = today.getDay(); // 0 (Sun) ~ 6 (Sat)
    
    let diff = targetDayIndex - currentDayIndex;
    
    if (isNextWeek) {
      diff += 7;
    } else {
      // For "this week", if the day has already passed in the current week,
      // direct it to next week's corresponding day for helpful future scheduling.
      if (diff <= 0) {
        diff += 7;
      }
    }
    return formatDate(addDays(today, diff));
  }

  // 4. Month/Day patterns (e.g. '5월 29일', '5/29', '05.29', '5-29')
  match = text.match(/^(\d{1,2})\s*[월/\-.]\s*(\d{1,2})\s*일?$/);
  if (match) {
    const m = parseInt(match[1]) - 1; // 0-indexed month
    const d = parseInt(match[2]);
    const targetDate = new Date(today.getFullYear(), m, d);
    
    // If the month/day combination parsed represents a past date in this year,
    // we can safely assume it might be scheduled for next year, but standardizing
    // on current year is default.
    return formatDate(targetDate);
  }

  // 5. Standard ISO / Date Formats (e.g. '2026-05-29', '2026/05/29')
  const parsedTime = Date.parse(text);
  if (!isNaN(parsedTime)) {
    return formatDate(new Date(parsedTime));
  }

  return null; // Let fallback logic decide or prompt failure
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function koreanDayCountToNumber(word) {
  const dayCounts = {
    "하루": 1,
    "이틀": 2,
    "사흘": 3,
    "나흘": 4
  };
  return dayCounts[word] || 0;
}

/**
 * Intelligent Parser to extract both pure task title and due date from single input string.
 * High-Contrast Korean Unicode boundary compliant (Regex \b replaced).
 * E.g. "오늘 민아샘 논문 피드백" -> title: "민아샘 논문 피드백", dueDate: "2026-05-27"
 * E.g. "5/30일 학회 발표 준비" -> title: "학회 발표 준비", dueDate: "2026-05-30" (particle '일' auto-cleaned)
 * E.g. "마감일 없는 할 일" -> title: "마감일 없는 할 일", dueDate: ""
 */
export function extractNaturalLanguageDate(text) {
  if (!text) return { title: "", dueDate: "" };

  // 시작 경계: 앞에 숫자만 아니면 인식 (한글/영문 바로 뒤에 붙은 날짜도 잡도록 lookbehind 사용)
  // 예: "동물병원6/17", "회의6월17일" 처럼 띄어쓰기 없이 붙여 쓴 경우도 날짜 인식
  const relativeRegex = /(?:^|\s)(내일\s*모레|내일\s*모래|오늘|금일|내일|명일|모레|모래|어제|작일|글피|today|tomorrow|yesterday)(?:까지의|까지|에는|에|이|가|은|는)?(?=\s|$)/i;
  const relativeOffsetRegex = /(?:^|\s)((?:\d+\s*일|하루|이틀|사흘|나흘)\s*(?:뒤|후|후에|이후|전|전에|이전))(?:까지의|까지|에는|에|이|가|은|는)?(?=\s|$)/;
  const dayOfWeekRegex = /(?:^|\s)((?:이번주|다음주)?\s*[월화수목금토일]요일)(?:까지의|까지|에는|에|이|가|은|는)?(?=\s|$)/;
  const monthDayRegex1 = /(?<!\d)(\d{1,2}\s*월\s*\d{1,2}\s*일?)(?:까지의|까지|에는|에|이|가|은|는)?(?=\s|$)/;
  const monthDayRegex2 = /(?<!\d)(\d{1,2}[/\-.]\d{1,2})(?:일|요일|까지의|까지|에는|에|이|가|은|는)?(?=\s|$)/;
  const isoDateRegex = /(?<!\d)(\d{4}[/\-.]\d{1,2}[/\-.]\d{1,2})(?:까지의|까지|에는|에|이|가|은|는)?(?=\s|$)/;

  let dueDate = "";
  let title = text;

  // 1. ISO Date (e.g. 2026-05-30)
  let match = title.match(isoDateRegex);
  if (match) {
    const rawMatch = match[0].trim();
    const datePart = match[1].trim();
    const parsed = parseNaturalLanguageDate(datePart);
    if (parsed) {
      dueDate = parsed;
      title = title.replace(rawMatch, "").trim();
    }
  }

  // 2. Month Day (e.g. 5/30, 5월 30일)
  if (!dueDate) {
    match = title.match(monthDayRegex1) || title.match(monthDayRegex2);
    if (match) {
      const rawMatch = match[0].trim();
      const datePart = match[1].trim();
      const parsed = parseNaturalLanguageDate(datePart);
      if (parsed) {
        dueDate = parsed;
        title = title.replace(rawMatch, "").trim();
      }
    }
  }

  // 3. Day of week (e.g. 이번주 금요일, 월요일)
  if (!dueDate) {
    match = title.match(dayOfWeekRegex);
    if (match) {
      const rawMatch = match[0].trim();
      const datePart = match[1].trim();
      const parsed = parseNaturalLanguageDate(datePart);
      if (parsed) {
        dueDate = parsed;
        title = title.replace(rawMatch, "").trim();
      }
    }
  }

  // 4. Relative day offsets (e.g. 하루 뒤, 3일 후)
  if (!dueDate) {
    match = title.match(relativeOffsetRegex);
    if (match) {
      const rawMatch = match[0].trim();
      const datePart = match[1].trim();
      const parsed = parseNaturalLanguageDate(datePart);
      if (parsed) {
        dueDate = parsed;
        title = title.replace(rawMatch, "").trim();
      }
    }
  }

  // 5. Relative keywords (e.g. 오늘, 내일, 모레)
  if (!dueDate) {
    match = title.match(relativeRegex);
    if (match) {
      const rawMatch = match[0].trim();
      const datePart = match[1].trim();
      const parsed = parseNaturalLanguageDate(datePart);
      if (parsed) {
        dueDate = parsed;
        title = title.replace(rawMatch, "").trim();
      }
    }
  }

  // Clean up title (remove double spaces and trailing prepositions)
  title = title.replace(/\s+/g, " ").trim();
  
  // Clean up Korean particles (조사) trailing at date boundary: e.g. "오늘까지 과제" -> "과제"
  title = title.replace(/^(까지|에|은|는|이|가|까지의)\s+/, "");
  title = title.replace(/\s+(까지|e|에|은|는|이|가|까지의)$/, "");
  title = title.trim();

  return { title, dueDate };
}


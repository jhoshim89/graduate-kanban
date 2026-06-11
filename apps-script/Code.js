const SPREADSHEET_PROPERTY = 'GRADUATE_KANBAN_SPREADSHEET_ID';
const SPREADSHEET_TITLE = 'Graduate Kanban Data';
const TASKS_SHEET = 'Tasks';
const META_SHEET = 'Meta';
const TASK_HEADERS = ['id', 'title', 'dueDate', 'status', 'category'];
const DEFAULT_CATEGORIES = ['일상', '개발'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Graduate Kanban')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getKanbanState() {
  const ss = getOrCreateSpreadsheet_();
  const tasksSheet = ensureTasksSheet_(ss);
  const metaSheet = ensureMetaSheet_(ss);
  const meta = readMeta_(metaSheet);
  const tasks = readTasks_(tasksSheet);
  const hasData = Boolean(meta.updatedAt) || tasks.length > 0;
  const categories = parseJson_(meta.categories, null) || deriveCategories_(tasks);

  return {
    ok: true,
    hasData,
    updatedAt: meta.updatedAt || '',
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl(),
    data: hasData ? {
      tasks,
      categories,
      activeCategory: meta.activeCategory || '__all__',
      currentView: meta.currentView || 'board',
      memo: meta.memo || ''
    } : null
  };
}

function saveKanbanState(payload) {
  const ss = getOrCreateSpreadsheet_();
  const tasksSheet = ensureTasksSheet_(ss);
  const metaSheet = ensureMetaSheet_(ss);
  const data = normalizePayload_(payload);
  const now = new Date().toISOString();

  writeTasks_(tasksSheet, data.tasks);
  writeMeta_(metaSheet, {
    categories: JSON.stringify(data.categories),
    activeCategory: data.activeCategory,
    currentView: data.currentView,
    memo: data.memo,
    updatedAt: now,
    version: '4'
  });
  SpreadsheetApp.flush();

  return {
    ok: true,
    updatedAt: now,
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl()
  };
}

function setKanbanSpreadsheetId(spreadsheetId) {
  const clean = String(spreadsheetId || '').trim();
  if (!clean) throw new Error('spreadsheetId is required');
  SpreadsheetApp.openById(clean);
  PropertiesService.getScriptProperties().setProperty(SPREADSHEET_PROPERTY, clean);
  return { ok: true, spreadsheetId: clean };
}

function getOrCreateSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const existingId = props.getProperty(SPREADSHEET_PROPERTY);
  if (existingId) {
    try {
      return SpreadsheetApp.openById(existingId);
    } catch (err) {
      props.deleteProperty(SPREADSHEET_PROPERTY);
    }
  }

  const ss = SpreadsheetApp.create(SPREADSHEET_TITLE);
  props.setProperty(SPREADSHEET_PROPERTY, ss.getId());
  return ss;
}

function ensureTasksSheet_(ss) {
  const sheet = ss.getSheetByName(TASKS_SHEET) || ss.insertSheet(TASKS_SHEET);
  const currentHeaders = sheet.getRange(1, 1, 1, TASK_HEADERS.length).getValues()[0];
  const needsHeaders = TASK_HEADERS.some((header, index) => currentHeaders[index] !== header);
  if (needsHeaders) {
    sheet.getRange(1, 1, 1, TASK_HEADERS.length).setValues([TASK_HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function ensureMetaSheet_(ss) {
  const sheet = ss.getSheetByName(META_SHEET) || ss.insertSheet(META_SHEET);
  const firstRow = sheet.getRange(1, 1, 1, 2).getValues()[0];
  if (firstRow[0] !== 'key' || firstRow[1] !== 'value') {
    sheet.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readTasks_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0].map(String);
  const indexes = TASK_HEADERS.map(header => headers.indexOf(header));

  return values.slice(1).map(row => ({
    id: String(row[indexes[0]] || '').trim(),
    title: String(row[indexes[1]] || '').trim(),
    dueDate: normalizeDateValue_(row[indexes[2]]),
    status: normalizeStatus_(row[indexes[3]]),
    category: String(row[indexes[4]] || '일상').trim() || '일상'
  })).filter(task => task.id && task.title);
}

function writeTasks_(sheet, tasks) {
  sheet.clearContents();
  const rows = [
    TASK_HEADERS,
    ...tasks.map(task => [
      task.id,
      task.title,
      task.dueDate,
      task.status,
      task.category
    ])
  ];
  sheet.getRange(1, 1, rows.length, TASK_HEADERS.length).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, TASK_HEADERS.length);
}

function readMeta_(sheet) {
  const values = sheet.getDataRange().getValues();
  const meta = {};
  values.slice(1).forEach(row => {
    const key = String(row[0] || '').trim();
    if (key) meta[key] = row[1] == null ? '' : String(row[1]);
  });
  return meta;
}

function writeMeta_(sheet, meta) {
  const rows = [['key', 'value']];
  Object.keys(meta).forEach(key => rows.push([key, meta[key]]));
  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 2);
}

function normalizePayload_(payload) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const tasks = Array.isArray(source.tasks) ? source.tasks.map(normalizeTask_).filter(Boolean) : [];
  const categories = Array.isArray(source.categories)
    ? source.categories.map(value => String(value || '').trim()).filter(Boolean)
    : [];
  const mergedCategories = unique_([
    ...categories,
    ...tasks.map(task => task.category).filter(Boolean),
    ...DEFAULT_CATEGORIES
  ]);
  const activeCategory = source.activeCategory && (source.activeCategory === '__all__' || mergedCategories.includes(source.activeCategory))
    ? source.activeCategory
    : '__all__';
  const currentView = ['board', 'calendar', 'dashboard'].includes(source.currentView)
    ? source.currentView
    : 'board';

  return {
    tasks,
    categories: mergedCategories,
    activeCategory,
    currentView,
    memo: typeof source.memo === 'string' ? source.memo : ''
  };
}

function normalizeTask_(task) {
  if (!task || typeof task !== 'object') return null;
  const title = String(task.title || '').trim();
  if (!title) return null;
  return {
    id: String(task.id || Utilities.getUuid()).trim(),
    title,
    dueDate: normalizeDateValue_(task.dueDate),
    status: normalizeStatus_(task.status),
    category: String(task.category || '일상').trim() || '일상'
  };
}

function normalizeStatus_(status) {
  const clean = String(status || 'todo').trim();
  return ['todo', 'inprogress', 'done'].includes(clean) ? clean : 'todo';
}

function normalizeDateValue_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value || '').trim();
}

function deriveCategories_(tasks) {
  return unique_([...tasks.map(task => task.category).filter(Boolean), ...DEFAULT_CATEGORIES]);
}

function parseJson_(text, fallback) {
  if (!text) return fallback;
  try {
    return JSON.parse(text);
  } catch (err) {
    return fallback;
  }
}

function unique_(values) {
  return [...new Set(values)];
}

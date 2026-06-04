/* -------------------------------------------------------------
 * Ultra-Lightweight Reactive State Store (Category-Tab Based)
 * 사용자가 직접 만드는 카테고리 탭(일상/개발 등)으로 할 일을 분류
 * 기존 데이터(owner: graduate/professor)는 자동으로 탭에 보존된다.
 * ------------------------------------------------------------- */

// Helper to generate formatted dates relative to today
const getRelativeDateString = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// 처음 켜는 사용자(데이터 없음)를 위한 시드. 사용자가 요청한 일상/개발 탭으로 시작.
const SEED_TASKS = [
  {
    id: "task-1",
    title: "장보기 (계란, 우유, 사료)",
    dueDate: getRelativeDateString(1),
    status: "todo",
    category: "일상"
  },
  {
    id: "task-2",
    title: "주간 운동 3회 채우기",
    dueDate: getRelativeDateString(0),
    status: "inprogress",
    category: "일상"
  },
  {
    id: "task-3",
    title: "칸반 앱 카테고리 탭 기능 마무리",
    dueDate: getRelativeDateString(2),
    status: "inprogress",
    category: "개발"
  },
  {
    id: "task-4",
    title: "GitHub 배포 자동화 스크립트 정리",
    dueDate: getRelativeDateString(3),
    status: "todo",
    category: "개발"
  }
];

// 사용자가 명시적으로 요청한 기본 탭
const DEFAULT_CATEGORIES = ["일상", "개발"];

// 레거시 owner 값을 카테고리 라벨로 변환 (데이터 보존용)
const OWNER_TO_CATEGORY = {
  professor: "내 일",
  graduate: "대학원생"
};

const SEED_MEMO = `🗒️ 오늘의 메모 & 주간 브리핑
- 이번 주 안에 끝낼 핵심 할 일 한 가지만 정해두기.
- 탭(일상/개발)은 위쪽 '+ 탭 추가'로 얼마든지 만들 수 있어요.`;

// 전체 보기를 뜻하는 특수 탭 식별자 (실제 카테고리 목록에는 저장하지 않음)
export const ALL_TAB = "__all__";

class GraduateStore {
  constructor() {
    this.tasksKey = "graduate_kanban_tasks_v2"; // 기존 키 그대로 — 데이터 보존
    this.viewKey = "graduate_kanban_view_v2";
    this.memoKey = "graduate_kanban_memo_v2";
    this.catKey = "graduate_kanban_categories_v2";
    this.activeCatKey = "graduate_kanban_active_category_v2";

    // 1. 할 일 로드 (없으면 시드)
    const rawTasks = localStorage.getItem(this.tasksKey);
    let tasks = rawTasks ? JSON.parse(rawTasks) : SEED_TASKS;

    // 2. 마이그레이션: category 없는 기존 할 일에 owner 기반 카테고리 부여
    tasks = tasks.map(t => {
      if (t.category) return t;
      const cat = OWNER_TO_CATEGORY[t.owner] || "일상";
      return { ...t, category: cat };
    });

    // 3. 카테고리 목록 로드 (없으면 데이터에서 수집 + 기본 탭 보강)
    const rawCats = localStorage.getItem(this.catKey);
    let categories = rawCats ? JSON.parse(rawCats) : null;
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      const fromData = [...new Set(tasks.map(t => t.category).filter(Boolean))];
      categories = [...new Set([...fromData, ...DEFAULT_CATEGORIES])];
    }

    // 4. 활성 탭 로드 (저장된 뷰 키는 board 계열로 정규화)
    const rawView = localStorage.getItem(this.viewKey) || "board";
    const normalizedView = rawView.startsWith("board") ? "board" : rawView;

    const savedActive = localStorage.getItem(this.activeCatKey);
    const activeCategory =
      savedActive && (savedActive === ALL_TAB || categories.includes(savedActive))
        ? savedActive
        : ALL_TAB;

    this.state = {
      tasks,
      categories,
      activeCategory,
      currentView: normalizedView,
      currentMonth: new Date(),
      memo: localStorage.getItem(this.memoKey) || SEED_MEMO
    };

    // 첫 실행이면 시드 저장
    if (!rawTasks) {
      this.saveTasksToLocalStorage();
      localStorage.setItem(this.memoKey, SEED_MEMO);
    }
    // 마이그레이션 결과는 항상 저장 (category 필드 영속화)
    this.saveTasksToLocalStorage();
    this.saveCategoriesToLocalStorage();

    this.listeners = [];
  }

  // --- LOCAL STORAGE SYNC ---
  saveTasksToLocalStorage() {
    localStorage.setItem(this.tasksKey, JSON.stringify(this.state.tasks));
  }

  saveViewToLocalStorage() {
    localStorage.setItem(this.viewKey, this.state.currentView);
  }

  saveCategoriesToLocalStorage() {
    localStorage.setItem(this.catKey, JSON.stringify(this.state.categories));
  }

  saveActiveCategoryToLocalStorage() {
    localStorage.setItem(this.activeCatKey, this.state.activeCategory);
  }

  // --- GETTERS ---
  getTasks() {
    return [...this.state.tasks];
  }

  getCategories() {
    return [...this.state.categories];
  }

  getActiveCategory() {
    return this.state.activeCategory;
  }

  // 활성 탭에 해당하는 할 일만 반환 (ALL_TAB이면 전체)
  getVisibleTasks() {
    if (this.state.activeCategory === ALL_TAB) return [...this.state.tasks];
    return this.state.tasks.filter(t => t.category === this.state.activeCategory);
  }

  getCurrentView() {
    return this.state.currentView;
  }

  getCurrentMonth() {
    return this.state.currentMonth;
  }

  getMemo() {
    return this.state.memo;
  }

  // --- VIEW & TAB CONTROLS ---
  setView(viewName) {
    if (!["board", "calendar", "dashboard"].includes(viewName)) return;
    this.state.currentView = viewName;
    this.saveViewToLocalStorage();
    this.notify();
  }

  setActiveCategory(name) {
    if (name !== ALL_TAB && !this.state.categories.includes(name)) return;
    this.state.activeCategory = name;
    this.saveActiveCategoryToLocalStorage();
    this.notify();
  }

  // 탭(카테고리) 추가
  addCategory(name) {
    const clean = (name || "").trim();
    if (!clean) return { ok: false, message: "탭 이름을 입력해 주세요." };
    if (clean === ALL_TAB || clean === "전체") return { ok: false, message: "'전체'는 기본 탭이라 추가할 수 없어요." };
    if (this.state.categories.includes(clean)) return { ok: false, message: "이미 있는 탭이에요." };
    this.state.categories.push(clean);
    this.saveCategoriesToLocalStorage();
    this.state.activeCategory = clean; // 새로 만든 탭으로 이동
    this.saveActiveCategoryToLocalStorage();
    this.notify();
    return { ok: true };
  }

  // 탭 삭제 — 그 탭의 할 일은 지우지 않고 남은 첫 탭으로 옮긴다 (데이터 보존)
  deleteCategory(name) {
    if (!this.state.categories.includes(name)) return { ok: false };
    if (this.state.categories.length <= 1) {
      return { ok: false, message: "탭은 최소 한 개는 있어야 해요." };
    }
    this.state.categories = this.state.categories.filter(c => c !== name);
    const fallback = this.state.categories[0];
    this.state.tasks = this.state.tasks.map(t =>
      t.category === name ? { ...t, category: fallback } : t
    );
    if (this.state.activeCategory === name) {
      this.state.activeCategory = ALL_TAB;
      this.saveActiveCategoryToLocalStorage();
    }
    this.saveCategoriesToLocalStorage();
    this.saveTasksToLocalStorage();
    this.notify();
    return { ok: true, movedTo: fallback };
  }

  // 탭 이름 변경 — 해당 할 일들의 category도 함께 갱신
  renameCategory(oldName, newName) {
    const clean = (newName || "").trim();
    if (!clean) return { ok: false, message: "탭 이름을 입력해 주세요." };
    if (!this.state.categories.includes(oldName)) return { ok: false };
    if (clean === oldName) return { ok: true };
    if (this.state.categories.includes(clean)) return { ok: false, message: "이미 있는 탭 이름이에요." };

    this.state.categories = this.state.categories.map(c => (c === oldName ? clean : c));
    this.state.tasks = this.state.tasks.map(t =>
      t.category === oldName ? { ...t, category: clean } : t
    );
    if (this.state.activeCategory === oldName) {
      this.state.activeCategory = clean;
      this.saveActiveCategoryToLocalStorage();
    }
    this.saveCategoriesToLocalStorage();
    this.saveTasksToLocalStorage();
    this.notify();
    return { ok: true };
  }

  // Navigate Calendar Months
  setCalendarMonth(date) {
    this.state.currentMonth = date;
    this.notify();
  }

  // Memo Actions
  saveMemo(text) {
    this.state.memo = text;
    localStorage.setItem(this.memoKey, text);
  }

  // --- TASK ACTIONS ---
  // category 미지정 시 현재 활성 탭(전체면 첫 탭)으로 분류
  addTask(title, dueDate = "", category = null) {
    const cat =
      category ||
      (this.state.activeCategory !== ALL_TAB
        ? this.state.activeCategory
        : this.state.categories[0] || "일상");

    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      dueDate: dueDate || "",
      status: "todo",
      category: cat
    };

    this.state.tasks.push(newTask);
    this.saveTasksToLocalStorage();
    this.notify();
    return newTask;
  }

  updateTask(id, updates) {
    this.state.tasks = this.state.tasks.map(task => {
      if (task.id === id) {
        return { ...task, ...updates };
      }
      return task;
    });

    this.saveTasksToLocalStorage();
    this.notify();
  }

  updateTaskStatus(id, newStatus) {
    if (!["todo", "inprogress", "done"].includes(newStatus)) return;
    this.updateTask(id, { status: newStatus });
  }

  deleteTask(id) {
    this.state.tasks = this.state.tasks.filter(task => task.id !== id);
    this.saveTasksToLocalStorage();
    this.notify();
  }

  // --- DATA EXPORT / IMPORT (백업 & 이전용) ---
  exportData() {
    return JSON.stringify({
      _app: "graduate-kanban",
      _version: 3,
      tasks: this.state.tasks,
      categories: this.state.categories,
      memo: this.state.memo,
      currentView: this.state.currentView
    }, null, 2);
  }

  importData(jsonString) {
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      return { ok: false, message: "파일을 읽을 수 없어요. 올바른 백업 파일인지 확인해 주세요." };
    }
    if (!parsed || !Array.isArray(parsed.tasks)) {
      return { ok: false, message: "이 칸반 백업 파일이 아닌 것 같아요." };
    }

    // 불러온 할 일도 category 보강 (구버전 백업 호환)
    const tasks = parsed.tasks.map(t => {
      if (t.category) return t;
      return { ...t, category: OWNER_TO_CATEGORY[t.owner] || "일상" };
    });

    let categories;
    if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
      categories = [...new Set(parsed.categories)];
    } else {
      const fromData = [...new Set(tasks.map(t => t.category).filter(Boolean))];
      categories = [...new Set([...fromData, ...DEFAULT_CATEGORIES])];
    }

    this.state.tasks = tasks;
    this.state.categories = categories;
    if (!categories.includes(this.state.activeCategory)) {
      this.state.activeCategory = ALL_TAB;
      this.saveActiveCategoryToLocalStorage();
    }
    if (typeof parsed.memo === "string") this.state.memo = parsed.memo;

    this.saveTasksToLocalStorage();
    this.saveCategoriesToLocalStorage();
    localStorage.setItem(this.memoKey, this.state.memo);
    this.notify();
    return { ok: true, count: tasks.length };
  }

  // --- SUBSCRIBER PATTERN ---
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const store = new GraduateStore();

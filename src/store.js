/* -------------------------------------------------------------
 * Ultra-Lightweight Reactive State Store (Dual-Board & Dashboard Bound)
 * Supports 'graduate' and 'professor' task partitioning
 * ------------------------------------------------------------- */

// Helper to generate formatted dates relative to today
const getRelativeDateString = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// Initial Seed Tasks for MVP demo (Partitioned by owner)
const SEED_TASKS = [
  {
    id: "task-user-1",
    title: "👑 2026학년도 1학기 연구실 연간 국가 R&D 연구 계획서 최종 승인 및 부서 보고",
    dueDate: getRelativeDateString(1), // Tomorrow
    status: "inprogress",
    owner: "professor"
  },
  {
    id: "task-user-2",
    title: "👑 가을 학회 제출용 인공지능 모델 융합 특허 출원서 명세서 초안 작성",
    dueDate: getRelativeDateString(3), // In 3 days
    status: "todo",
    owner: "professor"
  },
  {
    id: "task-1",
    title: "연구실 주간 학술 세미나 발표 자료 (PPT) 준비",
    dueDate: getRelativeDateString(2), // In 2 days
    status: "todo",
    owner: "graduate"
  },
  {
    id: "task-2",
    title: "GPU 서버 기반 딥러닝 모델 에포크(Epoch) 성능 측정 실험",
    dueDate: getRelativeDateString(0), // Today
    status: "inprogress",
    owner: "graduate"
  },
  {
    id: "task-3",
    title: "KCC 학회 투고 논문 1차 피드백 검토 및 영문 초록 수정",
    dueDate: getRelativeDateString(3), // In 3 days
    status: "todo",
    owner: "graduate"
  },
  {
    id: "task-4",
    title: "학부 컴퓨터 개론 프로그래밍 과제 2차 조교 채점 완료",
    dueDate: getRelativeDateString(-2), // 2 days ago
    status: "done",
    owner: "graduate"
  }
];

const SEED_MEMO = `🎓 오늘의 다짐 & 주간 브리핑 메모
- 이번 주 금요일까지 딥러닝 실험 그래프 추출 완료하기.
- 지도교수님 면담 준비: 학회 피드백 정리본 지참할 것.`;

class GraduateStore {
  constructor() {
    this.tasksKey = "graduate_kanban_tasks_v2"; // V2 version key for new schema compatibility
    this.viewKey = "graduate_kanban_view_v2";
    this.memoKey = "graduate_kanban_memo_v2";
    
    // Load from local storage or fallback to seed tasks
    const rawTasks = localStorage.getItem(this.tasksKey);
    this.state = {
      tasks: rawTasks ? JSON.parse(rawTasks) : SEED_TASKS,
      currentView: localStorage.getItem(this.viewKey) || "board_dual",
      currentMonth: new Date(),
      memo: localStorage.getItem(this.memoKey) || SEED_MEMO
    };

    if (!rawTasks) {
      this.saveTasksToLocalStorage();
      localStorage.setItem(this.memoKey, SEED_MEMO);
    }

    this.listeners = [];
  }

  // --- LOCAL STORAGE SYNC ---
  saveTasksToLocalStorage() {
    localStorage.setItem(this.tasksKey, JSON.stringify(this.state.tasks));
  }

  saveViewToLocalStorage() {
    localStorage.setItem(this.viewKey, this.state.currentView);
  }

  // --- REACTIVE ACTIONS (Dual-Board CRUD & View Controls) ---

  // Getters
  getTasks() {
    return [...this.state.tasks];
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

  // Set View (board_grad, board_prof, calendar, dashboard)
  setView(viewName) {
    if (!["board_dual", "board_grad", "board_prof", "calendar", "dashboard"].includes(viewName)) return;
    this.state.currentView = viewName;
    this.saveViewToLocalStorage();
    this.notify();
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

  // Task Actions
  addTask(title, dueDate = "", owner = "graduate") {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      dueDate: dueDate || "",
      status: "todo",
      owner: owner // 'graduate' or 'professor'
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
      _version: 2,
      tasks: this.state.tasks,
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
    this.state.tasks = parsed.tasks;
    if (typeof parsed.memo === "string") this.state.memo = parsed.memo;
    this.saveTasksToLocalStorage();
    localStorage.setItem(this.memoKey, this.state.memo);
    this.notify();
    return { ok: true, count: parsed.tasks.length };
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

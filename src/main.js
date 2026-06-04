/* -------------------------------------------------------------
 * Main Application Logic & Event Controller
 * Category-Tab Board + Calendar + Dashboard
 * ------------------------------------------------------------- */
import { store, ALL_TAB } from "./store.js";
import { renderBoard } from "./components/Board.js";
import { renderCalendar } from "./components/Calendar.js";
import { renderDashboard } from "./components/Dashboard.js";
import { parseNaturalLanguageDate, extractNaturalLanguageDate } from "./utils/dateParser.js";

// DOM Selector Cache
const appContent = document.getElementById("app-content");
const btnBoardView = document.getElementById("btn-board-view");
const btnCalendarView = document.getElementById("btn-calendar-view");
const btnDashboardView = document.getElementById("btn-dashboard-view");
const btnAddTask = document.getElementById("btn-add-task");

// Track which input had focus before state-induced re-render to restore it
let activeFocusElementInfo = null;

/**
 * Core Render Loop triggered on state changes.
 */
function render(state) {
  const currentView = state.currentView;

  btnBoardView.classList.toggle("active", currentView === "board");
  btnCalendarView.classList.toggle("active", currentView === "calendar");
  btnDashboardView.classList.toggle("active", currentView === "dashboard");

  if (currentView === "calendar") {
    appContent.innerHTML = renderCalendar();
    bindCalendarEvents();
  } else if (currentView === "dashboard") {
    appContent.innerHTML = renderDashboard();
    bindDashboardEvents();
  } else {
    // default: board
    appContent.innerHTML = renderBoard();
    bindBoardEvents();
    bindCategoryTabEvents();
  }

  // Hydrate vector SVG icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Smart Focus Restoration after state re-render
  restoreFocus();
}

// Subscribe global render loop to store
store.subscribe(render);


/* =============================================================
   Focus Recovery System (Keeps keyboard focus persistent)
   ============================================================= */

function saveFocusState(type, key) {
  activeFocusElementInfo = { type, key };
}

function clearFocusState() {
  activeFocusElementInfo = null;
}

function restoreFocus() {
  if (!activeFocusElementInfo) return;

  const { type, key } = activeFocusElementInfo;

  if (type === "board-add" && store.getCurrentView() === "board") {
    const container = document.querySelector(`.static-inline-add[data-status="${key}"]`);
    if (container) {
      const input = container.querySelector(".static-title-input");
      if (input) input.focus();
    }
  } else if (type === "calendar-add" && store.getCurrentView() === "calendar") {
    const container = document.querySelector(`.calendar-static-add-container[data-date="${key}"]`);
    if (container) {
      const input = container.querySelector(".calendar-static-input");
      if (input) input.focus();
    }
  }
}


/* =============================================================
   1. Board View Event Bindings (Drag/Drop, Inline Add & Edit)
   ============================================================= */

function bindBoardEvents() {
  const cards = document.querySelectorAll(".task-card");
  const columns = document.querySelectorAll(".board-column");

  // A. DRAG AND DROP — moves task between status columns
  cards.forEach(card => {
    card.addEventListener("dragstart", (e) => {
      if (card.querySelector("input")) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData("text/plain", card.dataset.id);
      setTimeout(() => card.classList.add("dragging"), 0);
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });
  });

  columns.forEach(column => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      column.classList.add("drag-over");
    });

    column.addEventListener("dragleave", () => {
      column.classList.remove("drag-over");
    });

    column.addEventListener("drop", (e) => {
      e.preventDefault();
      column.classList.remove("drag-over");

      const taskId = e.dataTransfer.getData("text/plain");
      const targetStatus = column.dataset.status;

      if (taskId && targetStatus) {
        store.updateTask(taskId, { status: targetStatus });
      }
    });
  });

  // B. STATIC ZERO-CLICK INLINE ADD
  const staticInputs = document.querySelectorAll(".static-inline-add .static-title-input");
  staticInputs.forEach(input => {
    const container = input.closest(".static-inline-add");
    const status = container.dataset.status;

    input.addEventListener("focus", () => {
      saveFocusState("board-add", status);
    });

    input.addEventListener("blur", () => {
      setTimeout(() => {
        if (activeFocusElementInfo && activeFocusElementInfo.type === "board-add" && activeFocusElementInfo.key === status && document.activeElement !== input) {
          clearFocusState();
        }
      }, 100);
    });

    input.addEventListener("keydown", (e) => {
      if (e.isComposing || e.keyCode === 229) return; // IME

      if (e.key === "Enter") {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) return;

        saveFocusState("board-add", status);

        const { title: parsedTitle, dueDate: parsedDueDate } = extractNaturalLanguageDate(val);
        if (!parsedTitle) return;

        // 새 할 일은 현재 활성 탭으로 분류됨 (store.addTask 기본 동작)
        const newTask = store.addTask(parsedTitle, parsedDueDate);
        if (status !== "todo") {
          store.updateTaskStatus(newTask.id, status);
        }
      } else if (e.key === "Escape") {
        input.value = "";
        input.blur();
        clearFocusState();
      }
    });
  });

  // C. INLINE EDIT TITLE (double click)
  const editableTitles = document.querySelectorAll(".inline-edit-title");
  editableTitles.forEach(titleEl => {
    titleEl.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (titleEl.querySelector("input")) return;

      const taskId = titleEl.dataset.id;
      // 카테고리 배지를 제외한 순수 제목만 추출
      const task = store.getTasks().find(t => t.id === taskId);
      const originalText = task ? task.title : titleEl.textContent.trim();

      const input = document.createElement("input");
      input.type = "text";
      input.className = "form-input py-1 px-1.5 text-xs w-full";
      input.style.fontFamily = "inherit";
      input.value = originalText;

      titleEl.innerHTML = "";
      titleEl.appendChild(input);
      input.focus();
      input.select();

      let finished = false;
      clearFocusState();

      const saveEdit = () => {
        if (finished) return;
        finished = true;
        const newValue = input.value.trim();
        if (newValue && newValue !== originalText) {
          store.updateTask(taskId, { title: newValue });
        } else {
          titleEl.textContent = originalText;
        }
      };

      const cancelEdit = () => {
        if (finished) return;
        finished = true;
        titleEl.textContent = originalText;
      };

      input.addEventListener("blur", saveEdit);
      input.addEventListener("keydown", (evt) => {
        if (evt.isComposing || evt.keyCode === 229) return;
        if (evt.key === "Enter") { evt.preventDefault(); saveEdit(); }
        else if (evt.key === "Escape") { evt.preventDefault(); cancelEdit(); }
      });
    });
  });

  // D. INLINE EDIT DUE DATE (single click)
  const editableDues = document.querySelectorAll(".inline-edit-due, .task-card-due");
  editableDues.forEach(dueEl => {
    dueEl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (dueEl.querySelector("input")) return;

      const taskId = dueEl.dataset.id;
      const spanTextEl = dueEl.querySelector(".due-text");

      const task = store.getTasks().find(t => t.id === taskId);
      const originalDateText = task ? task.dueDate : (spanTextEl ? spanTextEl.textContent.trim() : "");

      const input = document.createElement("input");
      input.type = "text";
      input.className = "form-input py-0.5 px-1 text-[11px] font-mono";
      input.style.width = "140px";
      input.style.display = "inline-block";
      input.placeholder = "예: 오늘, 내일, 6/17";
      input.value = originalDateText;

      const icon = dueEl.querySelector("i");
      if (icon) icon.style.display = "none";
      if (spanTextEl) spanTextEl.style.display = "none";
      dueEl.appendChild(input);
      input.focus();
      input.select();

      let finished = false;
      clearFocusState();

      const saveEdit = () => {
        if (finished) return;
        finished = true;
        const val = input.value.trim();
        if (val) {
          const parsed = parseNaturalLanguageDate(val) || val;
          store.updateTask(taskId, { dueDate: parsed });
        } else {
          store.updateTask(taskId, { dueDate: "" });
        }
      };

      const cancelEdit = () => {
        if (finished) return;
        finished = true;
        if (icon) icon.style.display = "";
        if (spanTextEl) spanTextEl.style.display = "";
        input.remove();
      };

      input.addEventListener("blur", saveEdit);
      input.addEventListener("keydown", (evt) => {
        if (evt.isComposing || evt.keyCode === 229) return;
        if (evt.key === "Enter") { evt.preventDefault(); saveEdit(); }
        else if (evt.key === "Escape") { evt.preventDefault(); cancelEdit(); }
      });
    });
  });

  // E. DELETE BUTTON
  document.querySelectorAll(".delete-task-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      store.deleteTask(btn.dataset.id);
    });
  });

  // F. CHECK CIRCLE TOGGLE (done <-> todo)
  document.querySelectorAll(".reminder-check-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const taskId = btn.dataset.id;
      const currentStatus = btn.dataset.status;
      const targetStatus = currentStatus === "done" ? "todo" : "done";
      store.updateTaskStatus(taskId, targetStatus);
    });
  });
}


/* =============================================================
   1b. Category Tab Bar Event Bindings
   ============================================================= */

function bindCategoryTabEvents() {
  // 탭 클릭 → 활성 탭 전환
  document.querySelectorAll(".cat-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      store.setActiveCategory(tab.dataset.cat);
    });
  });

  // 탭 더블클릭 → 이름 변경 (사용자 정의 탭만)
  document.querySelectorAll(".cat-tab-named").forEach(tab => {
    tab.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (tab.querySelector("input")) return;

      const oldName = tab.dataset.cat;
      const input = document.createElement("input");
      input.type = "text";
      input.className = "cat-tab-edit-input form-input";
      input.value = oldName;

      tab.textContent = "";
      tab.appendChild(input);
      input.focus();
      input.select();

      let finished = false;
      const finish = (commit) => {
        if (finished) return;
        finished = true;
        const val = input.value.trim();
        if (commit && val && val !== oldName) {
          const r = store.renameCategory(oldName, val);
          if (!r.ok && r.message) {
            window.alert(r.message);
            tab.textContent = oldName;
          }
          // 성공 시 store.notify → 재렌더
        } else {
          tab.textContent = oldName;
        }
      };

      input.addEventListener("keydown", (evt) => {
        if (evt.isComposing || evt.keyCode === 229) return;
        if (evt.key === "Enter") { evt.preventDefault(); finish(true); }
        else if (evt.key === "Escape") { evt.preventDefault(); finish(false); }
      });
      input.addEventListener("blur", () => finish(true));
    });
  });

  // 탭 삭제 (× 버튼) — 할 일은 남은 첫 탭으로 이동, 삭제되지 않음
  document.querySelectorAll(".cat-tab-delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const r = store.deleteCategory(btn.dataset.cat);
      if (!r.ok && r.message) window.alert(r.message);
    });
  });

  // 탭 추가 — 버튼 자리에 인라인 입력
  const addBtn = document.getElementById("cat-tab-add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      if (document.getElementById("cat-tab-add-input")) return;

      const input = document.createElement("input");
      input.id = "cat-tab-add-input";
      input.type = "text";
      input.className = "cat-tab-edit-input form-input";
      input.placeholder = "새 탭 이름";
      addBtn.parentNode.insertBefore(input, addBtn);
      addBtn.style.display = "none";
      input.focus();

      let finished = false;
      const finish = (commit) => {
        if (finished) return;
        finished = true;
        const val = input.value.trim();
        if (input.parentNode) input.remove();
        addBtn.style.display = "";
        if (commit && val) {
          const r = store.addCategory(val);
          if (!r.ok && r.message) window.alert(r.message);
          // 성공 시 store.notify → 재렌더
        }
      };

      input.addEventListener("keydown", (evt) => {
        if (evt.isComposing || evt.keyCode === 229) return;
        if (evt.key === "Enter") { evt.preventDefault(); finish(true); }
        else if (evt.key === "Escape") { evt.preventDefault(); finish(false); }
      });
      input.addEventListener("blur", () => finish(true));
    });
  }
}


/* =============================================================
   2. Calendar View Navigation & Grid Event Handlers
   ============================================================= */

function bindCalendarEvents() {
  const prevBtn = document.getElementById("calendar-prev-btn");
  const nextBtn = document.getElementById("calendar-next-btn");
  const todayBtn = document.getElementById("calendar-today-btn");

  if (prevBtn && nextBtn && todayBtn) {
    prevBtn.addEventListener("click", () => {
      const date = store.getCurrentMonth();
      store.setCalendarMonth(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    });

    nextBtn.addEventListener("click", () => {
      const date = store.getCurrentMonth();
      store.setCalendarMonth(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    });

    todayBtn.addEventListener("click", () => {
      store.setCalendarMonth(new Date());
    });
  }

  // CALENDAR QUICK ADD — 현재 활성 탭으로 분류
  const calendarInputs = document.querySelectorAll(".calendar-static-input");
  calendarInputs.forEach(input => {
    const container = input.closest(".calendar-static-add-container");
    const dateStr = container.dataset.date;

    input.addEventListener("focus", () => {
      saveFocusState("calendar-add", dateStr);
    });

    input.addEventListener("blur", () => {
      setTimeout(() => {
        if (activeFocusElementInfo && activeFocusElementInfo.type === "calendar-add" && activeFocusElementInfo.key === dateStr && document.activeElement !== input) {
          clearFocusState();
        }
      }, 100);
    });

    input.addEventListener("keydown", (e) => {
      if (e.isComposing || e.keyCode === 229) return;

      if (e.key === "Enter") {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) return;

        saveFocusState("calendar-add", dateStr);

        const { title: parsedTitle, dueDate: parsedDueDate } = extractNaturalLanguageDate(val);
        if (!parsedTitle) return;

        store.addTask(parsedTitle, parsedDueDate || dateStr);
      } else if (e.key === "Escape") {
        input.value = "";
        input.blur();
        clearFocusState();
      }
    });
  });

  // CALENDAR PILL: DOUBLE CLICK TO EDIT TITLE INLINE
  const calendarPills = document.querySelectorAll(".calendar-inline-edit-pill");
  calendarPills.forEach(pill => {
    pill.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (pill.querySelector("input")) return;

      const taskId = pill.dataset.id;
      const task = store.getTasks().find(t => t.id === taskId);
      const textToEdit = task ? task.title : pill.textContent.trim();

      const input = document.createElement("input");
      input.type = "text";
      input.className = "form-input py-0.5 px-1 text-[9px] w-full";
      input.style.height = "16px";
      input.value = textToEdit;

      pill.innerHTML = "";
      pill.appendChild(input);
      input.focus();
      input.select();

      let finished = false;
      clearFocusState();

      const saveEdit = () => {
        if (finished) return;
        finished = true;
        const newValue = input.value.trim();
        if (newValue && newValue !== textToEdit) {
          store.updateTask(taskId, { title: newValue });
        } else {
          store.notify();
        }
      };

      const cancelEdit = () => {
        if (finished) return;
        finished = true;
        store.notify();
      };

      input.addEventListener("blur", saveEdit);
      input.addEventListener("keydown", (evt) => {
        if (evt.isComposing || evt.keyCode === 229) return;
        if (evt.key === "Enter") { evt.preventDefault(); saveEdit(); }
        else if (evt.key === "Escape") { evt.preventDefault(); cancelEdit(); }
      });
    });
  });
}


/* =============================================================
   3. Dashboard View Event Bindings
   ============================================================= */

function bindDashboardEvents() {
  const notepad = document.getElementById("dashboard-notepad");
  if (notepad) {
    notepad.addEventListener("input", (e) => {
      store.saveMemo(e.target.value);
    });
  }

  document.querySelectorAll(".btn-quick-inprogress").forEach(btn => {
    btn.addEventListener("click", () => {
      store.updateTaskStatus(btn.dataset.id, "inprogress");
    });
  });

  document.querySelectorAll(".btn-quick-done").forEach(btn => {
    btn.addEventListener("click", () => {
      store.updateTaskStatus(btn.dataset.id, "done");
    });
  });

  // 대시보드 카테고리 칩 클릭 → 보드로 이동하며 해당 탭 활성화
  document.querySelectorAll(".dash-cat-link").forEach(el => {
    el.addEventListener("click", () => {
      store.setActiveCategory(el.dataset.cat);
      store.setView("board");
    });
  });
}


/* =============================================================
   4. Global App Control Bindings & Bootstrap
   ============================================================= */

btnBoardView.addEventListener("click", () => store.setView("board"));
btnCalendarView.addEventListener("click", () => store.setView("calendar"));
btnDashboardView.addEventListener("click", () => store.setView("dashboard"));

// Global Quick Add Task Button → 보드로 가서 To Do 입력창 포커스
btnAddTask.addEventListener("click", () => {
  if (store.getCurrentView() !== "board") {
    store.setView("board");
    setTimeout(focusBoardAddInput, 50);
  } else {
    focusBoardAddInput();
  }
});

function focusBoardAddInput() {
  const container = document.querySelector('.static-inline-add[data-status="todo"]');
  if (container) {
    const input = container.querySelector(".static-title-input");
    if (input) {
      input.focus();
      saveFocusState("board-add", "todo");
    }
  }
}

// Data Backup: Export
const btnExportData = document.getElementById("btn-export-data");
const btnImportData = document.getElementById("btn-import-data");
const importFileInput = document.getElementById("import-file-input");

if (btnExportData) {
  btnExportData.addEventListener("click", () => {
    const data = store.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `졸업칸반-백업-${today}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

if (btnImportData && importFileInput) {
  btnImportData.addEventListener("click", () => importFileInput.click());

  importFileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = store.importData(ev.target.result);
      if (result.ok) {
        window.alert(`불러오기 완료! 할 일 ${result.count}개를 가져왔어요.`);
      } else {
        window.alert(result.message);
      }
      importFileInput.value = "";
    };
    reader.readAsText(file);
  });
}

// App Initial Load Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  render(store.state);
});

if (document.readyState === "interactive" || document.readyState === "complete") {
  render(store.state);
}

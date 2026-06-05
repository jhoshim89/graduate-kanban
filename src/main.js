/* -------------------------------------------------------------
 * Main Application Logic & Event Controller
 * Category-Tab Checklist + Calendar + Dashboard
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

let activeFocusElementInfo = null;

function render(state) {
  const currentView = state.currentView;

  btnBoardView.classList.toggle("active", currentView === "board");
  btnCalendarView.classList.toggle("active", currentView === "calendar");
  btnDashboardView.classList.toggle("active", currentView === "dashboard");

  closeMoveMenu();

  if (currentView === "calendar") {
    appContent.innerHTML = renderCalendar();
    bindCalendarEvents();
  } else if (currentView === "dashboard") {
    appContent.innerHTML = renderDashboard();
    bindDashboardEvents();
  } else {
    appContent.innerHTML = renderBoard();
    bindBoardEvents();
    bindCategoryTabEvents();
  }

  if (window.lucide) window.lucide.createIcons();
  restoreFocus();
}

store.subscribe(render);


/* ===== Focus Recovery ===== */
function saveFocusState(type, key) { activeFocusElementInfo = { type, key }; }
function clearFocusState() { activeFocusElementInfo = null; }

function restoreFocus() {
  if (!activeFocusElementInfo) return;
  const { type, key } = activeFocusElementInfo;

  if (type === "board-add" && store.getCurrentView() === "board") {
    const container = document.querySelector(`.static-inline-add[data-status="${key}"]`);
    const input = container && container.querySelector(".static-title-input");
    if (input) input.focus();
  } else if (type === "calendar-add" && store.getCurrentView() === "calendar") {
    const container = document.querySelector(`.calendar-static-add-container[data-date="${key}"]`);
    const input = container && container.querySelector(".calendar-static-input");
    if (input) input.focus();
  }
}


/* ===== Card → Tab move menu (popup) ===== */
function closeMoveMenu() {
  const m = document.querySelector(".move-menu");
  if (m) m.remove();
}


/* ===== 드래그 시작 시 옆에 뜨는 탭 드롭 패널 ===== */
let dropPanelEl = null;

function showDropPanel(taskId) {
  hideDropPanel();
  const task = store.getTasks().find(t => t.id === taskId);
  if (!task) return;
  const cats = store.getCategories();

  const panel = document.createElement("div");
  panel.className = "drag-drop-panel";

  const title = document.createElement("div");
  title.className = "drag-drop-panel-title";
  title.textContent = "여기로 끌어 놓으세요";
  panel.appendChild(title);

  cats.forEach(c => {
    const zone = document.createElement("div");
    zone.className = "drag-drop-zone" + (c === task.category ? " is-current" : "");
    zone.textContent = c === task.category ? `${c} (현재)` : c;
    zone.addEventListener("dragenter", (e) => { e.preventDefault(); zone.classList.add("over"); });
    zone.addEventListener("dragover", (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; zone.classList.add("over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = e.dataTransfer.getData("text/plain") || taskId;
      store.updateTask(id, { category: c });
      hideDropPanel();
    });
    panel.appendChild(zone);
  });

  document.body.appendChild(panel);
  dropPanelEl = panel;
}

function hideDropPanel() {
  if (dropPanelEl) { dropPanelEl.remove(); dropPanelEl = null; }
}

function openMoveMenu(btn, taskId) {
  closeMoveMenu();
  const task = store.getTasks().find(t => t.id === taskId);
  if (!task) return;
  const cats = store.getCategories().filter(c => c !== task.category);
  if (cats.length === 0) {
    window.alert("옮길 다른 탭이 없어요. 먼저 위쪽 '+ 탭 추가'로 탭을 만드세요.");
    return;
  }

  const menu = document.createElement("div");
  menu.className = "move-menu";

  const title = document.createElement("div");
  title.className = "move-menu-title";
  title.textContent = "어느 탭으로 옮길까요?";
  menu.appendChild(title);

  cats.forEach(c => {
    const item = document.createElement("button");
    item.className = "move-menu-item";
    item.textContent = c;
    item.addEventListener("click", (ev) => {
      ev.stopPropagation();
      store.updateTask(taskId, { category: c });
      closeMoveMenu();
    });
    menu.appendChild(item);
  });

  document.body.appendChild(menu);

  const rect = btn.getBoundingClientRect();
  const menuWidth = 160;
  let left = window.scrollX + rect.right - menuWidth;
  if (left < 8) left = 8;
  menu.style.top = (window.scrollY + rect.bottom + 6) + "px";
  menu.style.left = left + "px";

  // 바깥 클릭 시 닫기
  setTimeout(() => {
    document.addEventListener("click", function onDocClick(e) {
      if (!menu.contains(e.target)) {
        closeMoveMenu();
        document.removeEventListener("click", onDocClick);
      }
    });
  }, 0);
}


/* =============================================================
   Board View — Checklist + Drag-to-Tab + Inline Edit
   ============================================================= */
function bindBoardEvents() {
  // A. 드래그 핸들로만 드래그 시작 (드롭 대상은 상단 탭)
  document.querySelectorAll(".card-drag-handle").forEach(handle => {
    handle.addEventListener("dragstart", (e) => {
      const card = handle.closest(".task-card");
      if (!card) return;
      e.dataTransfer.setData("text/plain", card.dataset.id);
      e.dataTransfer.effectAllowed = "move";
      setTimeout(() => card.classList.add("dragging"), 0);
      showDropPanel(card.dataset.id); // 옆에 탭 드롭 목록 띄우기
    });
    handle.addEventListener("dragend", () => {
      const card = handle.closest(".task-card");
      if (card) card.classList.remove("dragging");
      hideDropPanel();
    });
  });

  // B. 새 할 일 인라인 추가
  document.querySelectorAll(".static-inline-add .static-title-input").forEach(input => {
    const container = input.closest(".static-inline-add");
    const status = container.dataset.status; // "todo"

    input.addEventListener("focus", () => saveFocusState("board-add", status));
    input.addEventListener("blur", () => {
      setTimeout(() => {
        if (activeFocusElementInfo && activeFocusElementInfo.type === "board-add" && activeFocusElementInfo.key === status && document.activeElement !== input) {
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
        saveFocusState("board-add", status);
        const { title, dueDate } = extractNaturalLanguageDate(val);
        if (!title) return;
        store.addTask(title, dueDate); // 현재 활성 탭으로 분류
      } else if (e.key === "Escape") {
        input.value = "";
        input.blur();
        clearFocusState();
      }
    });
  });

  // C. 제목 더블클릭 인라인 수정
  document.querySelectorAll(".inline-edit-title").forEach(titleEl => {
    titleEl.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (titleEl.querySelector("input")) return;

      const taskId = titleEl.dataset.id;
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
        const v = input.value.trim();
        if (v && v !== originalText) store.updateTask(taskId, { title: v });
        else titleEl.textContent = originalText;
      };
      const cancelEdit = () => { if (finished) return; finished = true; titleEl.textContent = originalText; };
      input.addEventListener("blur", saveEdit);
      input.addEventListener("keydown", (evt) => {
        if (evt.isComposing || evt.keyCode === 229) return;
        if (evt.key === "Enter") { evt.preventDefault(); saveEdit(); }
        else if (evt.key === "Escape") { evt.preventDefault(); cancelEdit(); }
      });
    });
  });

  // D. 마감일 클릭 인라인 수정
  document.querySelectorAll(".task-card-due").forEach(dueEl => {
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

  // E. 삭제
  document.querySelectorAll(".delete-task-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      store.deleteTask(btn.dataset.id);
    });
  });

  // F. 완료 체크 토글
  document.querySelectorAll(".reminder-check-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const taskId = btn.dataset.id;
      const target = btn.dataset.status === "done" ? "todo" : "done";
      store.updateTaskStatus(taskId, target);
    });
  });

  // G. 카드 '다른 탭으로 옮기기' 버튼
  document.querySelectorAll(".card-move-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openMoveMenu(btn, btn.dataset.id);
    });
  });
}


/* ===== Category Tab Bar ===== */
function bindCategoryTabEvents() {
  // 탭 클릭 → 전환
  document.querySelectorAll(".cat-tab").forEach(tab => {
    tab.addEventListener("click", () => store.setActiveCategory(tab.dataset.cat));
  });

  // 탭으로 카드 드래그 드롭 → 카테고리 이동
  document.querySelectorAll(".cat-tab-wrap").forEach(wrap => {
    const cat = wrap.dataset.cat;
    wrap.addEventListener("dragover", (e) => { e.preventDefault(); wrap.classList.add("tab-drop-over"); });
    wrap.addEventListener("dragleave", () => wrap.classList.remove("tab-drop-over"));
    wrap.addEventListener("drop", (e) => {
      e.preventDefault();
      wrap.classList.remove("tab-drop-over");
      const taskId = e.dataTransfer.getData("text/plain");
      if (taskId && cat) store.updateTask(taskId, { category: cat });
    });
  });

  // 탭 더블클릭 → 이름 변경
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
          if (!r.ok && r.message) { window.alert(r.message); tab.textContent = oldName; }
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

  // 탭 삭제 (× 버튼) — 실수 방지용 확인창
  document.querySelectorAll(".cat-tab-delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const cat = btn.dataset.cat;
      const ok = window.confirm(`'${cat}' 탭을 삭제할까요?\n\n이 탭의 할 일은 사라지지 않고 다른 탭으로 옮겨집니다.`);
      if (!ok) return;
      const r = store.deleteCategory(cat);
      if (!r.ok && r.message) window.alert(r.message);
    });
  });

  // 탭 추가 — 인라인 입력
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


/* ===== Calendar View ===== */
function bindCalendarEvents() {
  const prevBtn = document.getElementById("calendar-prev-btn");
  const nextBtn = document.getElementById("calendar-next-btn");
  const todayBtn = document.getElementById("calendar-today-btn");

  if (prevBtn && nextBtn && todayBtn) {
    prevBtn.addEventListener("click", () => {
      const d = store.getCurrentMonth();
      store.setCalendarMonth(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    });
    nextBtn.addEventListener("click", () => {
      const d = store.getCurrentMonth();
      store.setCalendarMonth(new Date(d.getFullYear(), d.getMonth() + 1, 1));
    });
    todayBtn.addEventListener("click", () => store.setCalendarMonth(new Date()));
  }

  document.querySelectorAll(".calendar-static-input").forEach(input => {
    const container = input.closest(".calendar-static-add-container");
    const dateStr = container.dataset.date;

    input.addEventListener("focus", () => saveFocusState("calendar-add", dateStr));
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
        const { title, dueDate } = extractNaturalLanguageDate(val);
        if (!title) return;
        store.addTask(title, dueDate || dateStr);
      } else if (e.key === "Escape") {
        input.value = "";
        input.blur();
        clearFocusState();
      }
    });
  });

  document.querySelectorAll(".calendar-inline-edit-pill").forEach(pill => {
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
        const v = input.value.trim();
        if (v && v !== textToEdit) store.updateTask(taskId, { title: v });
        else store.notify();
      };
      const cancelEdit = () => { if (finished) return; finished = true; store.notify(); };
      input.addEventListener("blur", saveEdit);
      input.addEventListener("keydown", (evt) => {
        if (evt.isComposing || evt.keyCode === 229) return;
        if (evt.key === "Enter") { evt.preventDefault(); saveEdit(); }
        else if (evt.key === "Escape") { evt.preventDefault(); cancelEdit(); }
      });
    });
  });
}


/* ===== Dashboard View ===== */
function bindDashboardEvents() {
  const notepad = document.getElementById("dashboard-notepad");
  if (notepad) notepad.addEventListener("input", (e) => store.saveMemo(e.target.value));

  document.querySelectorAll(".btn-quick-done").forEach(btn => {
    btn.addEventListener("click", () => store.updateTaskStatus(btn.dataset.id, "done"));
  });

  document.querySelectorAll(".dash-cat-link").forEach(el => {
    el.addEventListener("click", () => {
      store.setActiveCategory(el.dataset.cat);
      store.setView("board");
    });
  });
}


/* ===== Global Controls & Bootstrap ===== */
btnBoardView.addEventListener("click", () => store.setView("board"));
btnCalendarView.addEventListener("click", () => store.setView("calendar"));
btnDashboardView.addEventListener("click", () => store.setView("dashboard"));

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
  const input = container && container.querySelector(".static-title-input");
  if (input) {
    input.focus();
    saveFocusState("board-add", "todo");
  }
}

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
      if (result.ok) window.alert(`불러오기 완료! 할 일 ${result.count}개를 가져왔어요.`);
      else window.alert(result.message);
      importFileInput.value = "";
    };
    reader.readAsText(file);
  });
}

document.addEventListener("DOMContentLoaded", () => render(store.state));
if (document.readyState === "interactive" || document.readyState === "complete") {
  render(store.state);
}

/* -------------------------------------------------------------
 * Main Application Logic & Event Controller
 * Full Dual-Board (Graduate vs Professor) Support
 * ------------------------------------------------------------- */
import { store } from "./store.js";
import { renderBoard, renderDualBoard } from "./components/Board.js";
import { renderCalendar } from "./components/Calendar.js";
import { renderDashboard } from "./components/Dashboard.js";
import { parseNaturalLanguageDate, extractNaturalLanguageDate } from "./utils/dateParser.js";

// DOM Selector Cache
const appContent = document.getElementById("app-content");
const btnBoardDualView = document.getElementById("btn-board-dual-view");
const btnBoardGradView = document.getElementById("btn-board-grad-view");
const btnBoardProfView = document.getElementById("btn-board-prof-view");
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

  // 1. Render active view & bind corresponding events
  if (currentView === "board_dual") {
    btnBoardDualView.classList.add("active");
    btnBoardGradView.classList.remove("active");
    btnBoardProfView.classList.remove("active");
    btnCalendarView.classList.remove("active");
    btnDashboardView.classList.remove("active");
    appContent.innerHTML = renderDualBoard();
    bindBoardEvents("graduate");
    bindBoardEvents("professor");
  } else if (currentView === "board_grad") {
    btnBoardDualView.classList.remove("active");
    btnBoardGradView.classList.add("active");
    btnBoardProfView.classList.remove("active");
    btnCalendarView.classList.remove("active");
    btnDashboardView.classList.remove("active");
    appContent.innerHTML = renderBoard("graduate", "light");
    bindBoardEvents("graduate");
  } else if (currentView === "board_prof") {
    btnBoardDualView.classList.remove("active");
    btnBoardGradView.classList.remove("active");
    btnBoardProfView.classList.add("active");
    btnCalendarView.classList.remove("active");
    btnDashboardView.classList.remove("active");
    appContent.innerHTML = renderBoard("professor", "dark");
    bindBoardEvents("professor");
  } else if (currentView === "calendar") {
    btnBoardDualView.classList.remove("active");
    btnBoardGradView.classList.remove("active");
    btnBoardProfView.classList.remove("active");
    btnCalendarView.classList.add("active");
    btnDashboardView.classList.remove("active");
    appContent.innerHTML = renderCalendar();
    bindCalendarEvents();
  } else if (currentView === "dashboard") {
    btnBoardDualView.classList.remove("active");
    btnBoardGradView.classList.remove("active");
    btnBoardProfView.classList.remove("active");
    btnCalendarView.classList.remove("active");
    btnDashboardView.classList.add("active");
    appContent.innerHTML = renderDashboard();
    bindDashboardEvents();
  }

  // 2. Hydrate vector SVG icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 3. Smart Focus Restoration after state re-render
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

  if (type === "board-add") {
    const [status, owner] = key.split(":");
    // Ensure we are restoring to the currently visible owner board or dual view
    const currentView = store.getCurrentView();
    const isDual = currentView === "board_dual";
    const activeOwner = currentView === "board_grad" ? "graduate" : (currentView === "board_prof" ? "professor" : null);

    if (isDual || owner === activeOwner) {
      const container = document.querySelector(`.static-inline-add[data-status="${status}"][data-owner="${owner}"]`);
      if (container) {
        const input = container.querySelector(".static-title-input");
        if (input) {
          input.focus();
        }
      }
    }
  } else if (type === "calendar-add" && store.getCurrentView() === "calendar") {
    const container = document.querySelector(`.calendar-static-add-container[data-date="${key}"]`);
    if (container) {
      const input = container.querySelector(".calendar-static-input");
      if (input) {
        input.focus();
      }
    }
  }
}


/* =============================================================
   1. Board View Static Additions & Inline Editing Event Bindings
   ============================================================= */

function bindBoardEvents(owner) {
  const cards = document.querySelectorAll(`.task-card[data-owner="${owner}"]`);
  const columns = document.querySelectorAll(`.board-column[data-owner="${owner}"]`);

  // -----------------------------------------------------------
  // A. DRAG AND DROP HANDLERS
  // -----------------------------------------------------------
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
      const targetOwner = column.dataset.owner;
      
      if (taskId && targetStatus) {
        // Update both status and verify owner matching
        store.updateTask(taskId, { 
          status: targetStatus,
          owner: targetOwner // Allow moving task owner if dropped across columns (though currently separated)
        });
      }
    });
  });

  // -----------------------------------------------------------
  // B. STATIC ZERO-CLICK INLINE ADD FORM EVENT HANDLERS
  // -----------------------------------------------------------
  const staticInputs = document.querySelectorAll(`.static-inline-add[data-owner="${owner}"] .static-title-input`);
  staticInputs.forEach(input => {
    const container = input.closest(".static-inline-add");
    const status = container.dataset.status;
    const inputOwner = container.dataset.owner;

    input.addEventListener("focus", () => {
      saveFocusState("board-add", `${status}:${inputOwner}`);
    });

    input.addEventListener("blur", () => {
      setTimeout(() => {
        if (activeFocusElementInfo && activeFocusElementInfo.type === "board-add" && activeFocusElementInfo.key === `${status}:${inputOwner}` && document.activeElement !== input) {
          clearFocusState();
        }
      }, 100);
    });

    input.addEventListener("keydown", (e) => {
      // IME Fixed
      if (e.isComposing || e.keyCode === 229) return;

      if (e.key === "Enter") {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) return;

        saveFocusState("board-add", `${status}:${inputOwner}`);

        // Extract due date intelligently and separate title
        const { title: parsedTitle, dueDate: parsedDueDate } = extractNaturalLanguageDate(val);
        if (!parsedTitle) return;

        // Add task with parsed parameters (supports no due date)
        const newTask = store.addTask(parsedTitle, parsedDueDate, inputOwner);
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

  // -----------------------------------------------------------
  // C. INLINE EDITING: DOUBLE CLICK TITLE TO EDIT
  // -----------------------------------------------------------
  const editableTitles = document.querySelectorAll(`.board-column[data-owner="${owner}"] .inline-edit-title`);
  editableTitles.forEach(titleEl => {
    titleEl.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (titleEl.querySelector("input")) return;

      const taskId = titleEl.dataset.id;
      const originalText = titleEl.textContent.trim();

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

        if (evt.key === "Enter") {
          evt.preventDefault();
          saveEdit();
        } else if (evt.key === "Escape") {
          evt.preventDefault();
          cancelEdit();
        }
      });
    });
  });

  // -----------------------------------------------------------
  // D. INLINE EDITING: SINGLE CLICK DUE DATE TO EDIT
  // -----------------------------------------------------------
  const editableDues = document.querySelectorAll(`.board-column[data-owner="${owner}"] .inline-edit-due`);
  editableDues.forEach(dueEl => {
    dueEl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (dueEl.querySelector("input")) return;

      const taskId = dueEl.dataset.id;
      const spanTextEl = dueEl.querySelector(".due-text");
      
      const task = store.getTasks().find(t => t.id === taskId);
      const originalDateText = task ? task.dueDate : spanTextEl.textContent.trim();

      const input = document.createElement("input");
      input.type = "text";
      input.className = "form-input py-0.5 px-1 text-[11px] font-mono";
      input.style.width = "140px";
      input.style.display = "inline-block";
      input.placeholder = "예: 오늘, 내일, 5/30";
      input.value = originalDateText;

      const icon = dueEl.querySelector("i");
      if (icon) icon.style.display = "none";
      spanTextEl.style.display = "none";
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
          if (icon) icon.style.display = "";
          spanTextEl.style.display = "";
          input.remove();
        }
      };

      const cancelEdit = () => {
        if (finished) return;
        finished = true;
        if (icon) icon.style.display = "";
        spanTextEl.style.display = "";
        input.remove();
      };

      input.addEventListener("blur", saveEdit);
      input.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter") {
          evt.preventDefault();
          saveEdit();
        } else if (evt.key === "Escape") {
          evt.preventDefault();
          cancelEdit();
        }
      });
    });
  });

  // -----------------------------------------------------------
  // E. CARD ACTION: DIRECT DELETE BUTTON HANDLER
  // -----------------------------------------------------------
  const deleteButtons = document.querySelectorAll(`.board-column[data-owner="${owner}"] .delete-task-btn`);
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const taskId = btn.dataset.id;
      store.deleteTask(taskId);
    });
  });

  // -----------------------------------------------------------
  // F. APPLE REMINDERS CHECK CIRCLE CLICK HANDLER
  // -----------------------------------------------------------
  const checkButtons = document.querySelectorAll(`.board-column[data-owner="${owner}"] .reminder-check-btn`);
  checkButtons.forEach(btn => {
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

  // CALENDAR QUICK ADD (Adds to 'professor' board by default as user controls this)
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
        
        // Extract due date intelligently and separate title (keeps dateStr if no date parsed)
        const { title: parsedTitle, dueDate: parsedDueDate } = extractNaturalLanguageDate(val);
        if (!parsedTitle) return;

        // Default to professor task since user is editing directly in calendar
        store.addTask(parsedTitle, parsedDueDate || dateStr, "professor");
      } else if (e.key === "Escape") {
        input.value = "";
        input.blur();
        clearFocusState();
      }
    });
  });

  // CALENDAR BADGE CLICK: DOUBLE CLICK TO EDIT TITLE INLINE
  const calendarPills = document.querySelectorAll(".calendar-inline-edit-pill");
  calendarPills.forEach(pill => {
    pill.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (pill.querySelector("input")) return;

      const taskId = pill.dataset.id;
      const originalText = pill.textContent.trim();

      // Extract raw text excluding crown/cap emoji
      const textToEdit = originalText.replace(/^[👑🎓]\s*/, "");

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
          pill.textContent = originalText;
        }
      };

      const cancelEdit = () => {
        if (finished) return;
        finished = true;
        pill.textContent = originalText;
      };

      input.addEventListener("blur", saveEdit);
      input.addEventListener("keydown", (evt) => {
        if (evt.isComposing || evt.keyCode === 229) return;

        if (evt.key === "Enter") {
          evt.preventDefault();
          saveEdit();
        } else if (evt.key === "Escape") {
          evt.preventDefault();
          cancelEdit();
        }
      });
    });
  });
}


/* =============================================================
   3. Premium Dashboard View Event Bindings
   ============================================================= */

function bindDashboardEvents() {
  const notepad = document.getElementById("dashboard-notepad");
  if (notepad) {
    notepad.addEventListener("input", (e) => {
      store.saveMemo(e.target.value);
    });
  }

  const btnInprogressList = document.querySelectorAll(".btn-quick-inprogress");
  const btnDoneList = document.querySelectorAll(".btn-quick-done");

  btnInprogressList.forEach(btn => {
    btn.addEventListener("click", () => {
      const taskId = btn.dataset.id;
      store.updateTaskStatus(taskId, "inprogress");
    });
  });

  btnDoneList.forEach(btn => {
    btn.addEventListener("click", () => {
      const taskId = btn.dataset.id;
      store.updateTaskStatus(taskId, "done");
    });
  });
}


/* =============================================================
   4. Global App Control Bindings & Bootstrap
   ============================================================= */

// A. Global Toggle View Click handlers
btnBoardDualView.addEventListener("click", () => {
  store.setView("board_dual");
});

btnBoardGradView.addEventListener("click", () => {
  store.setView("board_grad");
});

btnBoardProfView.addEventListener("click", () => {
  store.setView("board_prof");
});

btnCalendarView.addEventListener("click", () => {
  store.setView("calendar");
});

btnDashboardView.addEventListener("click", () => {
  store.setView("dashboard");
});

// B. Global Quick Add Task Button click (Focuses first column input of current active board view)
btnAddTask.addEventListener("click", () => {
  const currentView = store.getCurrentView();
  
  if (currentView === "calendar" || currentView === "dashboard") {
    // If not in a board view, default to Dual Board (professor pane)
    store.setView("board_dual");
    setTimeout(() => focusBoardAddInput("professor"), 50);
  } else if (currentView === "board_dual") {
    // Default to My Board (professor) inside dual view for convenience
    focusBoardAddInput("professor");
  } else {
    const activeOwner = currentView === "board_grad" ? "graduate" : "professor";
    focusBoardAddInput(activeOwner);
  }
});

function focusBoardAddInput(owner) {
  const container = document.querySelector(`.static-inline-add[data-status="todo"][data-owner="${owner}"]`);
  if (container) {
    const input = container.querySelector(".static-title-input");
    if (input) {
      input.focus();
      saveFocusState("board-add", `todo:${owner}`);
    }
  }
}

// B-2. Data Backup: Export current data to a downloadable JSON file
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

// C. App Initial Load Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  render(store.state);
});

if (document.readyState === "interactive" || document.readyState === "complete") {
  render(store.state);
}

/* -------------------------------------------------------------
 * Kanban Board Component Renderer (Dual-Board & Partitioned Columns)
 * Support Vercel Stark Light and Stark Dark Themes with Apple Reminders Style
 * 100% Pure Vanilla CSS Compliant (TailwindCSS dependency removed)
 * ------------------------------------------------------------- */
import { store } from "../store.js";

// Helper to check due date urgency
export function getDueStatus(dueDateStr) {
  if (!dueDateStr) return { class: "due-none", text: "기한 없음" };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { class: "due-overdue", text: `지연 D+${Math.abs(diffDays)}` };
  } else if (diffDays === 0) {
    return { class: "due-overdue", text: "오늘" };
  } else if (diffDays === 1) {
    return { class: "due-soon", text: "내일" };
  } else if (diffDays === 2) {
    return { class: "due-soon", text: "모레" };
  } else {
    const parts = dueDateStr.split("-");
    const formatted = parts.length === 3 ? `${parseInt(parts[1])}/${parseInt(parts[2])}` : dueDateStr;
    return { class: "due-normal", text: `${formatted} (D-${diffDays})` };
  }
}

/**
 * Renders a single Kanban Board partitioned by owner and styled by theme.
 * Highly compact, flat Apple Reminders (미리알림) layout replacing heavy cards.
 * @param {string} owner - 'graduate' or 'professor'
 * @param {string} theme - 'light' or 'dark'
 */
export function renderBoard(owner = "graduate", theme = "light") {
  const tasks = store.getTasks().filter(task => task.owner === owner);
  const isDark = theme === "dark";
  const colClassBase = isDark ? "board-column theme-dark" : "board-column";
  
  // Group tasks by status
  const columns = {
    todo: { 
      title: "To Do", 
      icon: "circle", 
      colorClass: isDark ? "col-todo-dark" : "col-todo", 
      iconColor: isDark ? "text-mute" : "text-mute",
      tasks: [] 
    },
    inprogress: { 
      title: "In Progress", 
      icon: "play", 
      colorClass: isDark ? "col-inprogress-dark" : "col-inprogress", 
      iconColor: "text-accent",
      tasks: [] 
    },
    done: { 
      title: "Done", 
      icon: "check-circle", 
      colorClass: isDark ? "col-done-dark" : "col-done", 
      iconColor: "text-violet",
      tasks: [] 
    }
  };
  
  tasks.forEach(task => {
    if (columns[task.status]) {
      columns[task.status].tasks.push(task);
    }
  });

  return `
    <div class="board-grid">
      ${Object.entries(columns).map(([status, col]) => {
        const colClass = `${colClassBase} ${col.colorClass}`;
        return `
          <div class="${colClass}" data-status="${status}" data-owner="${owner}">
            <!-- Column Header -->
            <div class="column-header">
              <h2 class="column-title">
                <i data-lucide="${col.icon}" class="w-3.5 h-3.5 ${col.iconColor}"></i>
                <span>${col.title}</span>
                <span class="column-badge">${col.tasks.length}</span>
              </h2>
            </div>
            
            <!-- Cards Drop Area (Now an Apple Reminders slim list) -->
            <div class="column-cards-area" data-status="${status}" data-owner="${owner}">
              ${col.tasks.length === 0 ? `
                <div class="empty-state">
                  <span>비어 있음</span>
                </div>
              ` : col.tasks.map(task => {
                const dueInfo = getDueStatus(task.dueDate);
                const isDone = task.status === "done";
                const isInProgress = task.status === "inprogress";
                
                const cardClass = isDark ? `task-card card-reminder card-dark` : `task-card card-reminder`;
                const titleClass = isDone ? 'task-card-title inline-edit-title line-through' : 'task-card-title inline-edit-title';
                
                let dueClass = isDone ? 'text-mute' : dueInfo.class;
                if (isDark && !isDone && dueInfo.class !== "due-none") {
                  dueClass = `${dueInfo.class}-dark`;
                }

                // Determine Checkbox Icon & Color for Reminders Style
                let checkIcon = "circle";
                let checkColor = isDark ? "text-mute" : "text-mute";
                if (isDone) {
                  checkIcon = "check-circle-2";
                  checkColor = "text-violet";
                } else if (isInProgress) {
                  checkIcon = "play-circle";
                  checkColor = "text-accent";
                }

                const escapedTitle = escapeHTML(task.title);

                return `
                  <div class="${cardClass}" draggable="true" data-id="${task.id}" data-owner="${owner}">
                    <!-- Left Slot: Reminders Radio Circle + Dynamic Title -->
                    <div class="reminder-left-slot">
                      <button class="reminder-check-btn" data-id="${task.id}" data-status="${task.status}" title="상태 토글">
                        <i data-lucide="${checkIcon}" class="w-4 h-4 ${checkColor}"></i>
                      </button>
                      
                      <!-- Double Click to Edit Title Inline & Hover to show full title -->
                      <div class="${titleClass}" data-id="${task.id}" title="${escapedTitle} (더블 클릭하여 수정)">
                        ${escapedTitle}
                      </div>
                    </div>
                    
                    <!-- Right Slot: Due Date Badge & Delete Action -->
                    <div class="reminder-right-slot">
                      <!-- Click to Edit Due Date Inline -->
                      <div class="task-card-due ${dueClass}" data-id="${task.id}" title="클릭하여 마감일 수정">
                        <i data-lucide="calendar" class="w-2.5 h-2.5"></i>
                        <span class="due-text">${dueInfo.text}</span>
                      </div>
                      
                      <button class="card-action-btn delete-task-btn" data-id="${task.id}" title="할 일 삭제" aria-label="할 일 삭제">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
            
            <!-- Static Zero-Click Inline Addition Input at Column Bottom -->
            <div class="static-inline-add mt-2" data-status="${status}" data-owner="${owner}">
              <input 
                type="text" 
                class="static-title-input form-input" 
                placeholder="+ 미리알림 입력..." 
                autocomplete="off"
              />
            </div>
            
          </div>
        `;
      }).join("")}
    </div>
  `;
}

/**
 * Renders the High-Contrast premium Side-by-Side Dual Kanban Board.
 * Perfect layout synchronization for lab professors.
 */
export function renderDualBoard() {
  return `
    <div class="dual-board-container">
      <!-- Left Pane: Graduate Lab Board (Light Stark) -->
      <div class="dual-board-pane">
        <div class="dual-board-pane-header">
          <div class="flex items-center space-x-2">
            <span class="text-lg">🎓</span>
            <span class="pane-title">대학원생 연구 미리알림</span>
            <span class="pane-subtitle">Graduate Lab (Stark Light)</span>
          </div>
        </div>
        <div class="pane-content">
          ${renderBoard("graduate", "light")}
        </div>
      </div>
      
      <!-- Right Pane: Professor Personal Board (Dark Stark) -->
      <div class="dual-board-pane pane-dark">
        <div class="dual-board-pane-header">
          <div class="flex items-center space-x-2">
            <span class="text-lg">👑</span>
            <span class="pane-title">내 전용 미리알림</span>
            <span class="pane-subtitle">Professor Personal (Stark Dark)</span>
          </div>
        </div>
        <div class="pane-content">
          ${renderBoard("professor", "dark")}
        </div>
      </div>
    </div>
  `;
}

// Simple HTML escaping helper to prevent XSS
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* -------------------------------------------------------------
 * Kanban Board Component Renderer (Category-Tab Based)
 * 상단 카테고리 탭(전체/일상/개발/+추가)으로 할 일을 분류해서 본다.
 * ------------------------------------------------------------- */
import { store, ALL_TAB } from "../store.js";

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
 * 상단 카테고리 탭 바 렌더.
 * '전체' 탭 + 사용자 정의 탭들 + '탭 추가' 버튼.
 */
function renderCategoryTabs() {
  const categories = store.getCategories();
  const activeCat = store.getActiveCategory();

  const allActive = activeCat === ALL_TAB ? "active" : "";

  return `
    <div class="category-tabs" role="tablist">
      <button class="cat-tab ${allActive}" data-cat="${ALL_TAB}" role="tab">
        전체
      </button>
      ${categories.map(c => {
        const isActive = activeCat === c ? "active" : "";
        const safe = escapeHTML(c);
        return `
          <span class="cat-tab-wrap ${isActive}">
            <button class="cat-tab cat-tab-named ${isActive}" data-cat="${safe}" role="tab" title="더블클릭하면 이름을 바꿀 수 있어요">
              ${safe}
            </button>
            <button class="cat-tab-delete" data-cat="${safe}" title="'${safe}' 탭 삭제" aria-label="탭 삭제">
              <i data-lucide="x" class="w-3 h-3"></i>
            </button>
          </span>
        `;
      }).join("")}
      <button class="cat-tab-add" id="cat-tab-add-btn" title="새 탭 추가">
        <i data-lucide="plus" class="w-3 h-3"></i>
        <span>탭 추가</span>
      </button>
    </div>
  `;
}

/**
 * 단일 칸반 보드 렌더 (현재 활성 탭의 할 일만 표시).
 * '전체' 탭일 때는 각 카드에 카테고리 배지를 함께 보여준다.
 */
export function renderBoard() {
  const tasks = store.getVisibleTasks();
  const showCategoryBadge = store.getActiveCategory() === ALL_TAB;

  const columns = {
    todo: { title: "To Do", icon: "circle", colorClass: "col-todo", iconColor: "text-mute", tasks: [] },
    inprogress: { title: "In Progress", icon: "play", colorClass: "col-inprogress", iconColor: "text-accent", tasks: [] },
    done: { title: "Done", icon: "check-circle", colorClass: "col-done", iconColor: "text-violet", tasks: [] }
  };

  tasks.forEach(task => {
    if (columns[task.status]) {
      columns[task.status].tasks.push(task);
    }
  });

  return `
    ${renderCategoryTabs()}
    <div class="board-grid">
      ${Object.entries(columns).map(([status, col]) => {
        const colClass = `board-column ${col.colorClass}`;
        return `
          <div class="${colClass}" data-status="${status}">
            <!-- Column Header -->
            <div class="column-header">
              <h2 class="column-title">
                <i data-lucide="${col.icon}" class="w-3.5 h-3.5 ${col.iconColor}"></i>
                <span>${col.title}</span>
                <span class="column-badge">${col.tasks.length}</span>
              </h2>
            </div>

            <!-- Cards Drop Area (Apple Reminders slim list) -->
            <div class="column-cards-area" data-status="${status}">
              ${col.tasks.length === 0 ? `
                <div class="empty-state">
                  <span>비어 있음</span>
                </div>
              ` : col.tasks.map(task => {
                const dueInfo = getDueStatus(task.dueDate);
                const isDone = task.status === "done";
                const isInProgress = task.status === "inprogress";

                const cardClass = `task-card card-reminder`;
                const titleClass = isDone ? 'task-card-title inline-edit-title line-through' : 'task-card-title inline-edit-title';
                const dueClass = isDone ? 'text-mute' : dueInfo.class;

                let checkIcon = "circle";
                let checkColor = "text-mute";
                if (isDone) {
                  checkIcon = "check-circle-2";
                  checkColor = "text-violet";
                } else if (isInProgress) {
                  checkIcon = "play-circle";
                  checkColor = "text-accent";
                }

                const escapedTitle = escapeHTML(task.title);
                const categoryBadge = showCategoryBadge && task.category
                  ? `<span class="card-category-badge">${escapeHTML(task.category)}</span>`
                  : "";

                return `
                  <div class="${cardClass}" draggable="true" data-id="${task.id}">
                    <!-- Left Slot: Check Circle + Title -->
                    <div class="reminder-left-slot">
                      <button class="reminder-check-btn" data-id="${task.id}" data-status="${task.status}" title="상태 토글">
                        <i data-lucide="${checkIcon}" class="w-4 h-4 ${checkColor}"></i>
                      </button>

                      <div class="${titleClass}" data-id="${task.id}" title="${escapedTitle} (더블 클릭하여 수정)">
                        ${escapedTitle}
                        ${categoryBadge}
                      </div>
                    </div>

                    <!-- Right Slot: Due Date Badge & Delete Action -->
                    <div class="reminder-right-slot">
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

            <!-- Static Zero-Click Inline Addition Input -->
            <div class="static-inline-add mt-2" data-status="${status}">
              <input
                type="text"
                class="static-title-input form-input"
                placeholder="+ 할 일 입력 (예: 동물병원 6/17)"
                autocomplete="off"
              />
            </div>

          </div>
        `;
      }).join("")}
    </div>
  `;
}

// Simple HTML escaping helper to prevent XSS
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* -------------------------------------------------------------
 * Board Component (Category-Tab Checklist)
 * 진행 단계(칸반 3컬럼) 없이, 탭별 단순 할 일 체크리스트.
 * 미완료는 위, 완료는 아래에 흐리게. 카드는 다른 탭으로 이동 가능.
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
 * 상단 카테고리 탭 바. '전체' + 사용자 탭들 + '탭 추가'.
 * 각 탭은 카드 드롭 대상(드래그로 카드를 떨어뜨리면 그 탭으로 이동).
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
          <span class="cat-tab-wrap ${isActive}" data-cat="${safe}">
            <button class="cat-tab cat-tab-named ${isActive}" data-cat="${safe}" role="tab" title="더블클릭하면 이름 변경 · 카드를 끌어다 놓으면 이 탭으로 이동">
              ${safe}
            </button>
            <button class="cat-tab-delete" data-cat="${safe}" title="'${safe}' 탭 삭제" aria-label="탭 삭제">
              <i data-lucide="x" class="w-2 h-2"></i>
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

function renderCard(task, showCategoryBadge) {
  const isDone = task.status === "done";
  const dueInfo = getDueStatus(task.dueDate);
  const titleClass = isDone ? 'task-card-title inline-edit-title line-through' : 'task-card-title inline-edit-title';
  const dueClass = isDone ? 'text-mute' : dueInfo.class;
  const checkIcon = isDone ? "check-circle-2" : "circle";
  const checkColor = isDone ? "text-violet" : "text-mute";

  const escapedTitle = escapeHTML(task.title);
  const categoryBadge = showCategoryBadge && task.category
    ? `<span class="card-category-badge">${escapeHTML(task.category)}</span>`
    : "";

  return `
    <div class="task-card card-reminder ${isDone ? 'is-done' : ''}" draggable="true" data-id="${task.id}">
      <div class="reminder-left-slot">
        <button class="reminder-check-btn" data-id="${task.id}" data-status="${task.status}" title="완료 토글">
          <i data-lucide="${checkIcon}" class="w-4 h-4 ${checkColor}"></i>
        </button>
        <div class="${titleClass}" data-id="${task.id}" title="${escapedTitle} (더블 클릭하여 수정)">
          ${escapedTitle}
          ${categoryBadge}
        </div>
      </div>

      <div class="reminder-right-slot">
        <button class="card-move-btn" data-id="${task.id}" title="다른 탭으로 옮기기" aria-label="다른 탭으로 옮기기">
          <i data-lucide="folder-input" class="w-3.5 h-3.5"></i>
        </button>
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
}

/**
 * 현재 활성 탭의 할 일을 단일 리스트로 렌더.
 * 미완료(위) → 완료(아래, 흐리게).
 */
export function renderBoard() {
  const tasks = store.getVisibleTasks();
  const showCategoryBadge = store.getActiveCategory() === ALL_TAB;

  const active = tasks.filter(t => t.status !== "done");
  const doneTasks = tasks.filter(t => t.status === "done");

  const emptyState = (active.length === 0 && doneTasks.length === 0)
    ? `<div class="empty-state list-empty"><span>이 탭에 할 일이 없어요. 아래에 입력해서 추가하세요.</span></div>`
    : "";

  return `
    ${renderCategoryTabs()}
    <div class="todo-list-wrap">
      <div class="todo-list">
        ${emptyState}
        ${active.map(t => renderCard(t, showCategoryBadge)).join("")}
        ${doneTasks.length ? `<div class="done-divider"><span>완료됨 ${doneTasks.length}</span></div>` : ""}
        ${doneTasks.map(t => renderCard(t, showCategoryBadge)).join("")}
      </div>

      <div class="static-inline-add" data-status="todo">
        <input
          type="text"
          class="static-title-input form-input"
          placeholder="+ 할 일 입력 (예: 동물병원 6/17)"
          autocomplete="off"
        />
      </div>
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

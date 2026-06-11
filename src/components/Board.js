/* -------------------------------------------------------------
 * Board Component (Category-Tab Checklist)
 * 진행 단계(칸반 3컬럼) 없이, 탭별 단순 할 일 체크리스트.
 * 미완료는 위, 완료는 아래에 흐리게. 카드는 다른 탭으로 이동 가능.
 * ------------------------------------------------------------- */
import { store, ALL_TAB } from "../store.js";

// 탭(카테고리)별 구분 색 — 추가된 순서대로 순환
const TAB_COLORS = ['#0070f3', '#7928ca', '#10b981', '#f5a623', '#e91e63', '#06b6d4', '#d946ef', '#ef4444'];
export function getCategoryColor(cat) {
  const idx = store.getCategories().indexOf(cat);
  return idx < 0 ? '#9aa0a6' : TAB_COLORS[idx % TAB_COLORS.length];
}

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
  const isEditingTabs = store.isCategoryEditMode();
  const allActive = activeCat === ALL_TAB ? "active" : "";
  const editClass = isEditingTabs ? "is-editing" : "";
  const editIcon = isEditingTabs ? "check" : "pencil";
  const editLabel = isEditingTabs ? "탭 편집 완료" : "탭 편집";

  return `
    <div class="category-tabs ${editClass}" role="tablist">
      <button class="cat-tab ${allActive}" data-cat="${ALL_TAB}" role="tab">
        전체 <span class="cat-tab-num">1</span>
      </button>
      ${categories.map((c, i) => {
        const isActiveBool = activeCat === c;
        const isActive = isActiveBool ? "active" : "";
        const safe = escapeHTML(c);
        const num = i + 2;
        const color = getCategoryColor(c);
        const numHtml = num <= 9 ? ` <span class="cat-tab-num">${num}</span>` : "";
        const tabStyle = isActiveBool
          ? `background:${color};color:#fff;border-color:${color};`
          : `background:${color}1a;color:${color};border-color:${color}40;`;
        return `
          <span class="cat-tab-wrap ${isActive} ${editClass}" data-cat="${safe}">
            <button class="cat-tab cat-tab-named ${isActive}" data-cat="${safe}" role="tab" style="${tabStyle}" title="${isEditingTabs ? '더블클릭하면 이름 변경 · 카드를 끌어다 놓으면 이 탭으로 이동' : '카드를 끌어다 놓으면 이 탭으로 이동'}">
              ${safe}${numHtml}
            </button>
            ${isEditingTabs ? `<button class="cat-tab-delete" data-cat="${safe}" title="'${safe}' 탭 삭제" aria-label="탭 삭제">
              <i data-lucide="x" class="w-2 h-2"></i>
            </button>` : ""}
          </span>
        `;
      }).join("")}
      ${isEditingTabs ? `<button class="cat-tab-add" id="cat-tab-add-btn" title="새 탭 추가">
        <i data-lucide="plus" class="w-3 h-3"></i>
        <span>탭 추가</span>
      </button>` : ""}
      <button class="cat-tab-edit-toggle ${isEditingTabs ? 'active' : ''}" id="cat-tab-edit-toggle" aria-pressed="${isEditingTabs}" title="${editLabel}" aria-label="${editLabel}">
        <i data-lucide="${editIcon}" class="w-3 h-3"></i>
        <span>${isEditingTabs ? "완료" : "편집"}</span>
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
  const catColor = task.category ? getCategoryColor(task.category) : "";
  const categoryBadge = showCategoryBadge && task.category
    ? `<span class="card-category-badge" style="background:${catColor}1a;color:${catColor};border-color:${catColor}66">${escapeHTML(task.category)}</span>`
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
        <span class="card-drag-handle" data-id="${task.id}" title="이 줄을 끌어서 다른 탭으로 이동 (어디를 잡아도 돼요)" aria-hidden="true">
          <i data-lucide="grip-vertical" class="w-3.5 h-3.5"></i>
        </span>
        <button class="card-move-btn" data-id="${task.id}" title="다른 탭으로 옮기기 (목록에서 선택)" aria-label="다른 탭으로 옮기기">
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
  const hideCompleted = store.isCompletedHidden();

  const active = tasks.filter(t => t.status !== "done");
  const doneTasks = tasks.filter(t => t.status === "done");
  const doneDivider = doneTasks.length
    ? `<div class="done-divider ${hideCompleted ? 'is-collapsed' : ''}">
        <span class="done-count">완료됨 ${doneTasks.length}</span>
        <span class="done-divider-line" aria-hidden="true"></span>
        <button class="done-toggle-btn" id="done-toggle-btn" aria-pressed="${hideCompleted}" title="${hideCompleted ? '완료됨 보기' : '완료됨 숨기기'}" aria-label="${hideCompleted ? '완료됨 보기' : '완료됨 숨기기'}">
          <i data-lucide="${hideCompleted ? 'eye' : 'eye-off'}" class="w-3 h-3"></i>
          <span>${hideCompleted ? '보기' : '숨기기'}</span>
        </button>
      </div>`
    : "";

  const emptyState = (active.length === 0 && doneTasks.length === 0)
    ? `<div class="empty-state list-empty"><span>이 탭에 할 일이 없어요. 아래에 입력해서 추가하세요.</span></div>`
    : "";

  return `
    ${renderCategoryTabs()}
    <div class="todo-list-wrap">
      <div class="todo-list">
        ${emptyState}
        ${active.map(t => renderCard(t, showCategoryBadge)).join("")}
        ${doneDivider}
        ${hideCompleted ? "" : doneTasks.map(t => renderCard(t, showCategoryBadge)).join("")}
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

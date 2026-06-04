/* -------------------------------------------------------------
 * Dashboard View — Category-based briefing stats
 * 전체 현황 + 탭(카테고리)별 진행률 + 긴급 과제 + 메모
 * ------------------------------------------------------------- */
import { store } from "../store.js";
import { getDueStatus } from "./Board.js";

export function renderDashboard() {
  const tasks = store.getTasks();
  const categories = store.getCategories();
  const memoText = store.getMemo();

  // 1. 전체 통계
  const total = tasks.length;
  const done = tasks.filter(t => t.status === "done").length;
  const inprogress = tasks.filter(t => t.status === "inprogress").length;
  const doneRate = total > 0 ? Math.round((done / total) * 100) : 0;

  // 2. 긴급 / 지연 과제 (오늘 포함 이전, 미완료)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isUrgent = (task) => {
    if (task.status === "done") return false;
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due <= today;
  };

  const urgentTasks = tasks
    .filter(isUrgent)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // 3. 카테고리(탭)별 진행 현황
  const catStats = categories.map(cat => {
    const list = tasks.filter(t => t.category === cat);
    const cTotal = list.length;
    const cDone = list.filter(t => t.status === "done").length;
    const cInprog = list.filter(t => t.status === "inprogress").length;
    const cRate = cTotal > 0 ? Math.round((cDone / cTotal) * 100) : 0;
    return { cat, total: cTotal, done: cDone, inprogress: cInprog, rate: cRate };
  });

  return `
    <div class="dashboard-view flex flex-col gap-8">

      <!-- Top Row: Overall Summary Cards -->
      <div class="dashboard-stats-grid">

        <!-- 전체 완료율 -->
        <div class="dash-card border-top-accent bg-canvas p-5 rounded-lg border border-border flex flex-col gap-3">
          <div class="flex items-center justify-between text-xs text-mute font-mono uppercase tracking-wider">
            <span>📊 전체 진행 현황</span>
            <i data-lucide="layout-dashboard" class="w-4 h-4 text-accent"></i>
          </div>
          <div class="flex justify-between items-baseline mt-1">
            <div class="text-2xl font-semibold text-ink">${doneRate}% <span class="text-xs text-mute font-normal">완료율</span></div>
            <div class="text-xs text-mute font-mono">진행 ${inprogress} 건 / 전체 ${total} 건</div>
          </div>
          <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border mt-1">
            <div class="h-full transition-all duration-500" style="width: ${doneRate}%; background: var(--color-accent); border-radius: 9999px;"></div>
          </div>
          <p class="text-[10px] text-mute">모든 탭을 합친 전체 할 일의 완료 진척도입니다.</p>
        </div>

        <!-- 긴급 조치 과제 -->
        <div class="dash-card border-top-todo bg-canvas p-5 rounded-lg border border-border flex flex-col gap-3">
          <div class="flex items-center justify-between text-xs text-mute font-mono uppercase tracking-wider">
            <span>🔥 긴급 조치 과제</span>
            <i data-lucide="alert-triangle" class="w-4 h-4 text-error" style="color:var(--color-error)"></i>
          </div>
          <div class="flex justify-between items-baseline mt-1">
            <div class="text-2xl font-semibold text-ink" style="color:var(--color-error)">${urgentTasks.length} <span class="text-xs text-mute font-normal">건</span></div>
            <div class="text-xs text-mute font-mono">오늘까지 / 지연됨</div>
          </div>
          <p class="text-[10px] text-mute">마감이 오늘이거나 이미 지난 미완료 할 일입니다. 아래 목록에서 바로 처리하세요.</p>
        </div>

        <!-- 탭 개수 요약 -->
        <div class="dash-card border-top-violet bg-canvas p-5 rounded-lg border border-border flex flex-col gap-3">
          <div class="flex items-center justify-between text-xs text-mute font-mono uppercase tracking-wider">
            <span>🗂️ 탭 구성</span>
            <i data-lucide="folder" class="w-4 h-4 text-violet" style="color:#7928ca;"></i>
          </div>
          <div class="flex justify-between items-baseline mt-1">
            <div class="text-2xl font-semibold text-ink">${categories.length} <span class="text-xs text-mute font-normal">개 탭</span></div>
          </div>
          <div class="flex flex-wrap gap-1.5 mt-1">
            ${categories.map(c => `<span class="card-category-badge dash-cat-link" data-cat="${escapeHTML(c)}" style="cursor:pointer;">${escapeHTML(c)}</span>`).join("")}
          </div>
        </div>

      </div>

      <!-- Category Progress Section -->
      <div class="dash-card bg-canvas p-5 rounded-lg border border-border flex flex-col gap-4">
        <h3 class="text-xs font-semibold tracking-wider text-ink flex items-center gap-1.5 uppercase font-mono">
          <i data-lucide="bar-chart-3" class="w-4 h-4 text-ink"></i>
          <span>탭별 진행률</span>
        </h3>
        <div class="cat-progress-grid">
          ${catStats.map(s => `
            <div class="cat-progress-item dash-cat-link" data-cat="${escapeHTML(s.cat)}" title="'${escapeHTML(s.cat)}' 탭으로 이동" style="cursor:pointer;">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-medium text-ink">${escapeHTML(s.cat)}</span>
                <span class="text-[10px] font-mono text-mute">${s.rate}% · ${s.done}/${s.total}</span>
              </div>
              <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border">
                <div class="h-full transition-all duration-500" style="width: ${s.rate}%; background: #7928ca; border-radius: 9999px;"></div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Bottom Layout Grid: Urgent Tasks (Left) & Memo (Right) -->
      <div class="dashboard-details-grid">

        <!-- Left: 긴급 과제 통합 리스트 -->
        <div class="dash-column flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-semibold tracking-wider text-ink flex items-center gap-1.5 uppercase font-mono">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-error" style="color:var(--color-error)"></i>
              <span>🔥 긴급 / 지연 과제</span>
            </h4>
            <span class="column-badge" style="background:var(--color-error-soft); color:var(--color-error); border-color:var(--color-error-soft); font-weight:600;">
              ${urgentTasks.length}
            </span>
          </div>

          <div class="urgent-list flex flex-col gap-2">
            ${urgentTasks.length === 0 ? `
              <div class="empty-state border border-dashed border-border py-6 text-center text-xs text-mute rounded-lg" style="background: var(--color-canvas-soft); font-size:11px;">
                ✨ 오늘 지연되거나 조치가 필요한 긴급 할 일이 없습니다.
              </div>
            ` : urgentTasks.map(task => {
              const dueInfo = getDueStatus(task.dueDate);
              const catChip = task.category
                ? `<span class="card-category-badge dash-cat-link" data-cat="${escapeHTML(task.category)}" style="cursor:pointer;">${escapeHTML(task.category)}</span>`
                : "";
              return `
                <div class="urgent-item bg-canvas border border-border rounded-md p-3 flex items-center justify-between transition-all hover:border-border-strong" style="border-left: 3px solid var(--color-error);">
                  <div class="flex flex-col gap-1 pr-3 flex-1">
                    <div class="text-[11px] font-medium text-ink line-clamp-1">${escapeHTML(task.title)} ${catChip}</div>
                    <div class="text-[9px] font-mono text-error font-semibold" style="color:var(--color-error)">${dueInfo.text}</div>
                  </div>
                  <div class="flex items-center gap-1">
                    <button class="btn-quick-inprogress btn-secondary px-2 py-0.5 text-[9px] rounded" data-id="${task.id}">진행</button>
                    <button class="btn-quick-done btn-primary px-2 py-0.5 text-[9px] rounded" data-id="${task.id}">완료</button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Right: Memo Notepad -->
        <div class="dash-column flex flex-col gap-4">
          <h3 class="text-sm font-semibold tracking-tight text-ink flex items-center gap-1.5 uppercase font-mono">
            <i data-lucide="edit-3" class="w-4 h-4 text-ink"></i>
            <span>메모 (Notepad)</span>
          </h3>

          <div class="notepad-container border border-border rounded-lg bg-canvas-soft overflow-hidden p-4 flex flex-col gap-2">
            <textarea
              id="dashboard-notepad"
              class="w-full bg-transparent text-xs text-ink font-sans outline-none resize-none border-none leading-relaxed"
              placeholder="오늘의 다짐이나 회의 메모, 주간 브리핑 내용을 자유롭게 기록하세요. 타이핑 즉시 자동 저장됩니다..."
              style="min-height: 250px;"
            >${escapeHTML(memoText)}</textarea>
            <div class="flex items-center justify-end text-[10px] text-mute font-mono pt-2 border-t border-border">
              <i data-lucide="cloud-lightning" class="w-3 h-3 mr-1 text-accent"></i>
              <span>Typing auto-saves in local storage</span>
            </div>
          </div>
        </div>

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

/* -------------------------------------------------------------
 * Premium Vercel-Style Dual-Notion Dashboard View Component Renderer
 * Supports 'professor' and 'graduate' side-by-side briefing stats
 * ------------------------------------------------------------- */
import { store } from "../store.js";
import { getDueStatus } from "./Board.js";

export function renderDashboard() {
  const tasks = store.getTasks();
  const memoText = store.getMemo();

  // 1. Statistics Calculations (Partitioned by owner)
  const myTasks = tasks.filter(t => t.owner === "professor");
  const gradTasks = tasks.filter(t => t.owner === "graduate");

  // My Stats
  const myTotal = myTasks.length;
  const myDone = myTasks.filter(t => t.status === "done").length;
  const myInprogress = myTasks.filter(t => t.status === "inprogress").length;
  const myDoneRate = myTotal > 0 ? Math.round((myDone / myTotal) * 100) : 0;

  // Graduate Stats
  const gradTotal = gradTasks.length;
  const gradDone = gradTasks.filter(t => t.status === "done").length;
  const gradInprogress = gradTasks.filter(t => t.status === "inprogress").length;
  const gradDoneRate = gradTotal > 0 ? Math.round((gradDone / gradTotal) * 100) : 0;

  // 2. Urgent / Overdue Tasks partitioning
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getUrgentTasks = (taskList) => {
    return taskList.filter(task => {
      if (task.status === "done") return false;
      if (!task.dueDate) return false;
      
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      return due <= today;
    });
  };

  const myUrgentTasks = getUrgentTasks(myTasks);
  const gradUrgentTasks = getUrgentTasks(gradTasks);

  return `
    <div class="dashboard-view flex flex-col gap-8">
      
      <!-- Top Row: Dual Statistics Summary Cards (Side by Side Grid) -->
      <div class="dashboard-stats-grid">
        
        <!-- Professor Dashboard Card -->
        <div class="dash-card border-top-accent bg-canvas p-5 rounded-lg border border-border flex flex-col gap-3">
          <div class="flex items-center justify-between text-xs text-mute font-mono uppercase tracking-wider">
            <span>👑 내 연구 현황 (My Research Stats)</span>
            <i data-lucide="crown" class="w-4 h-4 text-accent"></i>
          </div>
          <div class="flex justify-between items-baseline mt-1">
            <div class="text-2xl font-semibold text-ink">${myDoneRate}% <span class="text-xs text-mute font-normal">완료율</span></div>
            <div class="text-xs text-mute font-mono">진행 ${myInprogress} 건 / 전체 ${myTotal} 건</div>
          </div>
          <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border mt-1">
            <div class="h-full bg-accent transition-all duration-500" style="width: ${myDoneRate}%; background: var(--color-accent); border-radius: 9999px;"></div>
          </div>
          <p class="text-[10px] text-mute">지도교수님 개인의 핵심 과제 및 대외 보고/특허 결재 진척도입니다.</p>
        </div>

        <!-- Graduate Dashboard Card -->
        <div class="dash-card border-top-violet bg-canvas p-5 rounded-lg border border-border flex flex-col gap-3">
          <div class="flex items-center justify-between text-xs text-mute font-mono uppercase tracking-wider">
            <span>🎓 연구실원 현황 (Graduate Lab Stats)</span>
            <i data-lucide="graduation-cap" class="w-4 h-4 text-violet" style="color:#7928ca;"></i>
          </div>
          <div class="flex justify-between items-baseline mt-1">
            <div class="text-2xl font-semibold text-ink">${gradDoneRate}% <span class="text-xs text-mute font-normal">완료율</span></div>
            <div class="text-xs text-mute font-mono">진행 ${gradInprogress} 건 / 전체 ${gradTotal} 건</div>
          </div>
          <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border mt-1">
            <div class="h-full bg-violet transition-all duration-500" style="width: ${gradDoneRate}%; background: #7928ca; border-radius: 9999px;"></div>
          </div>
          <p class="text-[10px] text-mute">소속 대학원생들의 연구 개발, 조교 업무, 논문 수정의 평균 진행률입니다.</p>
        </div>

        <!-- Integrated Summary Notepad Card (Quick info) -->
        <div class="dash-card border-top-todo bg-canvas p-5 rounded-lg border border-border flex flex-col gap-2.5">
          <div class="flex items-center justify-between text-xs text-mute font-mono uppercase tracking-wider">
            <span>📊 통합 연구실 브리핑 (Integrated Briefing)</span>
            <i data-lucide="info" class="w-3.5 h-3.5 text-mute"></i>
          </div>
          <div class="text-xs text-ink leading-relaxed flex flex-col gap-1.5 mt-1">
            <div class="flex justify-between"><span>전체 등록 태스크:</span> <strong class="font-mono">${tasks.length} 건</strong></div>
            <div class="flex justify-between text-error" style="color:var(--color-error)"><span>내 긴급 조치 과제:</span> <strong class="font-mono">${myUrgentTasks.length} 건</strong></div>
            <div class="flex justify-between text-warning" style="color:var(--color-warning)"><span>원생 지연 조치 과제:</span> <strong class="font-mono">${gradUrgentTasks.length} 건</strong></div>
          </div>
        </div>

      </div>

      <!-- Bottom Layout Grid: Partitioned Urgent Tasks (Left) & Memo Notepad (Right) -->
      <div class="dashboard-details-grid">
        
        <!-- Left Column: Dual Urgent Action Lists (Professor's & Graduates' separately) -->
        <div class="dash-column flex flex-col gap-6">
          
          <!-- SECTION 1: Professor's Urgent Items -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-semibold tracking-wider text-ink flex items-center gap-1.5 uppercase font-mono">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-accent"></i>
                <span>👑 내 긴급 조치 과제 (My Urgent Tasks)</span>
              </h4>
              <span class="column-badge" style="background:var(--color-accent-soft); color:var(--color-accent); border-color:var(--color-accent-soft); font-weight:600;">
                ${myUrgentTasks.length}
              </span>
            </div>

            <div class="urgent-list flex flex-col gap-2">
              ${myUrgentTasks.length === 0 ? `
                <div class="empty-state border border-dashed border-border py-6 text-center text-xs text-mute rounded-lg" style="background: var(--color-canvas-soft); font-size:11px;">
                  ✨ 오늘 지연되거나 조치가 필요한 내 긴급 업무가 없습니다.
                </div>
              ` : myUrgentTasks.map(task => {
                const dueInfo = getDueStatus(task.dueDate);
                return `
                  <div class="urgent-item bg-canvas border border-border rounded-md p-3 flex items-center justify-between transition-all hover:border-border-strong" style="border-left: 3px solid var(--color-accent);">
                    <div class="flex flex-col gap-1 pr-3 flex-1">
                      <div class="text-[11px] font-medium text-ink line-clamp-1">${escapeHTML(task.title)}</div>
                      <div class="text-[9px] font-mono text-accent font-semibold">${dueInfo.text}</div>
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

          <!-- SECTION 2: Graduates' Urgent Items -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-semibold tracking-wider text-ink flex items-center gap-1.5 uppercase font-mono">
                <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-error" style="color:var(--color-error)"></i>
                <span>🎓 원생 지연 과제 (Graduate Urgent Items)</span>
              </h4>
              <span class="column-badge" style="background:var(--color-error-soft); color:var(--color-error); border-color:var(--color-error-soft); font-weight:600;">
                ${gradUrgentTasks.length}
              </span>
            </div>

            <div class="urgent-list flex flex-col gap-2">
              ${gradUrgentTasks.length === 0 ? `
                <div class="empty-state border border-dashed border-border py-6 text-center text-xs text-mute rounded-lg" style="background: var(--color-canvas-soft); font-size:11px;">
                  ✨ 지연되거나 마감이 밀린 대학원생들의 업무가 없습니다.
                </div>
              ` : gradUrgentTasks.map(task => {
                const dueInfo = getDueStatus(task.dueDate);
                return `
                  <div class="urgent-item bg-canvas border border-border rounded-md p-3 flex items-center justify-between transition-all hover:border-border-strong" style="border-left: 3px solid var(--color-error);">
                    <div class="flex flex-col gap-1 pr-3 flex-1">
                      <div class="text-[11px] font-medium text-ink line-clamp-1">${escapeHTML(task.title)}</div>
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

        </div>

        <!-- Right Column: Premium Research Notepad (Briefing Memo) -->
        <div class="dash-column flex flex-col gap-4">
          <h3 class="text-sm font-semibold tracking-tight text-ink flex items-center gap-1.5 uppercase font-mono">
            <i data-lucide="edit-3" class="w-4 h-4 text-ink"></i>
            <span>오늘의 다짐 & 주간 브리핑 메모 (Notepad)</span>
          </h3>

          <div class="notepad-container border border-border rounded-lg bg-canvas-soft overflow-hidden p-4 flex flex-col gap-2">
            <textarea 
              id="dashboard-notepad" 
              class="w-full bg-transparent text-xs text-ink font-sans outline-none resize-none border-none leading-relaxed" 
              placeholder="오늘 연구할 일의 다짐이나 회의 메모, 주간 브리핑 내용을 여기에 자유롭게 기록하세요. 타이핑 즉시 자동 저장됩니다..." 
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
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

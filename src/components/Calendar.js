/* -------------------------------------------------------------
 * Monthly Calendar View Component Renderer (Owner-Aware Dual Badges)
 * ------------------------------------------------------------- */
import { store } from "../store.js";

export function renderCalendar() {
  const currentMonthDate = store.getCurrentMonth();
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const tasks = store.getTasks();

  // Get first day of the month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Get total days in current month
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Get total days in previous month (for padding)
  const prevTotalDays = new Date(year, month, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysArray = [];

  // 1. Populate previous month's trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevTotalDays - i);
    daysArray.push({
      date: d,
      isCurrentMonth: false,
      dayNumber: prevTotalDays - i
    });
  }

  // 2. Populate current month's days
  for (let i = 1; i <= totalDays; i++) {
    const d = new Date(year, month, i);
    const isToday = d.toDateString() === today.toDateString();
    daysArray.push({
      date: d,
      isCurrentMonth: true,
      isToday,
      dayNumber: i
    });
  }

  // 3. Populate next month's leading days to fill 42 cells (6 weeks * 7 days)
  const totalCells = 42;
  const remainingCells = totalCells - daysArray.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    daysArray.push({
      date: d,
      isCurrentMonth: false,
      dayNumber: i
    });
  }

  // Month and Year display text
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];
  const headerTitle = `${year}년 ${monthNames[month]}`;

  return `
    <div class="calendar-view">
      <!-- Calendar Navigation Header -->
      <div class="calendar-header">
        <h2 class="calendar-month-title">${headerTitle}</h2>
        <div class="flex items-center space-x-3">
          <button id="calendar-prev-btn" class="calendar-nav-btn" aria-label="이전 달">
            <i data-lucide="chevron-left" class="w-4 h-4"></i>
          </button>
          <button id="calendar-today-btn" class="calendar-nav-btn text-[11px] font-mono font-medium px-2 py-1" aria-label="오늘로 이동">
            오늘
          </button>
          <button id="calendar-next-btn" class="calendar-nav-btn" aria-label="다음 달">
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Weekday Headers -->
      <div class="calendar-weekdays">
        <div class="weekday-label">일</div>
        <div class="weekday-label">월</div>
        <div class="weekday-label">화</div>
        <div class="weekday-label">수</div>
        <div class="weekday-label">목</div>
        <div class="weekday-label">금</div>
        <div class="weekday-label">토</div>
      </div>

      <!-- Date Day Grid -->
      <div class="calendar-grid">
        ${daysArray.map(day => {
          const dateStr = day.date.toISOString().split("T")[0];
          
          // Filter tasks due on this specific date
          const dayTasks = tasks.filter(task => task.dueDate === dateStr);

          return `
            <div class="calendar-day-cell ${day.isCurrentMonth ? '' : 'other-month'} ${day.isToday ? 'today' : ''}" data-date="${dateStr}">
              <div class="day-number-container">
                <span class="day-number">${day.dayNumber}</span>
              </div>
              
              <!-- Tasks due on this day -->
              <div class="day-tasks-container">
                ${dayTasks.map(task => {
                  const isDone = task.status === "done";
                  
                  // Calculate date difference for urgency flags
                  const due = new Date(task.dueDate);
                  due.setHours(0, 0, 0, 0);
                  const diffTime = due - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  // 3-Color Badges depending on status + Urgency style if active
                  let pillClass = `status-${task.status}`;
                  
                  if (isDone) {
                    pillClass += " status-done";
                  } else {
                    if (diffDays < 0) {
                      pillClass += " pill-overdue";
                    } else if (diffDays <= 1) {
                      pillClass += " pill-soon";
                    }
                  }

                  // Prepend Crown emoji for professor and Cap emoji for graduate
                  const ownerBadge = task.owner === "professor" ? "👑" : "🎓";

                  return `
                    <div class="calendar-task-pill ${pillClass} calendar-inline-edit-pill" data-id="${task.id}" title="${ownerBadge} ${escapeHTML(task.title)}">
                      <span>${ownerBadge}</span> ${escapeHTML(task.title)}
                    </div>
                  `;
                }).join("")}
              </div>
              
              <!-- Calendar Static Zero-Click Inline Addition Input (Always Visible) -->
              <div class="calendar-static-add-container mt-1.5" data-date="${dateStr}">
                <input 
                  type="text" 
                  class="calendar-static-input form-input" 
                  placeholder="+ 내 일 추가 (Enter)" 
                  autocomplete="off" 
                  style="border-radius: var(--radius-sm); height: 18px; padding: 2px 4px; border: 1px dashed var(--color-border); background: var(--color-canvas); font-size: 9px; width: 100%; transition: border-color var(--transition-fast);"
                />
              </div>
            </div>
          `;
        }).join("")}
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

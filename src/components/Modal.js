/* -------------------------------------------------------------
 * Premium Vercel-Style Modal Renderer (Add & Edit Task with Natural Date Parser)
 * ------------------------------------------------------------- */
import { store } from "../store.js";

// Helper to check standard date string (YYYY-MM-DD)
const getTodayString = () => new Date().toISOString().split('T')[0];

/**
 * Renders the HTML structure for the Add or Edit Task Modal.
 * @param {Object} options - Configuration options
 * @param {string} options.type - 'add' or 'edit'
 * @param {Object} [options.task] - The task object (required if type is 'edit')
 * @param {string} [options.defaultDate] - Default date set if creating new from calendar
 * @param {string} [options.defaultStatus] - Default status if creating new from empty column click
 */
export function renderModal({ type, task, defaultDate, defaultStatus }) {
  const isEdit = type === "edit" && task;
  const modalTitle = isEdit ? "할 일 상세 정보 수정" : "새로운 할 일 추가";
  
  const titleValue = isEdit ? task.title : "";
  const dateValue = isEdit ? task.dueDate : (defaultDate || getTodayString());
  const statusValue = isEdit ? task.status : (defaultStatus || "todo");

  return `
    <div class="modal-overlay" id="task-modal-overlay">
      <div class="modal-card">
        <!-- Modal Header -->
        <div class="modal-header">
          <h3 class="modal-title">${modalTitle}</h3>
          <button class="modal-close-btn" id="modal-close-btn" aria-label="모달 닫기">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>
        
        <!-- Modal Form Body -->
        <div class="modal-body">
          <form id="task-modal-form" onsubmit="return false;">
            <!-- Task Title Field -->
            <div class="form-group">
              <label class="form-label" for="task-title-input">할 일 내용</label>
              <input 
                type="text" 
                id="task-title-input" 
                class="form-input" 
                placeholder="어떤 연구 또는 업무를 할 예정인가요?" 
                value="${escapeHTML(titleValue)}" 
                required 
                autocomplete="off"
              />
            </div>
            
            <!-- Due Date Field (Natural Language Input) -->
            <div class="form-group">
              <label class="form-label" for="task-due-date-input">마감 기한 (Due Date)</label>
              <input 
                type="text" 
                id="task-due-date-input" 
                class="form-input" 
                placeholder="예: 오늘, 내일, 모레, 5월 30일, 다음주 수요일, 5/30" 
                value="${dateValue}" 
                required
                autocomplete="off"
              />
              <span class="text-[11px] text-mute mt-1.5 font-mono" id="due-date-parsed-preview" style="display: block; line-height: 1.4;">
                인식된 날짜: <strong class="text-accent" style="font-weight:600;">${dateValue}</strong>
              </span>
            </div>
            
            <!-- Status Dropdown (todo, inprogress, done only) -->
            <div class="form-group">
              <label class="form-label" for="task-status-input">진행 상태</label>
              <select id="task-status-input" class="form-input" style="appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23888888%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22></polyline></svg>'); background-repeat: no-repeat; background-position: right 10px center; padding-right: 30px;">
                <option value="todo" ${statusValue === "todo" ? "selected" : ""}>To Do (할 일)</option>
                <option value="inprogress" ${statusValue === "inprogress" ? "selected" : ""}>In Progress (진행 중)</option>
                <option value="done" ${statusValue === "done" ? "selected" : ""}>Done (완료)</option>
              </select>
            </div>
          </form>
        </div>
        
        <!-- Modal Footer Actions -->
        <div class="modal-footer">
          <!-- Left Aligned actions (like delete) if editing -->
          ${isEdit ? `
            <button type="button" id="modal-delete-btn" class="btn-secondary px-3.5 py-2 text-xs rounded-md text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 mr-auto" style="color: var(--color-error);" aria-label="할 일 삭제">
              <i data-lucide="trash-2" class="w-3.5 h-3.5 mr-1" style="display:inline-block; vertical-align:middle;"></i>
              <span style="vertical-align:middle;">삭제</span>
            </button>
          ` : ''}
          
          <button type="button" id="modal-cancel-btn" class="btn-secondary px-4 py-2 text-xs rounded-md">
            취소
          </button>
          <button type="button" id="modal-save-btn" class="btn-primary px-4 py-2 text-xs rounded-md" data-id="${isEdit ? task.id : ''}">
            ${isEdit ? "수정 완료" : "추가하기"}
          </button>
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

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();const L=e=>{const t=new Date;return t.setDate(t.getDate()+e),t.toISOString().split("T")[0]},Q=[{id:"task-1",title:"장보기 (계란, 우유, 사료)",dueDate:L(1),status:"todo",category:"일상"},{id:"task-2",title:"주간 운동 3회 채우기",dueDate:L(0),status:"inprogress",category:"일상"},{id:"task-3",title:"칸반 앱 카테고리 탭 기능 마무리",dueDate:L(2),status:"inprogress",category:"개발"},{id:"task-4",title:"GitHub 배포 자동화 스크립트 정리",dueDate:L(3),status:"todo",category:"개발"}],O=["일상","개발"],j={professor:"내 일",graduate:"대학원생"},P=`🗒️ 오늘의 메모 & 주간 브리핑
- 이번 주 안에 끝낼 핵심 할 일 한 가지만 정해두기.
- 탭(일상/개발)은 위쪽 '+ 탭 추가'로 얼마든지 만들 수 있어요.`,h="__all__";class tt{constructor(){this.tasksKey="graduate_kanban_tasks_v2",this.viewKey="graduate_kanban_view_v2",this.memoKey="graduate_kanban_memo_v2",this.catKey="graduate_kanban_categories_v2",this.activeCatKey="graduate_kanban_active_category_v2";const t=localStorage.getItem(this.tasksKey);let a=t?JSON.parse(t):Q;a=a.map(d=>{if(d.category)return d;const f=j[d.owner]||"일상";return{...d,category:f}});const s=localStorage.getItem(this.catKey);let n=s?JSON.parse(s):null;if(!n||!Array.isArray(n)||n.length===0){const d=[...new Set(a.map(f=>f.category).filter(Boolean))];n=[...new Set([...d,...O])]}const r=localStorage.getItem(this.viewKey)||"board",o=r.startsWith("board")?"board":r,i=localStorage.getItem(this.activeCatKey),c=i&&(i===h||n.includes(i))?i:h;this.state={tasks:a,categories:n,activeCategory:c,currentView:o,currentMonth:new Date,memo:localStorage.getItem(this.memoKey)||P},t||(this.saveTasksToLocalStorage(),localStorage.setItem(this.memoKey,P)),this.saveTasksToLocalStorage(),this.saveCategoriesToLocalStorage(),this.listeners=[]}saveTasksToLocalStorage(){localStorage.setItem(this.tasksKey,JSON.stringify(this.state.tasks))}saveViewToLocalStorage(){localStorage.setItem(this.viewKey,this.state.currentView)}saveCategoriesToLocalStorage(){localStorage.setItem(this.catKey,JSON.stringify(this.state.categories))}saveActiveCategoryToLocalStorage(){localStorage.setItem(this.activeCatKey,this.state.activeCategory)}getTasks(){return[...this.state.tasks]}getCategories(){return[...this.state.categories]}getActiveCategory(){return this.state.activeCategory}getVisibleTasks(){return this.state.activeCategory===h?[...this.state.tasks]:this.state.tasks.filter(t=>t.category===this.state.activeCategory)}getCurrentView(){return this.state.currentView}getCurrentMonth(){return this.state.currentMonth}getMemo(){return this.state.memo}setView(t){["board","calendar","dashboard"].includes(t)&&(this.state.currentView=t,this.saveViewToLocalStorage(),this.notify())}setActiveCategory(t){t!==h&&!this.state.categories.includes(t)||(this.state.activeCategory=t,this.saveActiveCategoryToLocalStorage(),this.notify())}addCategory(t){const a=(t||"").trim();return a?a===h||a==="전체"?{ok:!1,message:"'전체'는 기본 탭이라 추가할 수 없어요."}:this.state.categories.includes(a)?{ok:!1,message:"이미 있는 탭이에요."}:(this.state.categories.push(a),this.saveCategoriesToLocalStorage(),this.state.activeCategory=a,this.saveActiveCategoryToLocalStorage(),this.notify(),{ok:!0}):{ok:!1,message:"탭 이름을 입력해 주세요."}}deleteCategory(t){if(!this.state.categories.includes(t))return{ok:!1};if(this.state.categories.length<=1)return{ok:!1,message:"탭은 최소 한 개는 있어야 해요."};this.state.categories=this.state.categories.filter(s=>s!==t);const a=this.state.categories[0];return this.state.tasks=this.state.tasks.map(s=>s.category===t?{...s,category:a}:s),this.state.activeCategory===t&&(this.state.activeCategory=h,this.saveActiveCategoryToLocalStorage()),this.saveCategoriesToLocalStorage(),this.saveTasksToLocalStorage(),this.notify(),{ok:!0,movedTo:a}}renameCategory(t,a){const s=(a||"").trim();return s?this.state.categories.includes(t)?s===t?{ok:!0}:this.state.categories.includes(s)?{ok:!1,message:"이미 있는 탭 이름이에요."}:(this.state.categories=this.state.categories.map(n=>n===t?s:n),this.state.tasks=this.state.tasks.map(n=>n.category===t?{...n,category:s}:n),this.state.activeCategory===t&&(this.state.activeCategory=s,this.saveActiveCategoryToLocalStorage()),this.saveCategoriesToLocalStorage(),this.saveTasksToLocalStorage(),this.notify(),{ok:!0}):{ok:!1}:{ok:!1,message:"탭 이름을 입력해 주세요."}}setCalendarMonth(t){this.state.currentMonth=t,this.notify()}saveMemo(t){this.state.memo=t,localStorage.setItem(this.memoKey,t)}addTask(t,a="",s=null){const n=s||(this.state.activeCategory!==h?this.state.activeCategory:this.state.categories[0]||"일상"),r={id:`task-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,title:t.trim(),dueDate:a||"",status:"todo",category:n};return this.state.tasks.push(r),this.saveTasksToLocalStorage(),this.notify(),r}updateTask(t,a){this.state.tasks=this.state.tasks.map(s=>s.id===t?{...s,...a}:s),this.saveTasksToLocalStorage(),this.notify()}updateTaskStatus(t,a){["todo","inprogress","done"].includes(a)&&this.updateTask(t,{status:a})}deleteTask(t){this.state.tasks=this.state.tasks.filter(a=>a.id!==t),this.saveTasksToLocalStorage(),this.notify()}exportData(){return JSON.stringify({_app:"graduate-kanban",_version:3,tasks:this.state.tasks,categories:this.state.categories,memo:this.state.memo,currentView:this.state.currentView},null,2)}importData(t){let a;try{a=JSON.parse(t)}catch{return{ok:!1,message:"파일을 읽을 수 없어요. 올바른 백업 파일인지 확인해 주세요."}}if(!a||!Array.isArray(a.tasks))return{ok:!1,message:"이 칸반 백업 파일이 아닌 것 같아요."};const s=a.tasks.map(r=>r.category?r:{...r,category:j[r.owner]||"일상"});let n;if(Array.isArray(a.categories)&&a.categories.length>0)n=[...new Set(a.categories)];else{const r=[...new Set(s.map(o=>o.category).filter(Boolean))];n=[...new Set([...r,...O])]}return this.state.tasks=s,this.state.categories=n,n.includes(this.state.activeCategory)||(this.state.activeCategory=h,this.saveActiveCategoryToLocalStorage()),typeof a.memo=="string"&&(this.state.memo=a.memo),this.saveTasksToLocalStorage(),this.saveCategoriesToLocalStorage(),localStorage.setItem(this.memoKey,this.state.memo),this.notify(),{ok:!0,count:s.length}}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(a=>a!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const u=new tt;function U(e){if(!e)return{class:"due-none",text:"기한 없음"};const t=new Date;t.setHours(0,0,0,0);const a=new Date(e);a.setHours(0,0,0,0);const s=a-t,n=Math.ceil(s/(1e3*60*60*24));if(n<0)return{class:"due-overdue",text:`지연 D+${Math.abs(n)}`};if(n===0)return{class:"due-overdue",text:"오늘"};if(n===1)return{class:"due-soon",text:"내일"};if(n===2)return{class:"due-soon",text:"모레"};{const r=e.split("-");return{class:"due-normal",text:`${r.length===3?`${parseInt(r[1])}/${parseInt(r[2])}`:e} (D-${n})`}}}function et(){const e=u.getCategories(),t=u.getActiveCategory();return`
    <div class="category-tabs" role="tablist">
      <button class="cat-tab ${t===h?"active":""}" data-cat="${h}" role="tab">
        전체
      </button>
      ${e.map(s=>{const n=t===s?"active":"",r=N(s);return`
          <span class="cat-tab-wrap ${n}" data-cat="${r}">
            <button class="cat-tab cat-tab-named ${n}" data-cat="${r}" role="tab" title="더블클릭하면 이름 변경 · 카드를 끌어다 놓으면 이 탭으로 이동">
              ${r}
            </button>
            <button class="cat-tab-delete" data-cat="${r}" title="'${r}' 탭 삭제" aria-label="탭 삭제">
              <i data-lucide="x" class="w-2 h-2"></i>
            </button>
          </span>
        `}).join("")}
      <button class="cat-tab-add" id="cat-tab-add-btn" title="새 탭 추가">
        <i data-lucide="plus" class="w-3 h-3"></i>
        <span>탭 추가</span>
      </button>
    </div>
  `}function R(e,t){const a=e.status==="done",s=U(e.dueDate),n=a?"task-card-title inline-edit-title line-through":"task-card-title inline-edit-title",r=a?"text-mute":s.class,o=a?"check-circle-2":"circle",i=a?"text-violet":"text-mute",c=N(e.title),d=t&&e.category?`<span class="card-category-badge">${N(e.category)}</span>`:"";return`
    <div class="task-card card-reminder ${a?"is-done":""}" data-id="${e.id}">
      <div class="reminder-left-slot">
        <button class="reminder-check-btn" data-id="${e.id}" data-status="${e.status}" title="완료 토글">
          <i data-lucide="${o}" class="w-4 h-4 ${i}"></i>
        </button>
        <div class="${n}" data-id="${e.id}" title="${c} (더블 클릭하여 수정)">
          ${c}
          ${d}
        </div>
      </div>

      <div class="reminder-right-slot">
        <button class="card-drag-handle" draggable="true" data-id="${e.id}" title="끌어서 다른 탭으로 이동" aria-label="드래그 핸들">
          <i data-lucide="grip-vertical" class="w-3.5 h-3.5"></i>
        </button>
        <button class="card-move-btn" data-id="${e.id}" title="다른 탭으로 옮기기 (목록에서 선택)" aria-label="다른 탭으로 옮기기">
          <i data-lucide="folder-input" class="w-3.5 h-3.5"></i>
        </button>
        <div class="task-card-due ${r}" data-id="${e.id}" title="클릭하여 마감일 수정">
          <i data-lucide="calendar" class="w-2.5 h-2.5"></i>
          <span class="due-text">${s.text}</span>
        </div>
        <button class="card-action-btn delete-task-btn" data-id="${e.id}" title="할 일 삭제" aria-label="할 일 삭제">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `}function at(){const e=u.getVisibleTasks(),t=u.getActiveCategory()===h,a=e.filter(r=>r.status!=="done"),s=e.filter(r=>r.status==="done"),n=a.length===0&&s.length===0?'<div class="empty-state list-empty"><span>이 탭에 할 일이 없어요. 아래에 입력해서 추가하세요.</span></div>':"";return`
    ${et()}
    <div class="todo-list-wrap">
      <div class="todo-list">
        ${n}
        ${a.map(r=>R(r,t)).join("")}
        ${s.length?`<div class="done-divider"><span>완료됨 ${s.length}</span></div>`:""}
        ${s.map(r=>R(r,t)).join("")}
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
  `}function N(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function st(){const e=u.getCurrentMonth(),t=e.getFullYear(),a=e.getMonth(),s=u.getTasks(),n=new Date(t,a,1).getDay(),r=new Date(t,a+1,0).getDate(),o=new Date(t,a,0).getDate(),i=new Date;i.setHours(0,0,0,0);const c=[];for(let p=n-1;p>=0;p--){const v=new Date(t,a-1,o-p);c.push({date:v,isCurrentMonth:!1,dayNumber:o-p})}for(let p=1;p<=r;p++){const v=new Date(t,a,p),C=v.toDateString()===i.toDateString();c.push({date:v,isCurrentMonth:!0,isToday:C,dayNumber:p})}const f=42-c.length;for(let p=1;p<=f;p++){const v=new Date(t,a+1,p);c.push({date:v,isCurrentMonth:!1,dayNumber:p})}return`
    <div class="calendar-view">
      <!-- Calendar Navigation Header -->
      <div class="calendar-header">
        <h2 class="calendar-month-title">${`${t}년 ${["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"][a]}`}</h2>
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
        ${c.map(p=>{const v=p.date.toISOString().split("T")[0],C=s.filter(m=>m.dueDate===v);return`
            <div class="calendar-day-cell ${p.isCurrentMonth?"":"other-month"} ${p.isToday?"today":""}" data-date="${v}">
              <div class="day-number-container">
                <span class="day-number">${p.dayNumber}</span>
              </div>
              
              <!-- Tasks due on this day -->
              <div class="day-tasks-container">
                ${C.map(m=>{const J=m.status==="done",V=new Date(m.dueDate);V.setHours(0,0,0,0);const X=V-i,_=Math.ceil(X/(1e3*60*60*24));let T=`status-${m.status}`;J?T+=" status-done":_<0?T+=" pill-overdue":_<=1&&(T+=" pill-soon");const Z=m.category?`[${M(m.category)}] `:"";return`
                    <div class="calendar-task-pill ${T} calendar-inline-edit-pill" data-id="${m.id}" title="${Z}${M(m.title)}">
                      ${M(m.title)}
                    </div>
                  `}).join("")}
              </div>
              
              <!-- Calendar Static Zero-Click Inline Addition Input (Always Visible) -->
              <div class="calendar-static-add-container mt-1.5" data-date="${v}">
                <input 
                  type="text" 
                  class="calendar-static-input form-input" 
                  placeholder="+ 할 일 추가 (Enter)"
                  autocomplete="off" 
                  style="border-radius: var(--radius-sm); height: 18px; padding: 2px 4px; border: 1px dashed var(--color-border); background: var(--color-canvas); font-size: 9px; width: 100%; transition: border-color var(--transition-fast);"
                />
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}function M(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function nt(){const e=u.getTasks(),t=u.getCategories(),a=u.getMemo(),s=e.length,n=e.filter(l=>l.status==="done").length,r=s-n,o=s>0?Math.round(n/s*100):0,i=new Date;i.setHours(0,0,0,0);const c=l=>{if(l.status==="done"||!l.dueDate)return!1;const g=new Date(l.dueDate);return g.setHours(0,0,0,0),g<=i},d=e.filter(c).sort((l,g)=>new Date(l.dueDate)-new Date(g.dueDate)),f=t.map(l=>{const g=e.filter(m=>m.category===l),p=g.length,v=g.filter(m=>m.status==="done").length,C=p>0?Math.round(v/p*100):0;return{cat:l,total:p,done:v,rate:C}});return`
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
            <div class="text-2xl font-semibold text-ink">${o}% <span class="text-xs text-mute font-normal">완료율</span></div>
            <div class="text-xs text-mute font-mono">미완료 ${r} 건 / 전체 ${s} 건</div>
          </div>
          <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border mt-1">
            <div class="h-full transition-all duration-500" style="width: ${o}%; background: var(--color-accent); border-radius: 9999px;"></div>
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
            <div class="text-2xl font-semibold text-ink" style="color:var(--color-error)">${d.length} <span class="text-xs text-mute font-normal">건</span></div>
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
            <div class="text-2xl font-semibold text-ink">${t.length} <span class="text-xs text-mute font-normal">개 탭</span></div>
          </div>
          <div class="flex flex-wrap gap-1.5 mt-1">
            ${t.map(l=>`<span class="card-category-badge dash-cat-link" data-cat="${k(l)}" style="cursor:pointer;">${k(l)}</span>`).join("")}
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
          ${f.map(l=>`
            <div class="cat-progress-item dash-cat-link" data-cat="${k(l.cat)}" title="'${k(l.cat)}' 탭으로 이동" style="cursor:pointer;">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-medium text-ink">${k(l.cat)}</span>
                <span class="text-[10px] font-mono text-mute">${l.rate}% · ${l.done}/${l.total}</span>
              </div>
              <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border">
                <div class="h-full transition-all duration-500" style="width: ${l.rate}%; background: #7928ca; border-radius: 9999px;"></div>
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
              ${d.length}
            </span>
          </div>

          <div class="urgent-list flex flex-col gap-2">
            ${d.length===0?`
              <div class="empty-state border border-dashed border-border py-6 text-center text-xs text-mute rounded-lg" style="background: var(--color-canvas-soft); font-size:11px;">
                ✨ 오늘 지연되거나 조치가 필요한 긴급 할 일이 없습니다.
              </div>
            `:d.map(l=>{const g=U(l.dueDate),p=l.category?`<span class="card-category-badge dash-cat-link" data-cat="${k(l.category)}" style="cursor:pointer;">${k(l.category)}</span>`:"";return`
                <div class="urgent-item bg-canvas border border-border rounded-md p-3 flex items-center justify-between transition-all hover:border-border-strong" style="border-left: 3px solid var(--color-error);">
                  <div class="flex flex-col gap-1 pr-3 flex-1">
                    <div class="text-[11px] font-medium text-ink line-clamp-1">${k(l.title)} ${p}</div>
                    <div class="text-[9px] font-mono text-error font-semibold" style="color:var(--color-error)">${g.text}</div>
                  </div>
                  <div class="flex items-center gap-1">
                    <button class="btn-quick-done btn-primary px-2 py-0.5 text-[9px] rounded" data-id="${l.id}">완료</button>
                  </div>
                </div>
              `}).join("")}
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
            >${k(a)}</textarea>
            <div class="flex items-center justify-end text-[10px] text-mute font-mono pt-2 border-t border-border">
              <i data-lucide="cloud-lightning" class="w-3 h-3 mr-1 text-accent"></i>
              <span>Typing auto-saves in local storage</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `}function k(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function E(e){if(!e)return null;e=e.trim().toLowerCase();const t=new Date;if(t.setHours(0,0,0,0),/^(오늘|금일|today|d-day|dday)$/.test(e))return y(t);if(/^(내일|명일|tomorrow)$/.test(e))return y(x(t,1));if(/^(모레|내일모레|글피)$/.test(e))return y(x(t,2));if(/^(어제|작일|yesterday)$/.test(e))return y(x(t,-1));let a=e.match(/^(\d+)\s*일\s*(뒤|후|후에|이후)$/);if(a||(a=e.match(/^(\d+)\s*days?\s*(after|later)$/),a))return y(x(t,parseInt(a[1])));if(a=e.match(/^(\d+)\s*일\s*(전|전에|이전)$/),a)return y(x(t,-parseInt(a[1])));if(a=e.match(/^(이번주|다음주)?\s*(월|화|수|목|금|토|일)요일?$/),a){const n=a[1]==="다음주",r=a[2],i=["일","월","화","수","목","금","토"].indexOf(r),c=t.getDay();let d=i-c;return(n||d<=0)&&(d+=7),y(x(t,d))}if(a=e.match(/^(\d{1,2})\s*[월/\-.]\s*(\d{1,2})\s*일?$/),a){const n=parseInt(a[1])-1,r=parseInt(a[2]),o=new Date(t.getFullYear(),n,r);return y(o)}const s=Date.parse(e);return isNaN(s)?null:y(new Date(s))}function x(e,t){const a=new Date(e);return a.setDate(a.getDate()+t),a}function y(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${s}`}function W(e){if(!e)return{title:"",dueDate:""};const t=/(?:^|\s)(오늘|금일|내일|명일|모레|어제|글피|today|tomorrow|yesterday)(?:까지|에|이|가|\s|$)/i,a=/(?:^|\s)((?:이번주|다음주)?\s*[월화수목금토일]요일)(?:까지|에|이|가|\s|$)/,s=new RegExp("(?<!\\d)(\\d{1,2}\\s*월\\s*\\d{1,2}\\s*일?)(?:까지|에|이|가|\\s|$)"),n=new RegExp("(?<!\\d)(\\d{1,2}[/\\-.]\\d{1,2})(?:일|요일|까지|에|이|가|\\s|$)"),r=new RegExp("(?<!\\d)(\\d{4}[/\\-.]\\d{1,2}[/\\-.]\\d{1,2})(?:까지|에|이|가|\\s|$)");let o="",i=e,c=i.match(r);if(c){const d=c[0].trim(),f=c[1].trim(),l=E(f);l&&(o=l,i=i.replace(d,"").trim())}if(!o&&(c=i.match(s)||i.match(n),c)){const d=c[0].trim(),f=c[1].trim(),l=E(f);l&&(o=l,i=i.replace(d,"").trim())}if(!o&&(c=i.match(a),c)){const d=c[0].trim(),f=c[1].trim(),l=E(f);l&&(o=l,i=i.replace(d,"").trim())}if(!o&&(c=i.match(t),c)){const d=c[0].trim(),f=c[1].trim(),l=E(f);l&&(o=l,i=i.replace(d,"").trim())}return i=i.replace(/\s+/g," ").trim(),i=i.replace(/^(까지|에|은|는|이|가|까지의)\s+/,""),i=i.replace(/\s+(까지|e|에|은|는|이|가|까지의)$/,""),i=i.trim(),{title:i,dueDate:o}}const A=document.getElementById("app-content"),Y=document.getElementById("btn-board-view"),z=document.getElementById("btn-calendar-view"),G=document.getElementById("btn-dashboard-view"),rt=document.getElementById("btn-add-task");let b=null;function B(e){const t=e.currentView;Y.classList.toggle("active",t==="board"),z.classList.toggle("active",t==="calendar"),G.classList.toggle("active",t==="dashboard"),S(),t==="calendar"?(A.innerHTML=st(),ut()):t==="dashboard"?(A.innerHTML=nt(),ft()):(A.innerHTML=at(),ct(),lt()),window.lucide&&window.lucide.createIcons(),ot()}u.subscribe(B);function D(e,t){b={type:e,key:t}}function w(){b=null}function ot(){if(!b)return;const{type:e,key:t}=b;if(e==="board-add"&&u.getCurrentView()==="board"){const a=document.querySelector(`.static-inline-add[data-status="${t}"]`),s=a&&a.querySelector(".static-title-input");s&&s.focus()}else if(e==="calendar-add"&&u.getCurrentView()==="calendar"){const a=document.querySelector(`.calendar-static-add-container[data-date="${t}"]`),s=a&&a.querySelector(".calendar-static-input");s&&s.focus()}}function S(){const e=document.querySelector(".move-menu");e&&e.remove()}let I=null;function it(e){q();const t=u.getTasks().find(r=>r.id===e);if(!t)return;const a=u.getCategories(),s=document.createElement("div");s.className="drag-drop-panel";const n=document.createElement("div");n.className="drag-drop-panel-title",n.textContent="여기로 끌어 놓으세요",s.appendChild(n),a.forEach(r=>{const o=document.createElement("div");o.className="drag-drop-zone"+(r===t.category?" is-current":""),o.textContent=r===t.category?`${r} (현재)`:r,o.addEventListener("dragenter",i=>{i.preventDefault(),o.classList.add("over")}),o.addEventListener("dragover",i=>{i.preventDefault(),i.dataTransfer.dropEffect="move",o.classList.add("over")}),o.addEventListener("dragleave",()=>o.classList.remove("over")),o.addEventListener("drop",i=>{i.preventDefault(),i.stopPropagation();const c=i.dataTransfer.getData("text/plain")||e;u.updateTask(c,{category:r}),q()}),s.appendChild(o)}),document.body.appendChild(s),I=s}function q(){I&&(I.remove(),I=null)}function dt(e,t){S();const a=u.getTasks().find(d=>d.id===t);if(!a)return;const s=u.getCategories().filter(d=>d!==a.category);if(s.length===0){window.alert("옮길 다른 탭이 없어요. 먼저 위쪽 '+ 탭 추가'로 탭을 만드세요.");return}const n=document.createElement("div");n.className="move-menu";const r=document.createElement("div");r.className="move-menu-title",r.textContent="어느 탭으로 옮길까요?",n.appendChild(r),s.forEach(d=>{const f=document.createElement("button");f.className="move-menu-item",f.textContent=d,f.addEventListener("click",l=>{l.stopPropagation(),u.updateTask(t,{category:d}),S()}),n.appendChild(f)}),document.body.appendChild(n);const o=e.getBoundingClientRect();let c=window.scrollX+o.right-160;c<8&&(c=8),n.style.top=window.scrollY+o.bottom+6+"px",n.style.left=c+"px",setTimeout(()=>{document.addEventListener("click",function d(f){n.contains(f.target)||(S(),document.removeEventListener("click",d))})},0)}function ct(){document.querySelectorAll(".card-drag-handle").forEach(e=>{e.addEventListener("dragstart",t=>{const a=e.closest(".task-card");a&&(t.dataTransfer.setData("text/plain",a.dataset.id),t.dataTransfer.effectAllowed="move",setTimeout(()=>a.classList.add("dragging"),0),it(a.dataset.id))}),e.addEventListener("dragend",()=>{const t=e.closest(".task-card");t&&t.classList.remove("dragging"),q()})}),document.querySelectorAll(".static-inline-add .static-title-input").forEach(e=>{const a=e.closest(".static-inline-add").dataset.status;e.addEventListener("focus",()=>D("board-add",a)),e.addEventListener("blur",()=>{setTimeout(()=>{b&&b.type==="board-add"&&b.key===a&&document.activeElement!==e&&w()},100)}),e.addEventListener("keydown",s=>{if(!(s.isComposing||s.keyCode===229))if(s.key==="Enter"){s.preventDefault();const n=e.value.trim();if(!n)return;D("board-add",a);const{title:r,dueDate:o}=W(n);if(!r)return;u.addTask(r,o)}else s.key==="Escape"&&(e.value="",e.blur(),w())})}),document.querySelectorAll(".inline-edit-title").forEach(e=>{e.addEventListener("dblclick",t=>{if(t.stopPropagation(),e.querySelector("input"))return;const a=e.dataset.id,s=u.getTasks().find(d=>d.id===a),n=s?s.title:e.textContent.trim(),r=document.createElement("input");r.type="text",r.className="form-input py-1 px-1.5 text-xs w-full",r.style.fontFamily="inherit",r.value=n,e.innerHTML="",e.appendChild(r),r.focus(),r.select();let o=!1;w();const i=()=>{if(o)return;o=!0;const d=r.value.trim();d&&d!==n?u.updateTask(a,{title:d}):e.textContent=n},c=()=>{o||(o=!0,e.textContent=n)};r.addEventListener("blur",i),r.addEventListener("keydown",d=>{d.isComposing||d.keyCode===229||(d.key==="Enter"?(d.preventDefault(),i()):d.key==="Escape"&&(d.preventDefault(),c()))})})}),document.querySelectorAll(".task-card-due").forEach(e=>{e.addEventListener("click",t=>{if(t.stopPropagation(),e.querySelector("input"))return;const a=e.dataset.id,s=e.querySelector(".due-text"),n=u.getTasks().find(l=>l.id===a),r=n?n.dueDate:s?s.textContent.trim():"",o=document.createElement("input");o.type="text",o.className="form-input py-0.5 px-1 text-[11px] font-mono",o.style.width="140px",o.style.display="inline-block",o.placeholder="예: 오늘, 내일, 6/17",o.value=r;const i=e.querySelector("i");i&&(i.style.display="none"),s&&(s.style.display="none"),e.appendChild(o),o.focus(),o.select();let c=!1;w();const d=()=>{if(c)return;c=!0;const l=o.value.trim();if(l){const g=E(l)||l;u.updateTask(a,{dueDate:g})}else u.updateTask(a,{dueDate:""})},f=()=>{c||(c=!0,i&&(i.style.display=""),s&&(s.style.display=""),o.remove())};o.addEventListener("blur",d),o.addEventListener("keydown",l=>{l.isComposing||l.keyCode===229||(l.key==="Enter"?(l.preventDefault(),d()):l.key==="Escape"&&(l.preventDefault(),f()))})})}),document.querySelectorAll(".delete-task-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),u.deleteTask(e.dataset.id)})}),document.querySelectorAll(".reminder-check-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const a=e.dataset.id,s=e.dataset.status==="done"?"todo":"done";u.updateTaskStatus(a,s)})}),document.querySelectorAll(".card-move-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),dt(e,e.dataset.id)})})}function lt(){document.querySelectorAll(".cat-tab").forEach(t=>{t.addEventListener("click",()=>u.setActiveCategory(t.dataset.cat))}),document.querySelectorAll(".cat-tab-wrap").forEach(t=>{const a=t.dataset.cat;t.addEventListener("dragover",s=>{s.preventDefault(),t.classList.add("tab-drop-over")}),t.addEventListener("dragleave",()=>t.classList.remove("tab-drop-over")),t.addEventListener("drop",s=>{s.preventDefault(),t.classList.remove("tab-drop-over");const n=s.dataTransfer.getData("text/plain");n&&a&&u.updateTask(n,{category:a})})}),document.querySelectorAll(".cat-tab-named").forEach(t=>{t.addEventListener("dblclick",a=>{if(a.stopPropagation(),a.preventDefault(),t.querySelector("input"))return;const s=t.dataset.cat,n=document.createElement("input");n.type="text",n.className="cat-tab-edit-input form-input",n.value=s,t.textContent="",t.appendChild(n),n.focus(),n.select();let r=!1;const o=i=>{if(r)return;r=!0;const c=n.value.trim();if(i&&c&&c!==s){const d=u.renameCategory(s,c);!d.ok&&d.message&&(window.alert(d.message),t.textContent=s)}else t.textContent=s};n.addEventListener("keydown",i=>{i.isComposing||i.keyCode===229||(i.key==="Enter"?(i.preventDefault(),o(!0)):i.key==="Escape"&&(i.preventDefault(),o(!1)))}),n.addEventListener("blur",()=>o(!0))})}),document.querySelectorAll(".cat-tab-delete").forEach(t=>{t.addEventListener("click",a=>{a.stopPropagation();const s=t.dataset.cat;if(!window.confirm(`'${s}' 탭을 삭제할까요?

이 탭의 할 일은 사라지지 않고 다른 탭으로 옮겨집니다.`))return;const r=u.deleteCategory(s);!r.ok&&r.message&&window.alert(r.message)})});const e=document.getElementById("cat-tab-add-btn");e&&e.addEventListener("click",()=>{if(document.getElementById("cat-tab-add-input"))return;const t=document.createElement("input");t.id="cat-tab-add-input",t.type="text",t.className="cat-tab-edit-input form-input",t.placeholder="새 탭 이름",e.parentNode.insertBefore(t,e),e.style.display="none",t.focus();let a=!1;const s=n=>{if(a)return;a=!0;const r=t.value.trim();if(t.parentNode&&t.remove(),e.style.display="",n&&r){const o=u.addCategory(r);!o.ok&&o.message&&window.alert(o.message)}};t.addEventListener("keydown",n=>{n.isComposing||n.keyCode===229||(n.key==="Enter"?(n.preventDefault(),s(!0)):n.key==="Escape"&&(n.preventDefault(),s(!1)))}),t.addEventListener("blur",()=>s(!0))})}function ut(){const e=document.getElementById("calendar-prev-btn"),t=document.getElementById("calendar-next-btn"),a=document.getElementById("calendar-today-btn");e&&t&&a&&(e.addEventListener("click",()=>{const s=u.getCurrentMonth();u.setCalendarMonth(new Date(s.getFullYear(),s.getMonth()-1,1))}),t.addEventListener("click",()=>{const s=u.getCurrentMonth();u.setCalendarMonth(new Date(s.getFullYear(),s.getMonth()+1,1))}),a.addEventListener("click",()=>u.setCalendarMonth(new Date))),document.querySelectorAll(".calendar-static-input").forEach(s=>{const r=s.closest(".calendar-static-add-container").dataset.date;s.addEventListener("focus",()=>D("calendar-add",r)),s.addEventListener("blur",()=>{setTimeout(()=>{b&&b.type==="calendar-add"&&b.key===r&&document.activeElement!==s&&w()},100)}),s.addEventListener("keydown",o=>{if(!(o.isComposing||o.keyCode===229))if(o.key==="Enter"){o.preventDefault();const i=s.value.trim();if(!i)return;D("calendar-add",r);const{title:c,dueDate:d}=W(i);if(!c)return;u.addTask(c,d||r)}else o.key==="Escape"&&(s.value="",s.blur(),w())})}),document.querySelectorAll(".calendar-inline-edit-pill").forEach(s=>{s.addEventListener("dblclick",n=>{if(n.stopPropagation(),s.querySelector("input"))return;const r=s.dataset.id,o=u.getTasks().find(g=>g.id===r),i=o?o.title:s.textContent.trim(),c=document.createElement("input");c.type="text",c.className="form-input py-0.5 px-1 text-[9px] w-full",c.style.height="16px",c.value=i,s.innerHTML="",s.appendChild(c),c.focus(),c.select();let d=!1;w();const f=()=>{if(d)return;d=!0;const g=c.value.trim();g&&g!==i?u.updateTask(r,{title:g}):u.notify()},l=()=>{d||(d=!0,u.notify())};c.addEventListener("blur",f),c.addEventListener("keydown",g=>{g.isComposing||g.keyCode===229||(g.key==="Enter"?(g.preventDefault(),f()):g.key==="Escape"&&(g.preventDefault(),l()))})})})}function ft(){const e=document.getElementById("dashboard-notepad");e&&e.addEventListener("input",t=>u.saveMemo(t.target.value)),document.querySelectorAll(".btn-quick-done").forEach(t=>{t.addEventListener("click",()=>u.updateTaskStatus(t.dataset.id,"done"))}),document.querySelectorAll(".dash-cat-link").forEach(t=>{t.addEventListener("click",()=>{u.setActiveCategory(t.dataset.cat),u.setView("board")})})}Y.addEventListener("click",()=>u.setView("board"));z.addEventListener("click",()=>u.setView("calendar"));G.addEventListener("click",()=>u.setView("dashboard"));rt.addEventListener("click",()=>{u.getCurrentView()!=="board"?(u.setView("board"),setTimeout(K,50)):K()});function K(){const e=document.querySelector('.static-inline-add[data-status="todo"]'),t=e&&e.querySelector(".static-title-input");t&&(t.focus(),D("board-add","todo"))}const H=document.getElementById("btn-export-data"),F=document.getElementById("btn-import-data"),$=document.getElementById("import-file-input");H&&H.addEventListener("click",()=>{const e=u.exportData(),t=new Blob([e],{type:"application/json"}),a=URL.createObjectURL(t),s=document.createElement("a"),n=new Date().toISOString().split("T")[0];s.href=a,s.download=`졸업칸반-백업-${n}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),setTimeout(()=>URL.revokeObjectURL(a),1e3)});F&&$&&(F.addEventListener("click",()=>$.click()),$.addEventListener("change",e=>{const t=e.target.files&&e.target.files[0];if(!t)return;const a=new FileReader;a.onload=s=>{const n=u.importData(s.target.result);n.ok?window.alert(`불러오기 완료! 할 일 ${n.count}개를 가져왔어요.`):window.alert(n.message),$.value=""},a.readAsText(t)}));document.addEventListener("DOMContentLoaded",()=>B(u.state));(document.readyState==="interactive"||document.readyState==="complete")&&B(u.state);

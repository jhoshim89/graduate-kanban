(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}})();const L=e=>{const t=new Date;return t.setDate(t.getDate()+e),t.toISOString().split("T")[0]},at=[{id:"task-1",title:"장보기 (계란, 우유, 사료)",dueDate:L(1),status:"todo",category:"일상"},{id:"task-2",title:"주간 운동 3회 채우기",dueDate:L(0),status:"inprogress",category:"일상"},{id:"task-3",title:"칸반 앱 카테고리 탭 기능 마무리",dueDate:L(2),status:"inprogress",category:"개발"},{id:"task-4",title:"GitHub 배포 자동화 스크립트 정리",dueDate:L(3),status:"todo",category:"개발"}],H=["일상","개발"],P={professor:"내 일",graduate:"대학원생"},R=`🗒️ 오늘의 메모 & 주간 브리핑
- 이번 주 안에 끝낼 핵심 할 일 한 가지만 정해두기.
- 탭(일상/개발)은 위쪽 '+ 탭 추가'로 얼마든지 만들 수 있어요.`,h="__all__";class st{constructor(){this.tasksKey="graduate_kanban_tasks_v2",this.viewKey="graduate_kanban_view_v2",this.memoKey="graduate_kanban_memo_v2",this.catKey="graduate_kanban_categories_v2",this.activeCatKey="graduate_kanban_active_category_v2";const t=localStorage.getItem(this.tasksKey);let s=t?JSON.parse(t):at;s=s.map(c=>{if(c.category)return c;const f=P[c.owner]||"일상";return{...c,category:f}});const a=localStorage.getItem(this.catKey);let n=a?JSON.parse(a):null;if(!n||!Array.isArray(n)||n.length===0){const c=[...new Set(s.map(f=>f.category).filter(Boolean))];n=[...new Set([...c,...H])]}const r=localStorage.getItem(this.viewKey)||"board",o=r.startsWith("board")?"board":r,d=localStorage.getItem(this.activeCatKey),i=d&&(d===h||n.includes(d))?d:h;this.state={tasks:s,categories:n,activeCategory:i,currentView:o,currentMonth:new Date,memo:localStorage.getItem(this.memoKey)||R},t||(this.saveTasksToLocalStorage(),localStorage.setItem(this.memoKey,R)),this.saveTasksToLocalStorage(),this.saveCategoriesToLocalStorage(),this.listeners=[]}saveTasksToLocalStorage(){localStorage.setItem(this.tasksKey,JSON.stringify(this.state.tasks))}saveViewToLocalStorage(){localStorage.setItem(this.viewKey,this.state.currentView)}saveCategoriesToLocalStorage(){localStorage.setItem(this.catKey,JSON.stringify(this.state.categories))}saveActiveCategoryToLocalStorage(){localStorage.setItem(this.activeCatKey,this.state.activeCategory)}getTasks(){return[...this.state.tasks]}getCategories(){return[...this.state.categories]}getActiveCategory(){return this.state.activeCategory}getVisibleTasks(){return this.state.activeCategory===h?[...this.state.tasks]:this.state.tasks.filter(t=>t.category===this.state.activeCategory)}getCurrentView(){return this.state.currentView}getCurrentMonth(){return this.state.currentMonth}getMemo(){return this.state.memo}setView(t){["board","calendar","dashboard"].includes(t)&&(this.state.currentView=t,this.saveViewToLocalStorage(),this.notify())}setActiveCategory(t){t!==h&&!this.state.categories.includes(t)||(this.state.activeCategory=t,this.saveActiveCategoryToLocalStorage(),this.notify())}addCategory(t){const s=(t||"").trim();return s?s===h||s==="전체"?{ok:!1,message:"'전체'는 기본 탭이라 추가할 수 없어요."}:this.state.categories.includes(s)?{ok:!1,message:"이미 있는 탭이에요."}:(this.state.categories.push(s),this.saveCategoriesToLocalStorage(),this.state.activeCategory=s,this.saveActiveCategoryToLocalStorage(),this.notify(),{ok:!0}):{ok:!1,message:"탭 이름을 입력해 주세요."}}deleteCategory(t){if(!this.state.categories.includes(t))return{ok:!1};if(this.state.categories.length<=1)return{ok:!1,message:"탭은 최소 한 개는 있어야 해요."};this.state.categories=this.state.categories.filter(a=>a!==t);const s=this.state.categories[0];return this.state.tasks=this.state.tasks.map(a=>a.category===t?{...a,category:s}:a),this.state.activeCategory===t&&(this.state.activeCategory=h,this.saveActiveCategoryToLocalStorage()),this.saveCategoriesToLocalStorage(),this.saveTasksToLocalStorage(),this.notify(),{ok:!0,movedTo:s}}renameCategory(t,s){const a=(s||"").trim();return a?this.state.categories.includes(t)?a===t?{ok:!0}:this.state.categories.includes(a)?{ok:!1,message:"이미 있는 탭 이름이에요."}:(this.state.categories=this.state.categories.map(n=>n===t?a:n),this.state.tasks=this.state.tasks.map(n=>n.category===t?{...n,category:a}:n),this.state.activeCategory===t&&(this.state.activeCategory=a,this.saveActiveCategoryToLocalStorage()),this.saveCategoriesToLocalStorage(),this.saveTasksToLocalStorage(),this.notify(),{ok:!0}):{ok:!1}:{ok:!1,message:"탭 이름을 입력해 주세요."}}setCalendarMonth(t){this.state.currentMonth=t,this.notify()}saveMemo(t){this.state.memo=t,localStorage.setItem(this.memoKey,t)}addTask(t,s="",a=null){const n=a||(this.state.activeCategory!==h?this.state.activeCategory:this.state.categories[0]||"일상"),r={id:`task-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,title:t.trim(),dueDate:s||"",status:"todo",category:n};return this.state.tasks.push(r),this.saveTasksToLocalStorage(),this.notify(),r}updateTask(t,s){this.state.tasks=this.state.tasks.map(a=>a.id===t?{...a,...s}:a),this.saveTasksToLocalStorage(),this.notify()}updateTaskStatus(t,s){["todo","inprogress","done"].includes(s)&&this.updateTask(t,{status:s})}deleteTask(t){this.state.tasks=this.state.tasks.filter(s=>s.id!==t),this.saveTasksToLocalStorage(),this.notify()}exportData(){return JSON.stringify({_app:"graduate-kanban",_version:3,tasks:this.state.tasks,categories:this.state.categories,memo:this.state.memo,currentView:this.state.currentView},null,2)}importData(t){let s;try{s=JSON.parse(t)}catch{return{ok:!1,message:"파일을 읽을 수 없어요. 올바른 백업 파일인지 확인해 주세요."}}if(!s||!Array.isArray(s.tasks))return{ok:!1,message:"이 칸반 백업 파일이 아닌 것 같아요."};const a=s.tasks.map(r=>r.category?r:{...r,category:P[r.owner]||"일상"});let n;if(Array.isArray(s.categories)&&s.categories.length>0)n=[...new Set(s.categories)];else{const r=[...new Set(a.map(o=>o.category).filter(Boolean))];n=[...new Set([...r,...H])]}return this.state.tasks=a,this.state.categories=n,n.includes(this.state.activeCategory)||(this.state.activeCategory=h,this.saveActiveCategoryToLocalStorage()),typeof s.memo=="string"&&(this.state.memo=s.memo),this.saveTasksToLocalStorage(),this.saveCategoriesToLocalStorage(),localStorage.setItem(this.memoKey,this.state.memo),this.notify(),{ok:!0,count:a.length}}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(s=>s!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const u=new st,j=["#0070f3","#7928ca","#10b981","#f5a623","#e91e63","#06b6d4","#d946ef","#ef4444"];function Y(e){const t=u.getCategories().indexOf(e);return t<0?"#9aa0a6":j[t%j.length]}function z(e){if(!e)return{class:"due-none",text:"기한 없음"};const t=new Date;t.setHours(0,0,0,0);const s=new Date(e);s.setHours(0,0,0,0);const a=s-t,n=Math.ceil(a/(1e3*60*60*24));if(n<0)return{class:"due-overdue",text:`지연 D+${Math.abs(n)}`};if(n===0)return{class:"due-overdue",text:"오늘"};if(n===1)return{class:"due-soon",text:"내일"};if(n===2)return{class:"due-soon",text:"모레"};{const r=e.split("-");return{class:"due-normal",text:`${r.length===3?`${parseInt(r[1])}/${parseInt(r[2])}`:e} (D-${n})`}}}function nt(){const e=u.getCategories(),t=u.getActiveCategory();return`
    <div class="category-tabs" role="tablist">
      <button class="cat-tab ${t===h?"active":""}" data-cat="${h}" role="tab">
        <span class="cat-tab-num">1</span>전체
      </button>
      ${e.map((a,n)=>{const r=t===a?"active":"",o=B(a),d=n+2,i=Y(a),c=d<=9?`<span class="cat-tab-num">${d}</span>`:"";return`
          <span class="cat-tab-wrap ${r}" data-cat="${o}">
            <button class="cat-tab cat-tab-named ${r}" data-cat="${o}" role="tab" title="더블클릭하면 이름 변경 · 카드를 끌어다 놓으면 이 탭으로 이동">
              ${c}<span class="cat-tab-dot" style="background:${i}"></span>${o}
            </button>
            <button class="cat-tab-delete" data-cat="${o}" title="'${o}' 탭 삭제" aria-label="탭 삭제">
              <i data-lucide="x" class="w-2 h-2"></i>
            </button>
          </span>
        `}).join("")}
      <button class="cat-tab-add" id="cat-tab-add-btn" title="새 탭 추가">
        <i data-lucide="plus" class="w-3 h-3"></i>
        <span>탭 추가</span>
      </button>
    </div>
  `}function F(e,t){const s=e.status==="done",a=z(e.dueDate),n=s?"task-card-title inline-edit-title line-through":"task-card-title inline-edit-title",r=s?"text-mute":a.class,o=s?"check-circle-2":"circle",d=s?"text-violet":"text-mute",i=B(e.title),c=t&&e.category?`<span class="card-category-badge"><span class="cat-dot-mini" style="background:${Y(e.category)}"></span>${B(e.category)}</span>`:"";return`
    <div class="task-card card-reminder ${s?"is-done":""}" draggable="true" data-id="${e.id}">
      <div class="reminder-left-slot">
        <button class="reminder-check-btn" data-id="${e.id}" data-status="${e.status}" title="완료 토글">
          <i data-lucide="${o}" class="w-4 h-4 ${d}"></i>
        </button>
        <div class="${n}" data-id="${e.id}" title="${i} (더블 클릭하여 수정)">
          ${i}
          ${c}
        </div>
      </div>

      <div class="reminder-right-slot">
        <span class="card-drag-handle" data-id="${e.id}" title="이 줄을 끌어서 다른 탭으로 이동 (어디를 잡아도 돼요)" aria-hidden="true">
          <i data-lucide="grip-vertical" class="w-3.5 h-3.5"></i>
        </span>
        <button class="card-move-btn" data-id="${e.id}" title="다른 탭으로 옮기기 (목록에서 선택)" aria-label="다른 탭으로 옮기기">
          <i data-lucide="folder-input" class="w-3.5 h-3.5"></i>
        </button>
        <div class="task-card-due ${r}" data-id="${e.id}" title="클릭하여 마감일 수정">
          <i data-lucide="calendar" class="w-2.5 h-2.5"></i>
          <span class="due-text">${a.text}</span>
        </div>
        <button class="card-action-btn delete-task-btn" data-id="${e.id}" title="할 일 삭제" aria-label="할 일 삭제">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `}function rt(){const e=u.getVisibleTasks(),t=u.getActiveCategory()===h,s=e.filter(r=>r.status!=="done"),a=e.filter(r=>r.status==="done"),n=s.length===0&&a.length===0?'<div class="empty-state list-empty"><span>이 탭에 할 일이 없어요. 아래에 입력해서 추가하세요.</span></div>':"";return`
    ${nt()}
    <div class="todo-list-wrap">
      <div class="todo-list">
        ${n}
        ${s.map(r=>F(r,t)).join("")}
        ${a.length?`<div class="done-divider"><span>완료됨 ${a.length}</span></div>`:""}
        ${a.map(r=>F(r,t)).join("")}
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
  `}function B(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function ot(){const e=u.getCurrentMonth(),t=e.getFullYear(),s=e.getMonth(),a=u.getTasks(),n=new Date(t,s,1).getDay(),r=new Date(t,s+1,0).getDate(),o=new Date(t,s,0).getDate(),d=new Date;d.setHours(0,0,0,0);const i=[];for(let g=n-1;g>=0;g--){const v=new Date(t,s-1,o-g);i.push({date:v,isCurrentMonth:!1,dayNumber:o-g})}for(let g=1;g<=r;g++){const v=new Date(t,s,g),C=v.toDateString()===d.toDateString();i.push({date:v,isCurrentMonth:!0,isToday:C,dayNumber:g})}const f=42-i.length;for(let g=1;g<=f;g++){const v=new Date(t,s+1,g);i.push({date:v,isCurrentMonth:!1,dayNumber:g})}return`
    <div class="calendar-view">
      <!-- Calendar Navigation Header -->
      <div class="calendar-header">
        <h2 class="calendar-month-title">${`${t}년 ${["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"][s]}`}</h2>
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
        ${i.map(g=>{const v=g.date.toISOString().split("T")[0],C=a.filter(m=>m.dueDate===v);return`
            <div class="calendar-day-cell ${g.isCurrentMonth?"":"other-month"} ${g.isToday?"today":""}" data-date="${v}">
              <div class="day-number-container">
                <span class="day-number">${g.dayNumber}</span>
              </div>
              
              <!-- Tasks due on this day -->
              <div class="day-tasks-container">
                ${C.map(m=>{const Q=m.status==="done",_=new Date(m.dueDate);_.setHours(0,0,0,0);const tt=_-d,K=Math.ceil(tt/(1e3*60*60*24));let T=`status-${m.status}`;Q?T+=" status-done":K<0?T+=" pill-overdue":K<=1&&(T+=" pill-soon");const et=m.category?`[${M(m.category)}] `:"";return`
                    <div class="calendar-task-pill ${T} calendar-inline-edit-pill" data-id="${m.id}" title="${et}${M(m.title)}">
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
  `}function M(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function it(){const e=u.getTasks(),t=u.getCategories(),s=u.getMemo(),a=e.length,n=e.filter(l=>l.status==="done").length,r=a-n,o=a>0?Math.round(n/a*100):0,d=new Date;d.setHours(0,0,0,0);const i=l=>{if(l.status==="done"||!l.dueDate)return!1;const p=new Date(l.dueDate);return p.setHours(0,0,0,0),p<=d},c=e.filter(i).sort((l,p)=>new Date(l.dueDate)-new Date(p.dueDate)),f=t.map(l=>{const p=e.filter(m=>m.category===l),g=p.length,v=p.filter(m=>m.status==="done").length,C=g>0?Math.round(v/g*100):0;return{cat:l,total:g,done:v,rate:C}});return`
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
            <div class="text-xs text-mute font-mono">미완료 ${r} 건 / 전체 ${a} 건</div>
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
            <div class="text-2xl font-semibold text-ink" style="color:var(--color-error)">${c.length} <span class="text-xs text-mute font-normal">건</span></div>
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
              ${c.length}
            </span>
          </div>

          <div class="urgent-list flex flex-col gap-2">
            ${c.length===0?`
              <div class="empty-state border border-dashed border-border py-6 text-center text-xs text-mute rounded-lg" style="background: var(--color-canvas-soft); font-size:11px;">
                ✨ 오늘 지연되거나 조치가 필요한 긴급 할 일이 없습니다.
              </div>
            `:c.map(l=>{const p=z(l.dueDate),g=l.category?`<span class="card-category-badge dash-cat-link" data-cat="${k(l.category)}" style="cursor:pointer;">${k(l.category)}</span>`:"";return`
                <div class="urgent-item bg-canvas border border-border rounded-md p-3 flex items-center justify-between transition-all hover:border-border-strong" style="border-left: 3px solid var(--color-error);">
                  <div class="flex flex-col gap-1 pr-3 flex-1">
                    <div class="text-[11px] font-medium text-ink line-clamp-1">${k(l.title)} ${g}</div>
                    <div class="text-[9px] font-mono text-error font-semibold" style="color:var(--color-error)">${p.text}</div>
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
            >${k(s)}</textarea>
            <div class="flex items-center justify-end text-[10px] text-mute font-mono pt-2 border-t border-border">
              <i data-lucide="cloud-lightning" class="w-3 h-3 mr-1 text-accent"></i>
              <span>Typing auto-saves in local storage</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `}function k(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function E(e){if(!e)return null;e=e.trim().toLowerCase();const t=new Date;if(t.setHours(0,0,0,0),/^(오늘|금일|today|d-day|dday)$/.test(e))return y(t);if(/^(내일|명일|tomorrow)$/.test(e))return y(x(t,1));if(/^(모레|내일모레|글피)$/.test(e))return y(x(t,2));if(/^(어제|작일|yesterday)$/.test(e))return y(x(t,-1));let s=e.match(/^(\d+)\s*일\s*(뒤|후|후에|이후)$/);if(s||(s=e.match(/^(\d+)\s*days?\s*(after|later)$/),s))return y(x(t,parseInt(s[1])));if(s=e.match(/^(\d+)\s*일\s*(전|전에|이전)$/),s)return y(x(t,-parseInt(s[1])));if(s=e.match(/^(이번주|다음주)?\s*(월|화|수|목|금|토|일)요일?$/),s){const n=s[1]==="다음주",r=s[2],d=["일","월","화","수","목","금","토"].indexOf(r),i=t.getDay();let c=d-i;return(n||c<=0)&&(c+=7),y(x(t,c))}if(s=e.match(/^(\d{1,2})\s*[월/\-.]\s*(\d{1,2})\s*일?$/),s){const n=parseInt(s[1])-1,r=parseInt(s[2]),o=new Date(t.getFullYear(),n,r);return y(o)}const a=Date.parse(e);return isNaN(a)?null:y(new Date(a))}function x(e,t){const s=new Date(e);return s.setDate(s.getDate()+t),s}function y(e){const t=e.getFullYear(),s=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0");return`${t}-${s}-${a}`}function G(e){if(!e)return{title:"",dueDate:""};const t=/(?:^|\s)(오늘|금일|내일|명일|모레|어제|글피|today|tomorrow|yesterday)(?:까지|에|이|가|\s|$)/i,s=/(?:^|\s)((?:이번주|다음주)?\s*[월화수목금토일]요일)(?:까지|에|이|가|\s|$)/,a=new RegExp("(?<!\\d)(\\d{1,2}\\s*월\\s*\\d{1,2}\\s*일?)(?:까지|에|이|가|\\s|$)"),n=new RegExp("(?<!\\d)(\\d{1,2}[/\\-.]\\d{1,2})(?:일|요일|까지|에|이|가|\\s|$)"),r=new RegExp("(?<!\\d)(\\d{4}[/\\-.]\\d{1,2}[/\\-.]\\d{1,2})(?:까지|에|이|가|\\s|$)");let o="",d=e,i=d.match(r);if(i){const c=i[0].trim(),f=i[1].trim(),l=E(f);l&&(o=l,d=d.replace(c,"").trim())}if(!o&&(i=d.match(a)||d.match(n),i)){const c=i[0].trim(),f=i[1].trim(),l=E(f);l&&(o=l,d=d.replace(c,"").trim())}if(!o&&(i=d.match(s),i)){const c=i[0].trim(),f=i[1].trim(),l=E(f);l&&(o=l,d=d.replace(c,"").trim())}if(!o&&(i=d.match(t),i)){const c=i[0].trim(),f=i[1].trim(),l=E(f);l&&(o=l,d=d.replace(c,"").trim())}return d=d.replace(/\s+/g," ").trim(),d=d.replace(/^(까지|에|은|는|이|가|까지의)\s+/,""),d=d.replace(/\s+(까지|e|에|은|는|이|가|까지의)$/,""),d=d.trim(),{title:d,dueDate:o}}const N=document.getElementById("app-content"),J=document.getElementById("btn-board-view"),X=document.getElementById("btn-calendar-view"),Z=document.getElementById("btn-dashboard-view"),dt=document.getElementById("btn-add-task");let b=null;function O(e){const t=e.currentView;J.classList.toggle("active",t==="board"),X.classList.toggle("active",t==="calendar"),Z.classList.toggle("active",t==="dashboard"),S(),t==="calendar"?(N.innerHTML=ot(),gt()):t==="dashboard"?(N.innerHTML=it(),mt()):(N.innerHTML=rt(),ft(),pt()),window.lucide&&window.lucide.createIcons(),ct()}u.subscribe(O);function D(e,t){b={type:e,key:t}}function w(){b=null}function ct(){if(!b)return;const{type:e,key:t}=b;if(e==="board-add"&&u.getCurrentView()==="board"){const s=document.querySelector(`.static-inline-add[data-status="${t}"]`),a=s&&s.querySelector(".static-title-input");a&&a.focus()}else if(e==="calendar-add"&&u.getCurrentView()==="calendar"){const s=document.querySelector(`.calendar-static-add-container[data-date="${t}"]`),a=s&&s.querySelector(".calendar-static-input");a&&a.focus()}}function S(){const e=document.querySelector(".move-menu");e&&e.remove()}let I=null;function lt(e){q();const t=u.getTasks().find(o=>o.id===e);if(!t)return;const s=u.getCategories(),a=document.createElement("div");a.className="drag-drop-panel";const n=document.createElement("div");n.className="drag-drop-panel-title",n.textContent="여기 폴더에 놓기",a.appendChild(n),s.forEach(o=>{const d=o===t.category,i=document.createElement("div");i.className="drag-drop-zone"+(d?" is-current":"");const c=document.createElement("i");c.setAttribute("data-lucide",d?"folder-open":"folder"),i.appendChild(c);const f=document.createElement("span");f.textContent=d?`${o} (현재)`:o,i.appendChild(f),i.addEventListener("dragenter",l=>{l.preventDefault(),i.classList.add("over")}),i.addEventListener("dragover",l=>{l.preventDefault(),l.dataTransfer.dropEffect="move",i.classList.add("over")}),i.addEventListener("dragleave",()=>i.classList.remove("over")),i.addEventListener("drop",l=>{l.preventDefault(),l.stopPropagation();const p=l.dataTransfer.getData("text/plain")||e;u.updateTask(p,{category:o}),q()}),a.appendChild(i)}),document.body.appendChild(a),I=a;const r=document.querySelector(`.task-card[data-id="${e}"]`);if(r){const o=r.getBoundingClientRect(),d=190;let i=o.right+14;i+d>window.innerWidth-8&&(i=Math.max(8,o.left-d-14)),a.style.position="fixed",a.style.right="auto",a.style.transform="none",a.style.left=i+"px",a.style.top=o.top+"px";const c=a.offsetHeight;o.top+c>window.innerHeight-8&&(a.style.top=Math.max(8,window.innerHeight-c-8)+"px")}window.lucide&&window.lucide.createIcons()}function q(){I&&(I.remove(),I=null)}function ut(e,t){S();const s=u.getTasks().find(c=>c.id===t);if(!s)return;const a=u.getCategories().filter(c=>c!==s.category);if(a.length===0){window.alert("옮길 다른 탭이 없어요. 먼저 위쪽 '+ 탭 추가'로 탭을 만드세요.");return}const n=document.createElement("div");n.className="move-menu";const r=document.createElement("div");r.className="move-menu-title",r.textContent="어느 탭으로 옮길까요?",n.appendChild(r),a.forEach(c=>{const f=document.createElement("button");f.className="move-menu-item",f.textContent=c,f.addEventListener("click",l=>{l.stopPropagation(),u.updateTask(t,{category:c}),S()}),n.appendChild(f)}),document.body.appendChild(n);const o=e.getBoundingClientRect();let i=window.scrollX+o.right-160;i<8&&(i=8),n.style.top=window.scrollY+o.bottom+6+"px",n.style.left=i+"px",setTimeout(()=>{document.addEventListener("click",function c(f){n.contains(f.target)||(S(),document.removeEventListener("click",c))})},0)}function ft(){document.querySelectorAll(".task-card").forEach(e=>{e.addEventListener("dragstart",t=>{if(e.querySelector("input")){t.preventDefault();return}t.dataTransfer.setData("text/plain",e.dataset.id),t.dataTransfer.effectAllowed="move",setTimeout(()=>e.classList.add("dragging"),0),lt(e.dataset.id)}),e.addEventListener("dragend",()=>{e.classList.remove("dragging"),q()})}),document.querySelectorAll(".static-inline-add .static-title-input").forEach(e=>{const s=e.closest(".static-inline-add").dataset.status;e.addEventListener("focus",()=>D("board-add",s)),e.addEventListener("blur",()=>{setTimeout(()=>{b&&b.type==="board-add"&&b.key===s&&document.activeElement!==e&&w()},100)}),e.addEventListener("keydown",a=>{if(!(a.isComposing||a.keyCode===229))if(a.key==="Enter"){a.preventDefault();const n=e.value.trim();if(!n)return;D("board-add",s);const{title:r,dueDate:o}=G(n);if(!r)return;u.addTask(r,o)}else a.key==="Escape"&&(e.value="",e.blur(),w())})}),document.querySelectorAll(".inline-edit-title").forEach(e=>{e.addEventListener("dblclick",t=>{if(t.stopPropagation(),e.querySelector("input"))return;const s=e.dataset.id,a=u.getTasks().find(c=>c.id===s),n=a?a.title:e.textContent.trim(),r=document.createElement("input");r.type="text",r.className="form-input py-1 px-1.5 text-xs w-full",r.style.fontFamily="inherit",r.value=n,e.innerHTML="",e.appendChild(r),r.focus(),r.select();let o=!1;w();const d=()=>{if(o)return;o=!0;const c=r.value.trim();c&&c!==n?u.updateTask(s,{title:c}):e.textContent=n},i=()=>{o||(o=!0,e.textContent=n)};r.addEventListener("blur",d),r.addEventListener("keydown",c=>{c.isComposing||c.keyCode===229||(c.key==="Enter"?(c.preventDefault(),d()):c.key==="Escape"&&(c.preventDefault(),i()))})})}),document.querySelectorAll(".task-card-due").forEach(e=>{e.addEventListener("click",t=>{if(t.stopPropagation(),e.querySelector("input"))return;const s=e.dataset.id,a=e.querySelector(".due-text"),n=u.getTasks().find(l=>l.id===s),r=n?n.dueDate:a?a.textContent.trim():"",o=document.createElement("input");o.type="text",o.className="form-input py-0.5 px-1 text-[11px] font-mono",o.style.width="140px",o.style.display="inline-block",o.placeholder="예: 오늘, 내일, 6/17",o.value=r;const d=e.querySelector("i");d&&(d.style.display="none"),a&&(a.style.display="none"),e.appendChild(o),o.focus(),o.select();let i=!1;w();const c=()=>{if(i)return;i=!0;const l=o.value.trim();if(l){const p=E(l)||l;u.updateTask(s,{dueDate:p})}else u.updateTask(s,{dueDate:""})},f=()=>{i||(i=!0,d&&(d.style.display=""),a&&(a.style.display=""),o.remove())};o.addEventListener("blur",c),o.addEventListener("keydown",l=>{l.isComposing||l.keyCode===229||(l.key==="Enter"?(l.preventDefault(),c()):l.key==="Escape"&&(l.preventDefault(),f()))})})}),document.querySelectorAll(".delete-task-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),u.deleteTask(e.dataset.id)})}),document.querySelectorAll(".reminder-check-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const s=e.dataset.id,a=e.dataset.status==="done"?"todo":"done";u.updateTaskStatus(s,a)})}),document.querySelectorAll(".card-move-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),ut(e,e.dataset.id)})})}function pt(){document.querySelectorAll(".cat-tab").forEach(t=>{t.addEventListener("click",()=>u.setActiveCategory(t.dataset.cat))}),document.querySelectorAll(".cat-tab-wrap").forEach(t=>{const s=t.dataset.cat;t.addEventListener("dragover",a=>{a.preventDefault(),t.classList.add("tab-drop-over")}),t.addEventListener("dragleave",()=>t.classList.remove("tab-drop-over")),t.addEventListener("drop",a=>{a.preventDefault(),t.classList.remove("tab-drop-over");const n=a.dataTransfer.getData("text/plain");n&&s&&u.updateTask(n,{category:s})})}),document.querySelectorAll(".cat-tab-named").forEach(t=>{t.addEventListener("dblclick",s=>{if(s.stopPropagation(),s.preventDefault(),t.querySelector("input"))return;const a=t.dataset.cat,n=document.createElement("input");n.type="text",n.className="cat-tab-edit-input form-input",n.value=a,t.textContent="",t.appendChild(n),n.focus(),n.select();let r=!1;const o=d=>{if(r)return;r=!0;const i=n.value.trim();if(d&&i&&i!==a){const c=u.renameCategory(a,i);c.ok||(c.message&&window.alert(c.message),u.notify())}else u.notify()};n.addEventListener("keydown",d=>{d.isComposing||d.keyCode===229||(d.key==="Enter"?(d.preventDefault(),o(!0)):d.key==="Escape"&&(d.preventDefault(),o(!1)))}),n.addEventListener("blur",()=>o(!0))})}),document.querySelectorAll(".cat-tab-delete").forEach(t=>{t.addEventListener("click",s=>{s.stopPropagation();const a=t.dataset.cat;if(!window.confirm(`'${a}' 탭을 삭제할까요?

이 탭의 할 일은 사라지지 않고 다른 탭으로 옮겨집니다.`))return;const r=u.deleteCategory(a);!r.ok&&r.message&&window.alert(r.message)})});const e=document.getElementById("cat-tab-add-btn");e&&e.addEventListener("click",()=>{if(document.getElementById("cat-tab-add-input"))return;const t=document.createElement("input");t.id="cat-tab-add-input",t.type="text",t.className="cat-tab-edit-input form-input",t.placeholder="새 탭 이름",e.parentNode.insertBefore(t,e),e.style.display="none",t.focus();let s=!1;const a=n=>{if(s)return;s=!0;const r=t.value.trim();if(t.parentNode&&t.remove(),e.style.display="",n&&r){const o=u.addCategory(r);!o.ok&&o.message&&window.alert(o.message)}};t.addEventListener("keydown",n=>{n.isComposing||n.keyCode===229||(n.key==="Enter"?(n.preventDefault(),a(!0)):n.key==="Escape"&&(n.preventDefault(),a(!1)))}),t.addEventListener("blur",()=>a(!0))})}function gt(){const e=document.getElementById("calendar-prev-btn"),t=document.getElementById("calendar-next-btn"),s=document.getElementById("calendar-today-btn");e&&t&&s&&(e.addEventListener("click",()=>{const a=u.getCurrentMonth();u.setCalendarMonth(new Date(a.getFullYear(),a.getMonth()-1,1))}),t.addEventListener("click",()=>{const a=u.getCurrentMonth();u.setCalendarMonth(new Date(a.getFullYear(),a.getMonth()+1,1))}),s.addEventListener("click",()=>u.setCalendarMonth(new Date))),document.querySelectorAll(".calendar-static-input").forEach(a=>{const r=a.closest(".calendar-static-add-container").dataset.date;a.addEventListener("focus",()=>D("calendar-add",r)),a.addEventListener("blur",()=>{setTimeout(()=>{b&&b.type==="calendar-add"&&b.key===r&&document.activeElement!==a&&w()},100)}),a.addEventListener("keydown",o=>{if(!(o.isComposing||o.keyCode===229))if(o.key==="Enter"){o.preventDefault();const d=a.value.trim();if(!d)return;D("calendar-add",r);const{title:i,dueDate:c}=G(d);if(!i)return;u.addTask(i,c||r)}else o.key==="Escape"&&(a.value="",a.blur(),w())})}),document.querySelectorAll(".calendar-inline-edit-pill").forEach(a=>{a.addEventListener("dblclick",n=>{if(n.stopPropagation(),a.querySelector("input"))return;const r=a.dataset.id,o=u.getTasks().find(p=>p.id===r),d=o?o.title:a.textContent.trim(),i=document.createElement("input");i.type="text",i.className="form-input py-0.5 px-1 text-[9px] w-full",i.style.height="16px",i.value=d,a.innerHTML="",a.appendChild(i),i.focus(),i.select();let c=!1;w();const f=()=>{if(c)return;c=!0;const p=i.value.trim();p&&p!==d?u.updateTask(r,{title:p}):u.notify()},l=()=>{c||(c=!0,u.notify())};i.addEventListener("blur",f),i.addEventListener("keydown",p=>{p.isComposing||p.keyCode===229||(p.key==="Enter"?(p.preventDefault(),f()):p.key==="Escape"&&(p.preventDefault(),l()))})})})}function mt(){const e=document.getElementById("dashboard-notepad");e&&e.addEventListener("input",t=>u.saveMemo(t.target.value)),document.querySelectorAll(".btn-quick-done").forEach(t=>{t.addEventListener("click",()=>u.updateTaskStatus(t.dataset.id,"done"))}),document.querySelectorAll(".dash-cat-link").forEach(t=>{t.addEventListener("click",()=>{u.setActiveCategory(t.dataset.cat),u.setView("board")})})}J.addEventListener("click",()=>u.setView("board"));X.addEventListener("click",()=>u.setView("calendar"));Z.addEventListener("click",()=>u.setView("dashboard"));dt.addEventListener("click",()=>{u.getCurrentView()!=="board"?(u.setView("board"),setTimeout(A,50)):A()});function A(){const e=document.querySelector('.static-inline-add[data-status="todo"]'),t=e&&e.querySelector(".static-title-input");t&&(t.focus(),D("board-add","todo"))}const U=document.getElementById("btn-export-data"),W=document.getElementById("btn-import-data"),$=document.getElementById("import-file-input");U&&U.addEventListener("click",()=>{const e=u.exportData(),t=new Blob([e],{type:"application/json"}),s=URL.createObjectURL(t),a=document.createElement("a"),n=new Date().toISOString().split("T")[0];a.href=s,a.download=`졸업칸반-백업-${n}.json`,document.body.appendChild(a),a.click(),document.body.removeChild(a),setTimeout(()=>URL.revokeObjectURL(s),1e3)});W&&$&&(W.addEventListener("click",()=>$.click()),$.addEventListener("change",e=>{const t=e.target.files&&e.target.files[0];if(!t)return;const s=new FileReader;s.onload=a=>{const n=u.importData(a.target.result);n.ok?window.alert(`불러오기 완료! 할 일 ${n.count}개를 가져왔어요.`):window.alert(n.message),$.value=""},s.readAsText(t)}));function V(){const e=document.getElementById("shortcut-help");e&&e.remove()}function vt(){if(document.getElementById("shortcut-help")){V();return}const e=document.createElement("div");e.id="shortcut-help",e.className="shortcut-help-overlay",e.innerHTML=`
    <div class="shortcut-help-card">
      <h3>키보드 단축키</h3>
      <ul class="shortcut-list">
        <li><span><kbd>N</kbd></span> 새 할 일 입력</li>
        <li><span><kbd>1</kbd> ~ <kbd>9</kbd></span> 탭 전환 (1 = 전체)</li>
        <li><span><kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd></span> 보드 · 달력 · 대시보드</li>
        <li><span><kbd>?</kbd></span> 이 도움말 열기/닫기</li>
        <li><span><kbd>Esc</kbd></span> 닫기</li>
      </ul>
      <p class="shortcut-help-note">할 일을 입력·편집하는 중에는 단축키가 잠시 멈춰요.</p>
    </div>`,e.addEventListener("click",t=>{t.target===e&&V()}),document.body.appendChild(e)}document.addEventListener("keydown",e=>{const t=document.activeElement,s=t?t.tagName:"",a=s==="INPUT"||s==="TEXTAREA"||t&&t.isContentEditable;if(e.code==="Escape"){V();return}if(!(a||e.metaKey||e.ctrlKey||e.altKey||e.isComposing))if(e.code==="KeyN")e.preventDefault(),u.getCurrentView()!=="board"?(u.setView("board"),setTimeout(A,60)):A();else if(e.code==="KeyB")u.setView("board");else if(e.code==="KeyC")u.setView("calendar");else if(e.code==="KeyD")u.setView("dashboard");else if(/^Digit[1-9]$/.test(e.code)){const n=parseInt(e.code.replace("Digit",""),10)-1,r=[h,...u.getCategories()];n<r.length&&(u.getCurrentView()!=="board"&&u.setView("board"),u.setActiveCategory(r[n]))}else(e.key==="?"||e.code==="Slash"&&e.shiftKey)&&(e.preventDefault(),vt())});document.addEventListener("DOMContentLoaded",()=>O(u.state));(document.readyState==="interactive"||document.readyState==="complete")&&O(u.state);

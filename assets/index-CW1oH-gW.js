(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const e of s)if(e.type==="childList")for(const c of e.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function a(s){const e={};return s.integrity&&(e.integrity=s.integrity),s.referrerPolicy&&(e.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?e.credentials="include":s.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function r(s){if(s.ep)return;s.ep=!0;const e=a(s);fetch(s.href,e)}})();const $=n=>{const t=new Date;return t.setDate(t.getDate()+n),t.toISOString().split("T")[0]},W=[{id:"task-1",title:"장보기 (계란, 우유, 사료)",dueDate:$(1),status:"todo",category:"일상"},{id:"task-2",title:"주간 운동 3회 채우기",dueDate:$(0),status:"inprogress",category:"일상"},{id:"task-3",title:"칸반 앱 카테고리 탭 기능 마무리",dueDate:$(2),status:"inprogress",category:"개발"},{id:"task-4",title:"GitHub 배포 자동화 스크립트 정리",dueDate:$(3),status:"todo",category:"개발"}],V=["일상","개발"],_={professor:"내 일",graduate:"대학원생"},O=`🗒️ 오늘의 메모 & 주간 브리핑
- 이번 주 안에 끝낼 핵심 할 일 한 가지만 정해두기.
- 탭(일상/개발)은 위쪽 '+ 탭 추가'로 얼마든지 만들 수 있어요.`,h="__all__";class z{constructor(){this.tasksKey="graduate_kanban_tasks_v2",this.viewKey="graduate_kanban_view_v2",this.memoKey="graduate_kanban_memo_v2",this.catKey="graduate_kanban_categories_v2",this.activeCatKey="graduate_kanban_active_category_v2";const t=localStorage.getItem(this.tasksKey);let a=t?JSON.parse(t):W;a=a.map(l=>{if(l.category)return l;const f=_[l.owner]||"일상";return{...l,category:f}});const r=localStorage.getItem(this.catKey);let s=r?JSON.parse(r):null;if(!s||!Array.isArray(s)||s.length===0){const l=[...new Set(a.map(f=>f.category).filter(Boolean))];s=[...new Set([...l,...V])]}const e=localStorage.getItem(this.viewKey)||"board",c=e.startsWith("board")?"board":e,o=localStorage.getItem(this.activeCatKey),d=o&&(o===h||s.includes(o))?o:h;this.state={tasks:a,categories:s,activeCategory:d,currentView:c,currentMonth:new Date,memo:localStorage.getItem(this.memoKey)||O},t||(this.saveTasksToLocalStorage(),localStorage.setItem(this.memoKey,O)),this.saveTasksToLocalStorage(),this.saveCategoriesToLocalStorage(),this.listeners=[]}saveTasksToLocalStorage(){localStorage.setItem(this.tasksKey,JSON.stringify(this.state.tasks))}saveViewToLocalStorage(){localStorage.setItem(this.viewKey,this.state.currentView)}saveCategoriesToLocalStorage(){localStorage.setItem(this.catKey,JSON.stringify(this.state.categories))}saveActiveCategoryToLocalStorage(){localStorage.setItem(this.activeCatKey,this.state.activeCategory)}getTasks(){return[...this.state.tasks]}getCategories(){return[...this.state.categories]}getActiveCategory(){return this.state.activeCategory}getVisibleTasks(){return this.state.activeCategory===h?[...this.state.tasks]:this.state.tasks.filter(t=>t.category===this.state.activeCategory)}getCurrentView(){return this.state.currentView}getCurrentMonth(){return this.state.currentMonth}getMemo(){return this.state.memo}setView(t){["board","calendar","dashboard"].includes(t)&&(this.state.currentView=t,this.saveViewToLocalStorage(),this.notify())}setActiveCategory(t){t!==h&&!this.state.categories.includes(t)||(this.state.activeCategory=t,this.saveActiveCategoryToLocalStorage(),this.notify())}addCategory(t){const a=(t||"").trim();return a?a===h||a==="전체"?{ok:!1,message:"'전체'는 기본 탭이라 추가할 수 없어요."}:this.state.categories.includes(a)?{ok:!1,message:"이미 있는 탭이에요."}:(this.state.categories.push(a),this.saveCategoriesToLocalStorage(),this.state.activeCategory=a,this.saveActiveCategoryToLocalStorage(),this.notify(),{ok:!0}):{ok:!1,message:"탭 이름을 입력해 주세요."}}deleteCategory(t){if(!this.state.categories.includes(t))return{ok:!1};if(this.state.categories.length<=1)return{ok:!1,message:"탭은 최소 한 개는 있어야 해요."};this.state.categories=this.state.categories.filter(r=>r!==t);const a=this.state.categories[0];return this.state.tasks=this.state.tasks.map(r=>r.category===t?{...r,category:a}:r),this.state.activeCategory===t&&(this.state.activeCategory=h,this.saveActiveCategoryToLocalStorage()),this.saveCategoriesToLocalStorage(),this.saveTasksToLocalStorage(),this.notify(),{ok:!0,movedTo:a}}renameCategory(t,a){const r=(a||"").trim();return r?this.state.categories.includes(t)?r===t?{ok:!0}:this.state.categories.includes(r)?{ok:!1,message:"이미 있는 탭 이름이에요."}:(this.state.categories=this.state.categories.map(s=>s===t?r:s),this.state.tasks=this.state.tasks.map(s=>s.category===t?{...s,category:r}:s),this.state.activeCategory===t&&(this.state.activeCategory=r,this.saveActiveCategoryToLocalStorage()),this.saveCategoriesToLocalStorage(),this.saveTasksToLocalStorage(),this.notify(),{ok:!0}):{ok:!1}:{ok:!1,message:"탭 이름을 입력해 주세요."}}setCalendarMonth(t){this.state.currentMonth=t,this.notify()}saveMemo(t){this.state.memo=t,localStorage.setItem(this.memoKey,t)}addTask(t,a="",r=null){const s=r||(this.state.activeCategory!==h?this.state.activeCategory:this.state.categories[0]||"일상"),e={id:`task-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,title:t.trim(),dueDate:a||"",status:"todo",category:s};return this.state.tasks.push(e),this.saveTasksToLocalStorage(),this.notify(),e}updateTask(t,a){this.state.tasks=this.state.tasks.map(r=>r.id===t?{...r,...a}:r),this.saveTasksToLocalStorage(),this.notify()}updateTaskStatus(t,a){["todo","inprogress","done"].includes(a)&&this.updateTask(t,{status:a})}deleteTask(t){this.state.tasks=this.state.tasks.filter(a=>a.id!==t),this.saveTasksToLocalStorage(),this.notify()}exportData(){return JSON.stringify({_app:"graduate-kanban",_version:3,tasks:this.state.tasks,categories:this.state.categories,memo:this.state.memo,currentView:this.state.currentView},null,2)}importData(t){let a;try{a=JSON.parse(t)}catch{return{ok:!1,message:"파일을 읽을 수 없어요. 올바른 백업 파일인지 확인해 주세요."}}if(!a||!Array.isArray(a.tasks))return{ok:!1,message:"이 칸반 백업 파일이 아닌 것 같아요."};const r=a.tasks.map(e=>e.category?e:{...e,category:_[e.owner]||"일상"});let s;if(Array.isArray(a.categories)&&a.categories.length>0)s=[...new Set(a.categories)];else{const e=[...new Set(r.map(c=>c.category).filter(Boolean))];s=[...new Set([...e,...V])]}return this.state.tasks=r,this.state.categories=s,s.includes(this.state.activeCategory)||(this.state.activeCategory=h,this.saveActiveCategoryToLocalStorage()),typeof a.memo=="string"&&(this.state.memo=a.memo),this.saveTasksToLocalStorage(),this.saveCategoriesToLocalStorage(),localStorage.setItem(this.memoKey,this.state.memo),this.notify(),{ok:!0,count:r.length}}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(a=>a!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const u=new z;function H(n){if(!n)return{class:"due-none",text:"기한 없음"};const t=new Date;t.setHours(0,0,0,0);const a=new Date(n);a.setHours(0,0,0,0);const r=a-t,s=Math.ceil(r/(1e3*60*60*24));if(s<0)return{class:"due-overdue",text:`지연 D+${Math.abs(s)}`};if(s===0)return{class:"due-overdue",text:"오늘"};if(s===1)return{class:"due-soon",text:"내일"};if(s===2)return{class:"due-soon",text:"모레"};{const e=n.split("-");return{class:"due-normal",text:`${e.length===3?`${parseInt(e[1])}/${parseInt(e[2])}`:n} (D-${s})`}}}function Z(){const n=u.getCategories(),t=u.getActiveCategory();return`
    <div class="category-tabs" role="tablist">
      <button class="cat-tab ${t===h?"active":""}" data-cat="${h}" role="tab">
        전체
      </button>
      ${n.map(r=>{const s=t===r?"active":"",e=M(r);return`
          <span class="cat-tab-wrap ${s}">
            <button class="cat-tab cat-tab-named ${s}" data-cat="${e}" role="tab" title="더블클릭하면 이름을 바꿀 수 있어요">
              ${e}
            </button>
            <button class="cat-tab-delete" data-cat="${e}" title="'${e}' 탭 삭제" aria-label="탭 삭제">
              <i data-lucide="x" class="w-3 h-3"></i>
            </button>
          </span>
        `}).join("")}
      <button class="cat-tab-add" id="cat-tab-add-btn" title="새 탭 추가">
        <i data-lucide="plus" class="w-3 h-3"></i>
        <span>탭 추가</span>
      </button>
    </div>
  `}function Q(){const n=u.getVisibleTasks(),t=u.getActiveCategory()===h,a={todo:{title:"To Do",icon:"circle",colorClass:"col-todo",iconColor:"text-mute",tasks:[]},inprogress:{title:"In Progress",icon:"play",colorClass:"col-inprogress",iconColor:"text-accent",tasks:[]},done:{title:"Done",icon:"check-circle",colorClass:"col-done",iconColor:"text-violet",tasks:[]}};return n.forEach(r=>{a[r.status]&&a[r.status].tasks.push(r)}),`
    ${Z()}
    <div class="board-grid">
      ${Object.entries(a).map(([r,s])=>`
          <div class="${`board-column ${s.colorClass}`}" data-status="${r}">
            <!-- Column Header -->
            <div class="column-header">
              <h2 class="column-title">
                <i data-lucide="${s.icon}" class="w-3.5 h-3.5 ${s.iconColor}"></i>
                <span>${s.title}</span>
                <span class="column-badge">${s.tasks.length}</span>
              </h2>
            </div>

            <!-- Cards Drop Area (Apple Reminders slim list) -->
            <div class="column-cards-area" data-status="${r}">
              ${s.tasks.length===0?`
                <div class="empty-state">
                  <span>비어 있음</span>
                </div>
              `:s.tasks.map(c=>{const o=H(c.dueDate),d=c.status==="done",l=c.status==="inprogress",f="task-card card-reminder",i=d?"task-card-title inline-edit-title line-through":"task-card-title inline-edit-title",v=d?"text-mute":o.class;let p="circle",g="text-mute";d?(p="check-circle-2",g="text-violet"):l&&(p="play-circle",g="text-accent");const y=M(c.title),m=t&&c.category?`<span class="card-category-badge">${M(c.category)}</span>`:"";return`
                  <div class="${f}" draggable="true" data-id="${c.id}">
                    <!-- Left Slot: Check Circle + Title -->
                    <div class="reminder-left-slot">
                      <button class="reminder-check-btn" data-id="${c.id}" data-status="${c.status}" title="상태 토글">
                        <i data-lucide="${p}" class="w-4 h-4 ${g}"></i>
                      </button>

                      <div class="${i}" data-id="${c.id}" title="${y} (더블 클릭하여 수정)">
                        ${y}
                        ${m}
                      </div>
                    </div>

                    <!-- Right Slot: Due Date Badge & Delete Action -->
                    <div class="reminder-right-slot">
                      <div class="task-card-due ${v}" data-id="${c.id}" title="클릭하여 마감일 수정">
                        <i data-lucide="calendar" class="w-2.5 h-2.5"></i>
                        <span class="due-text">${o.text}</span>
                      </div>

                      <button class="card-action-btn delete-task-btn" data-id="${c.id}" title="할 일 삭제" aria-label="할 일 삭제">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>
                `}).join("")}
            </div>

            <!-- Static Zero-Click Inline Addition Input -->
            <div class="static-inline-add mt-2" data-status="${r}">
              <input
                type="text"
                class="static-title-input form-input"
                placeholder="+ 할 일 입력 (예: 동물병원 6/17)"
                autocomplete="off"
              />
            </div>

          </div>
        `).join("")}
    </div>
  `}function M(n){return String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function X(){const n=u.getCurrentMonth(),t=n.getFullYear(),a=n.getMonth(),r=u.getTasks(),s=new Date(t,a,1).getDay(),e=new Date(t,a+1,0).getDate(),c=new Date(t,a,0).getDate(),o=new Date;o.setHours(0,0,0,0);const d=[];for(let p=s-1;p>=0;p--){const g=new Date(t,a-1,c-p);d.push({date:g,isCurrentMonth:!1,dayNumber:c-p})}for(let p=1;p<=e;p++){const g=new Date(t,a,p),y=g.toDateString()===o.toDateString();d.push({date:g,isCurrentMonth:!0,isToday:y,dayNumber:p})}const f=42-d.length;for(let p=1;p<=f;p++){const g=new Date(t,a+1,p);d.push({date:g,isCurrentMonth:!1,dayNumber:p})}return`
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
        ${d.map(p=>{const g=p.date.toISOString().split("T")[0],y=r.filter(m=>m.dueDate===g);return`
            <div class="calendar-day-cell ${p.isCurrentMonth?"":"other-month"} ${p.isToday?"today":""}" data-date="${g}">
              <div class="day-number-container">
                <span class="day-number">${p.dayNumber}</span>
              </div>
              
              <!-- Tasks due on this day -->
              <div class="day-tasks-container">
                ${y.map(m=>{const x=m.status==="done",B=new Date(m.dueDate);B.setHours(0,0,0,0);const J=B-o,N=Math.ceil(J/(1e3*60*60*24));let E=`status-${m.status}`;x?E+=" status-done":N<0?E+=" pill-overdue":N<=1&&(E+=" pill-soon");const Y=m.category?`[${I(m.category)}] `:"";return`
                    <div class="calendar-task-pill ${E} calendar-inline-edit-pill" data-id="${m.id}" title="${Y}${I(m.title)}">
                      ${I(m.title)}
                    </div>
                  `}).join("")}
              </div>
              
              <!-- Calendar Static Zero-Click Inline Addition Input (Always Visible) -->
              <div class="calendar-static-add-container mt-1.5" data-date="${g}">
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
  `}function I(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function tt(){const n=u.getTasks(),t=u.getCategories(),a=u.getMemo(),r=n.length,s=n.filter(i=>i.status==="done").length,e=n.filter(i=>i.status==="inprogress").length,c=r>0?Math.round(s/r*100):0,o=new Date;o.setHours(0,0,0,0);const d=i=>{if(i.status==="done"||!i.dueDate)return!1;const v=new Date(i.dueDate);return v.setHours(0,0,0,0),v<=o},l=n.filter(d).sort((i,v)=>new Date(i.dueDate)-new Date(v.dueDate)),f=t.map(i=>{const v=n.filter(x=>x.category===i),p=v.length,g=v.filter(x=>x.status==="done").length,y=v.filter(x=>x.status==="inprogress").length,m=p>0?Math.round(g/p*100):0;return{cat:i,total:p,done:g,inprogress:y,rate:m}});return`
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
            <div class="text-2xl font-semibold text-ink">${c}% <span class="text-xs text-mute font-normal">완료율</span></div>
            <div class="text-xs text-mute font-mono">진행 ${e} 건 / 전체 ${r} 건</div>
          </div>
          <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border mt-1">
            <div class="h-full transition-all duration-500" style="width: ${c}%; background: var(--color-accent); border-radius: 9999px;"></div>
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
            <div class="text-2xl font-semibold text-ink" style="color:var(--color-error)">${l.length} <span class="text-xs text-mute font-normal">건</span></div>
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
            ${t.map(i=>`<span class="card-category-badge dash-cat-link" data-cat="${w(i)}" style="cursor:pointer;">${w(i)}</span>`).join("")}
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
          ${f.map(i=>`
            <div class="cat-progress-item dash-cat-link" data-cat="${w(i.cat)}" title="'${w(i.cat)}' 탭으로 이동" style="cursor:pointer;">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-medium text-ink">${w(i.cat)}</span>
                <span class="text-[10px] font-mono text-mute">${i.rate}% · ${i.done}/${i.total}</span>
              </div>
              <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border">
                <div class="h-full transition-all duration-500" style="width: ${i.rate}%; background: #7928ca; border-radius: 9999px;"></div>
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
              ${l.length}
            </span>
          </div>

          <div class="urgent-list flex flex-col gap-2">
            ${l.length===0?`
              <div class="empty-state border border-dashed border-border py-6 text-center text-xs text-mute rounded-lg" style="background: var(--color-canvas-soft); font-size:11px;">
                ✨ 오늘 지연되거나 조치가 필요한 긴급 할 일이 없습니다.
              </div>
            `:l.map(i=>{const v=H(i.dueDate),p=i.category?`<span class="card-category-badge dash-cat-link" data-cat="${w(i.category)}" style="cursor:pointer;">${w(i.category)}</span>`:"";return`
                <div class="urgent-item bg-canvas border border-border rounded-md p-3 flex items-center justify-between transition-all hover:border-border-strong" style="border-left: 3px solid var(--color-error);">
                  <div class="flex flex-col gap-1 pr-3 flex-1">
                    <div class="text-[11px] font-medium text-ink line-clamp-1">${w(i.title)} ${p}</div>
                    <div class="text-[9px] font-mono text-error font-semibold" style="color:var(--color-error)">${v.text}</div>
                  </div>
                  <div class="flex items-center gap-1">
                    <button class="btn-quick-inprogress btn-secondary px-2 py-0.5 text-[9px] rounded" data-id="${i.id}">진행</button>
                    <button class="btn-quick-done btn-primary px-2 py-0.5 text-[9px] rounded" data-id="${i.id}">완료</button>
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
            >${w(a)}</textarea>
            <div class="flex items-center justify-end text-[10px] text-mute font-mono pt-2 border-t border-border">
              <i data-lucide="cloud-lightning" class="w-3 h-3 mr-1 text-accent"></i>
              <span>Typing auto-saves in local storage</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `}function w(n){return String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function S(n){if(!n)return null;n=n.trim().toLowerCase();const t=new Date;if(t.setHours(0,0,0,0),/^(오늘|금일|today|d-day|dday)$/.test(n))return b(t);if(/^(내일|명일|tomorrow)$/.test(n))return b(C(t,1));if(/^(모레|내일모레|글피)$/.test(n))return b(C(t,2));if(/^(어제|작일|yesterday)$/.test(n))return b(C(t,-1));let a=n.match(/^(\d+)\s*일\s*(뒤|후|후에|이후)$/);if(a||(a=n.match(/^(\d+)\s*days?\s*(after|later)$/),a))return b(C(t,parseInt(a[1])));if(a=n.match(/^(\d+)\s*일\s*(전|전에|이전)$/),a)return b(C(t,-parseInt(a[1])));if(a=n.match(/^(이번주|다음주)?\s*(월|화|수|목|금|토|일)요일?$/),a){const s=a[1]==="다음주",e=a[2],o=["일","월","화","수","목","금","토"].indexOf(e),d=t.getDay();let l=o-d;return(s||l<=0)&&(l+=7),b(C(t,l))}if(a=n.match(/^(\d{1,2})\s*[월/\-.]\s*(\d{1,2})\s*일?$/),a){const s=parseInt(a[1])-1,e=parseInt(a[2]),c=new Date(t.getFullYear(),s,e);return b(c)}const r=Date.parse(n);return isNaN(r)?null:b(new Date(r))}function C(n,t){const a=new Date(n);return a.setDate(a.getDate()+t),a}function b(n){const t=n.getFullYear(),a=String(n.getMonth()+1).padStart(2,"0"),r=String(n.getDate()).padStart(2,"0");return`${t}-${a}-${r}`}function K(n){if(!n)return{title:"",dueDate:""};const t=/(?:^|\s)(오늘|금일|내일|명일|모레|어제|글피|today|tomorrow|yesterday)(?:까지|에|이|가|\s|$)/i,a=/(?:^|\s)((?:이번주|다음주)?\s*[월화수목금토일]요일)(?:까지|에|이|가|\s|$)/,r=new RegExp("(?<!\\d)(\\d{1,2}\\s*월\\s*\\d{1,2}\\s*일?)(?:까지|에|이|가|\\s|$)"),s=new RegExp("(?<!\\d)(\\d{1,2}[/\\-.]\\d{1,2})(?:일|요일|까지|에|이|가|\\s|$)"),e=new RegExp("(?<!\\d)(\\d{4}[/\\-.]\\d{1,2}[/\\-.]\\d{1,2})(?:까지|에|이|가|\\s|$)");let c="",o=n,d=o.match(e);if(d){const l=d[0].trim(),f=d[1].trim(),i=S(f);i&&(c=i,o=o.replace(l,"").trim())}if(!c&&(d=o.match(r)||o.match(s),d)){const l=d[0].trim(),f=d[1].trim(),i=S(f);i&&(c=i,o=o.replace(l,"").trim())}if(!c&&(d=o.match(a),d)){const l=d[0].trim(),f=d[1].trim(),i=S(f);i&&(c=i,o=o.replace(l,"").trim())}if(!c&&(d=o.match(t),d)){const l=d[0].trim(),f=d[1].trim(),i=S(f);i&&(c=i,o=o.replace(l,"").trim())}return o=o.replace(/\s+/g," ").trim(),o=o.replace(/^(까지|에|은|는|이|가|까지의)\s+/,""),o=o.replace(/\s+(까지|e|에|은|는|이|가|까지의)$/,""),o=o.trim(),{title:o,dueDate:c}}const A=document.getElementById("app-content"),F=document.getElementById("btn-board-view"),U=document.getElementById("btn-calendar-view"),G=document.getElementById("btn-dashboard-view"),et=document.getElementById("btn-add-task");let k=null;function q(n){const t=n.currentView;F.classList.toggle("active",t==="board"),U.classList.toggle("active",t==="calendar"),G.classList.toggle("active",t==="dashboard"),t==="calendar"?(A.innerHTML=X(),nt()):t==="dashboard"?(A.innerHTML=tt(),ot()):(A.innerHTML=Q(),st(),rt()),window.lucide&&window.lucide.createIcons(),at()}u.subscribe(q);function T(n,t){k={type:n,key:t}}function D(){k=null}function at(){if(!k)return;const{type:n,key:t}=k;if(n==="board-add"&&u.getCurrentView()==="board"){const a=document.querySelector(`.static-inline-add[data-status="${t}"]`);if(a){const r=a.querySelector(".static-title-input");r&&r.focus()}}else if(n==="calendar-add"&&u.getCurrentView()==="calendar"){const a=document.querySelector(`.calendar-static-add-container[data-date="${t}"]`);if(a){const r=a.querySelector(".calendar-static-input");r&&r.focus()}}}function st(){const n=document.querySelectorAll(".task-card"),t=document.querySelectorAll(".board-column");n.forEach(e=>{e.addEventListener("dragstart",c=>{if(e.querySelector("input")){c.preventDefault();return}c.dataTransfer.setData("text/plain",e.dataset.id),setTimeout(()=>e.classList.add("dragging"),0)}),e.addEventListener("dragend",()=>{e.classList.remove("dragging")})}),t.forEach(e=>{e.addEventListener("dragover",c=>{c.preventDefault(),e.classList.add("drag-over")}),e.addEventListener("dragleave",()=>{e.classList.remove("drag-over")}),e.addEventListener("drop",c=>{c.preventDefault(),e.classList.remove("drag-over");const o=c.dataTransfer.getData("text/plain"),d=e.dataset.status;o&&d&&u.updateTask(o,{status:d})})}),document.querySelectorAll(".static-inline-add .static-title-input").forEach(e=>{const o=e.closest(".static-inline-add").dataset.status;e.addEventListener("focus",()=>{T("board-add",o)}),e.addEventListener("blur",()=>{setTimeout(()=>{k&&k.type==="board-add"&&k.key===o&&document.activeElement!==e&&D()},100)}),e.addEventListener("keydown",d=>{if(!(d.isComposing||d.keyCode===229))if(d.key==="Enter"){d.preventDefault();const l=e.value.trim();if(!l)return;T("board-add",o);const{title:f,dueDate:i}=K(l);if(!f)return;const v=u.addTask(f,i);o!=="todo"&&u.updateTaskStatus(v.id,o)}else d.key==="Escape"&&(e.value="",e.blur(),D())})}),document.querySelectorAll(".inline-edit-title").forEach(e=>{e.addEventListener("dblclick",c=>{if(c.stopPropagation(),e.querySelector("input"))return;const o=e.dataset.id,d=u.getTasks().find(g=>g.id===o),l=d?d.title:e.textContent.trim(),f=document.createElement("input");f.type="text",f.className="form-input py-1 px-1.5 text-xs w-full",f.style.fontFamily="inherit",f.value=l,e.innerHTML="",e.appendChild(f),f.focus(),f.select();let i=!1;D();const v=()=>{if(i)return;i=!0;const g=f.value.trim();g&&g!==l?u.updateTask(o,{title:g}):e.textContent=l},p=()=>{i||(i=!0,e.textContent=l)};f.addEventListener("blur",v),f.addEventListener("keydown",g=>{g.isComposing||g.keyCode===229||(g.key==="Enter"?(g.preventDefault(),v()):g.key==="Escape"&&(g.preventDefault(),p()))})})}),document.querySelectorAll(".inline-edit-due, .task-card-due").forEach(e=>{e.addEventListener("click",c=>{if(c.stopPropagation(),e.querySelector("input"))return;const o=e.dataset.id,d=e.querySelector(".due-text"),l=u.getTasks().find(m=>m.id===o),f=l?l.dueDate:d?d.textContent.trim():"",i=document.createElement("input");i.type="text",i.className="form-input py-0.5 px-1 text-[11px] font-mono",i.style.width="140px",i.style.display="inline-block",i.placeholder="예: 오늘, 내일, 6/17",i.value=f;const v=e.querySelector("i");v&&(v.style.display="none"),d&&(d.style.display="none"),e.appendChild(i),i.focus(),i.select();let p=!1;D();const g=()=>{if(p)return;p=!0;const m=i.value.trim();if(m){const x=S(m)||m;u.updateTask(o,{dueDate:x})}else u.updateTask(o,{dueDate:""})},y=()=>{p||(p=!0,v&&(v.style.display=""),d&&(d.style.display=""),i.remove())};i.addEventListener("blur",g),i.addEventListener("keydown",m=>{m.isComposing||m.keyCode===229||(m.key==="Enter"?(m.preventDefault(),g()):m.key==="Escape"&&(m.preventDefault(),y()))})})}),document.querySelectorAll(".delete-task-btn").forEach(e=>{e.addEventListener("click",c=>{c.stopPropagation(),u.deleteTask(e.dataset.id)})}),document.querySelectorAll(".reminder-check-btn").forEach(e=>{e.addEventListener("click",c=>{c.stopPropagation();const o=e.dataset.id,l=e.dataset.status==="done"?"todo":"done";u.updateTaskStatus(o,l)})})}function rt(){document.querySelectorAll(".cat-tab").forEach(t=>{t.addEventListener("click",()=>{u.setActiveCategory(t.dataset.cat)})}),document.querySelectorAll(".cat-tab-named").forEach(t=>{t.addEventListener("dblclick",a=>{if(a.stopPropagation(),a.preventDefault(),t.querySelector("input"))return;const r=t.dataset.cat,s=document.createElement("input");s.type="text",s.className="cat-tab-edit-input form-input",s.value=r,t.textContent="",t.appendChild(s),s.focus(),s.select();let e=!1;const c=o=>{if(e)return;e=!0;const d=s.value.trim();if(o&&d&&d!==r){const l=u.renameCategory(r,d);!l.ok&&l.message&&(window.alert(l.message),t.textContent=r)}else t.textContent=r};s.addEventListener("keydown",o=>{o.isComposing||o.keyCode===229||(o.key==="Enter"?(o.preventDefault(),c(!0)):o.key==="Escape"&&(o.preventDefault(),c(!1)))}),s.addEventListener("blur",()=>c(!0))})}),document.querySelectorAll(".cat-tab-delete").forEach(t=>{t.addEventListener("click",a=>{a.stopPropagation();const r=u.deleteCategory(t.dataset.cat);!r.ok&&r.message&&window.alert(r.message)})});const n=document.getElementById("cat-tab-add-btn");n&&n.addEventListener("click",()=>{if(document.getElementById("cat-tab-add-input"))return;const t=document.createElement("input");t.id="cat-tab-add-input",t.type="text",t.className="cat-tab-edit-input form-input",t.placeholder="새 탭 이름",n.parentNode.insertBefore(t,n),n.style.display="none",t.focus();let a=!1;const r=s=>{if(a)return;a=!0;const e=t.value.trim();if(t.parentNode&&t.remove(),n.style.display="",s&&e){const c=u.addCategory(e);!c.ok&&c.message&&window.alert(c.message)}};t.addEventListener("keydown",s=>{s.isComposing||s.keyCode===229||(s.key==="Enter"?(s.preventDefault(),r(!0)):s.key==="Escape"&&(s.preventDefault(),r(!1)))}),t.addEventListener("blur",()=>r(!0))})}function nt(){const n=document.getElementById("calendar-prev-btn"),t=document.getElementById("calendar-next-btn"),a=document.getElementById("calendar-today-btn");n&&t&&a&&(n.addEventListener("click",()=>{const e=u.getCurrentMonth();u.setCalendarMonth(new Date(e.getFullYear(),e.getMonth()-1,1))}),t.addEventListener("click",()=>{const e=u.getCurrentMonth();u.setCalendarMonth(new Date(e.getFullYear(),e.getMonth()+1,1))}),a.addEventListener("click",()=>{u.setCalendarMonth(new Date)})),document.querySelectorAll(".calendar-static-input").forEach(e=>{const o=e.closest(".calendar-static-add-container").dataset.date;e.addEventListener("focus",()=>{T("calendar-add",o)}),e.addEventListener("blur",()=>{setTimeout(()=>{k&&k.type==="calendar-add"&&k.key===o&&document.activeElement!==e&&D()},100)}),e.addEventListener("keydown",d=>{if(!(d.isComposing||d.keyCode===229))if(d.key==="Enter"){d.preventDefault();const l=e.value.trim();if(!l)return;T("calendar-add",o);const{title:f,dueDate:i}=K(l);if(!f)return;u.addTask(f,i||o)}else d.key==="Escape"&&(e.value="",e.blur(),D())})}),document.querySelectorAll(".calendar-inline-edit-pill").forEach(e=>{e.addEventListener("dblclick",c=>{if(c.stopPropagation(),e.querySelector("input"))return;const o=e.dataset.id,d=u.getTasks().find(g=>g.id===o),l=d?d.title:e.textContent.trim(),f=document.createElement("input");f.type="text",f.className="form-input py-0.5 px-1 text-[9px] w-full",f.style.height="16px",f.value=l,e.innerHTML="",e.appendChild(f),f.focus(),f.select();let i=!1;D();const v=()=>{if(i)return;i=!0;const g=f.value.trim();g&&g!==l?u.updateTask(o,{title:g}):u.notify()},p=()=>{i||(i=!0,u.notify())};f.addEventListener("blur",v),f.addEventListener("keydown",g=>{g.isComposing||g.keyCode===229||(g.key==="Enter"?(g.preventDefault(),v()):g.key==="Escape"&&(g.preventDefault(),p()))})})})}function ot(){const n=document.getElementById("dashboard-notepad");n&&n.addEventListener("input",t=>{u.saveMemo(t.target.value)}),document.querySelectorAll(".btn-quick-inprogress").forEach(t=>{t.addEventListener("click",()=>{u.updateTaskStatus(t.dataset.id,"inprogress")})}),document.querySelectorAll(".btn-quick-done").forEach(t=>{t.addEventListener("click",()=>{u.updateTaskStatus(t.dataset.id,"done")})}),document.querySelectorAll(".dash-cat-link").forEach(t=>{t.addEventListener("click",()=>{u.setActiveCategory(t.dataset.cat),u.setView("board")})})}F.addEventListener("click",()=>u.setView("board"));U.addEventListener("click",()=>u.setView("calendar"));G.addEventListener("click",()=>u.setView("dashboard"));et.addEventListener("click",()=>{u.getCurrentView()!=="board"?(u.setView("board"),setTimeout(j,50)):j()});function j(){const n=document.querySelector('.static-inline-add[data-status="todo"]');if(n){const t=n.querySelector(".static-title-input");t&&(t.focus(),T("board-add","todo"))}}const R=document.getElementById("btn-export-data"),P=document.getElementById("btn-import-data"),L=document.getElementById("import-file-input");R&&R.addEventListener("click",()=>{const n=u.exportData(),t=new Blob([n],{type:"application/json"}),a=URL.createObjectURL(t),r=document.createElement("a"),s=new Date().toISOString().split("T")[0];r.href=a,r.download=`졸업칸반-백업-${s}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),setTimeout(()=>URL.revokeObjectURL(a),1e3)});P&&L&&(P.addEventListener("click",()=>L.click()),L.addEventListener("change",n=>{const t=n.target.files&&n.target.files[0];if(!t)return;const a=new FileReader;a.onload=r=>{const s=u.importData(r.target.result);s.ok?window.alert(`불러오기 완료! 할 일 ${s.count}개를 가져왔어요.`):window.alert(s.message),L.value=""},a.readAsText(t)}));document.addEventListener("DOMContentLoaded",()=>{q(u.state)});(document.readyState==="interactive"||document.readyState==="complete")&&q(u.state);

(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const m of o.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&r(m)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const L=a=>{const e=new Date;return e.setDate(e.getDate()+a),e.toISOString().split("T")[0]},J=[{id:"task-user-1",title:"👑 2026학년도 1학기 연구실 연간 국가 R&D 연구 계획서 최종 승인 및 부서 보고",dueDate:L(1),status:"inprogress",owner:"professor"},{id:"task-user-2",title:"👑 가을 학회 제출용 인공지능 모델 융합 특허 출원서 명세서 초안 작성",dueDate:L(3),status:"todo",owner:"professor"},{id:"task-1",title:"연구실 주간 학술 세미나 발표 자료 (PPT) 준비",dueDate:L(2),status:"todo",owner:"graduate"},{id:"task-2",title:"GPU 서버 기반 딥러닝 모델 에포크(Epoch) 성능 측정 실험",dueDate:L(0),status:"inprogress",owner:"graduate"},{id:"task-3",title:"KCC 학회 투고 논문 1차 피드백 검토 및 영문 초록 수정",dueDate:L(3),status:"todo",owner:"graduate"},{id:"task-4",title:"학부 컴퓨터 개론 프로그래밍 과제 2차 조교 채점 완료",dueDate:L(-2),status:"done",owner:"graduate"}],U=`🎓 오늘의 다짐 & 주간 브리핑 메모
- 이번 주 금요일까지 딥러닝 실험 그래프 추출 완료하기.
- 지도교수님 면담 준비: 학회 피드백 정리본 지참할 것.`;class W{constructor(){this.tasksKey="graduate_kanban_tasks_v2",this.viewKey="graduate_kanban_view_v2",this.memoKey="graduate_kanban_memo_v2";const e=localStorage.getItem(this.tasksKey);this.state={tasks:e?JSON.parse(e):J,currentView:localStorage.getItem(this.viewKey)||"board_dual",currentMonth:new Date,memo:localStorage.getItem(this.memoKey)||U},e||(this.saveTasksToLocalStorage(),localStorage.setItem(this.memoKey,U)),this.listeners=[]}saveTasksToLocalStorage(){localStorage.setItem(this.tasksKey,JSON.stringify(this.state.tasks))}saveViewToLocalStorage(){localStorage.setItem(this.viewKey,this.state.currentView)}getTasks(){return[...this.state.tasks]}getCurrentView(){return this.state.currentView}getCurrentMonth(){return this.state.currentMonth}getMemo(){return this.state.memo}setView(e){["board_dual","board_grad","board_prof","calendar","dashboard"].includes(e)&&(this.state.currentView=e,this.saveViewToLocalStorage(),this.notify())}setCalendarMonth(e){this.state.currentMonth=e,this.notify()}saveMemo(e){this.state.memo=e,localStorage.setItem(this.memoKey,e)}addTask(e,s="",r="graduate"){const n={id:`task-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,title:e.trim(),dueDate:s||"",status:"todo",owner:r};return this.state.tasks.push(n),this.saveTasksToLocalStorage(),this.notify(),n}updateTask(e,s){this.state.tasks=this.state.tasks.map(r=>r.id===e?{...r,...s}:r),this.saveTasksToLocalStorage(),this.notify()}updateTaskStatus(e,s){["todo","inprogress","done"].includes(s)&&this.updateTask(e,{status:s})}deleteTask(e){this.state.tasks=this.state.tasks.filter(s=>s.id!==e),this.saveTasksToLocalStorage(),this.notify()}exportData(){return JSON.stringify({_app:"graduate-kanban",_version:2,tasks:this.state.tasks,memo:this.state.memo,currentView:this.state.currentView},null,2)}importData(e){let s;try{s=JSON.parse(e)}catch{return{ok:!1,message:"파일을 읽을 수 없어요. 올바른 백업 파일인지 확인해 주세요."}}return!s||!Array.isArray(s.tasks)?{ok:!1,message:"이 칸반 백업 파일이 아닌 것 같아요."}:(this.state.tasks=s.tasks,typeof s.memo=="string"&&(this.state.memo=s.memo),this.saveTasksToLocalStorage(),localStorage.setItem(this.memoKey,this.state.memo),this.notify(),{ok:!0,count:s.tasks.length})}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(s=>s!==e)}}notify(){this.listeners.forEach(e=>e(this.state))}}const f=new W;function R(a){if(!a)return{class:"due-none",text:"기한 없음"};const e=new Date;e.setHours(0,0,0,0);const s=new Date(a);s.setHours(0,0,0,0);const r=s-e,n=Math.ceil(r/(1e3*60*60*24));if(n<0)return{class:"due-overdue",text:`지연 D+${Math.abs(n)}`};if(n===0)return{class:"due-overdue",text:"오늘"};if(n===1)return{class:"due-soon",text:"내일"};if(n===2)return{class:"due-soon",text:"모레"};{const o=a.split("-");return{class:"due-normal",text:`${o.length===3?`${parseInt(o[1])}/${parseInt(o[2])}`:a} (D-${n})`}}}function O(a="graduate",e="light"){const s=f.getTasks().filter(m=>m.owner===a),r=e==="dark",n=r?"board-column theme-dark":"board-column",o={todo:{title:"To Do",icon:"circle",colorClass:r?"col-todo-dark":"col-todo",iconColor:"text-mute",tasks:[]},inprogress:{title:"In Progress",icon:"play",colorClass:r?"col-inprogress-dark":"col-inprogress",iconColor:"text-accent",tasks:[]},done:{title:"Done",icon:"check-circle",colorClass:r?"col-done-dark":"col-done",iconColor:"text-violet",tasks:[]}};return s.forEach(m=>{o[m.status]&&o[m.status].tasks.push(m)}),`
    <div class="board-grid">
      ${Object.entries(o).map(([m,c])=>`
          <div class="${`${n} ${c.colorClass}`}" data-status="${m}" data-owner="${a}">
            <!-- Column Header -->
            <div class="column-header">
              <h2 class="column-title">
                <i data-lucide="${c.icon}" class="w-3.5 h-3.5 ${c.iconColor}"></i>
                <span>${c.title}</span>
                <span class="column-badge">${c.tasks.length}</span>
              </h2>
            </div>
            
            <!-- Cards Drop Area (Now an Apple Reminders slim list) -->
            <div class="column-cards-area" data-status="${m}" data-owner="${a}">
              ${c.tasks.length===0?`
                <div class="empty-state">
                  <span>비어 있음</span>
                </div>
              `:c.tasks.map(d=>{const u=R(d.dueDate),p=d.status==="done",g=d.status==="inprogress",v=r?"task-card card-reminder card-dark":"task-card card-reminder",l=p?"task-card-title inline-edit-title line-through":"task-card-title inline-edit-title";let b=p?"text-mute":u.class;r&&!p&&u.class!=="due-none"&&(b=`${u.class}-dark`);let i="circle",h="text-mute";p?(i="check-circle-2",h="text-violet"):g&&(i="play-circle",h="text-accent");const x=Q(d.title);return`
                  <div class="${v}" draggable="true" data-id="${d.id}" data-owner="${a}">
                    <!-- Left Slot: Reminders Radio Circle + Dynamic Title -->
                    <div class="reminder-left-slot">
                      <button class="reminder-check-btn" data-id="${d.id}" data-status="${d.status}" title="상태 토글">
                        <i data-lucide="${i}" class="w-4 h-4 ${h}"></i>
                      </button>
                      
                      <!-- Double Click to Edit Title Inline & Hover to show full title -->
                      <div class="${l}" data-id="${d.id}" title="${x} (더블 클릭하여 수정)">
                        ${x}
                      </div>
                    </div>
                    
                    <!-- Right Slot: Due Date Badge & Delete Action -->
                    <div class="reminder-right-slot">
                      <!-- Click to Edit Due Date Inline -->
                      <div class="task-card-due ${b}" data-id="${d.id}" title="클릭하여 마감일 수정">
                        <i data-lucide="calendar" class="w-2.5 h-2.5"></i>
                        <span class="due-text">${u.text}</span>
                      </div>
                      
                      <button class="card-action-btn delete-task-btn" data-id="${d.id}" title="할 일 삭제" aria-label="할 일 삭제">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>
                `}).join("")}
            </div>
            
            <!-- Static Zero-Click Inline Addition Input at Column Bottom -->
            <div class="static-inline-add mt-2" data-status="${m}" data-owner="${a}">
              <input 
                type="text" 
                class="static-title-input form-input" 
                placeholder="+ 미리알림 입력..." 
                autocomplete="off"
              />
            </div>
            
          </div>
        `).join("")}
    </div>
  `}function Z(){return`
    <div class="dual-board-container">
      <!-- Left Pane: Graduate Lab Board (Light Stark) -->
      <div class="dual-board-pane">
        <div class="dual-board-pane-header">
          <div class="flex items-center space-x-2">
            <span class="text-lg">🎓</span>
            <span class="pane-title">대학원생 연구 미리알림</span>
            <span class="pane-subtitle">Graduate Lab (Stark Light)</span>
          </div>
        </div>
        <div class="pane-content">
          ${O("graduate","light")}
        </div>
      </div>
      
      <!-- Right Pane: Professor Personal Board (Dark Stark) -->
      <div class="dual-board-pane pane-dark">
        <div class="dual-board-pane-header">
          <div class="flex items-center space-x-2">
            <span class="text-lg">👑</span>
            <span class="pane-title">내 전용 미리알림</span>
            <span class="pane-subtitle">Professor Personal (Stark Dark)</span>
          </div>
        </div>
        <div class="pane-content">
          ${O("professor","dark")}
        </div>
      </div>
    </div>
  `}function Q(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function X(){const a=f.getCurrentMonth(),e=a.getFullYear(),s=a.getMonth(),r=f.getTasks(),n=new Date(e,s,1).getDay(),o=new Date(e,s+1,0).getDate(),m=new Date(e,s,0).getDate(),c=new Date;c.setHours(0,0,0,0);const t=[];for(let v=n-1;v>=0;v--){const l=new Date(e,s-1,m-v);t.push({date:l,isCurrentMonth:!1,dayNumber:m-v})}for(let v=1;v<=o;v++){const l=new Date(e,s,v),b=l.toDateString()===c.toDateString();t.push({date:l,isCurrentMonth:!0,isToday:b,dayNumber:v})}const u=42-t.length;for(let v=1;v<=u;v++){const l=new Date(e,s+1,v);t.push({date:l,isCurrentMonth:!1,dayNumber:v})}return`
    <div class="calendar-view">
      <!-- Calendar Navigation Header -->
      <div class="calendar-header">
        <h2 class="calendar-month-title">${`${e}년 ${["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"][s]}`}</h2>
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
        ${t.map(v=>{const l=v.date.toISOString().split("T")[0],b=r.filter(i=>i.dueDate===l);return`
            <div class="calendar-day-cell ${v.isCurrentMonth?"":"other-month"} ${v.isToday?"today":""}" data-date="${l}">
              <div class="day-number-container">
                <span class="day-number">${v.dayNumber}</span>
              </div>
              
              <!-- Tasks due on this day -->
              <div class="day-tasks-container">
                ${b.map(i=>{const h=i.status==="done",x=new Date(i.dueDate);x.setHours(0,0,0,0);const y=x-c,P=Math.ceil(y/(1e3*60*60*24));let N=`status-${i.status}`;h?N+=" status-done":P<0?N+=" pill-overdue":P<=1&&(N+=" pill-soon");const K=i.owner==="professor"?"👑":"🎓";return`
                    <div class="calendar-task-pill ${N} calendar-inline-edit-pill" data-id="${i.id}" title="${K} ${F(i.title)}">
                      <span>${K}</span> ${F(i.title)}
                    </div>
                  `}).join("")}
              </div>
              
              <!-- Calendar Static Zero-Click Inline Addition Input (Always Visible) -->
              <div class="calendar-static-add-container mt-1.5" data-date="${l}">
                <input 
                  type="text" 
                  class="calendar-static-input form-input" 
                  placeholder="+ 내 일 추가 (Enter)" 
                  autocomplete="off" 
                  style="border-radius: var(--radius-sm); height: 18px; padding: 2px 4px; border: 1px dashed var(--color-border); background: var(--color-canvas); font-size: 9px; width: 100%; transition: border-color var(--transition-fast);"
                />
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}function F(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function ee(){const a=f.getTasks(),e=f.getMemo(),s=a.filter(i=>i.owner==="professor"),r=a.filter(i=>i.owner==="graduate"),n=s.length,o=s.filter(i=>i.status==="done").length,m=s.filter(i=>i.status==="inprogress").length,c=n>0?Math.round(o/n*100):0,t=r.length,d=r.filter(i=>i.status==="done").length,u=r.filter(i=>i.status==="inprogress").length,p=t>0?Math.round(d/t*100):0,g=new Date;g.setHours(0,0,0,0);const v=i=>i.filter(h=>{if(h.status==="done"||!h.dueDate)return!1;const x=new Date(h.dueDate);return x.setHours(0,0,0,0),x<=g}),l=v(s),b=v(r);return`
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
            <div class="text-2xl font-semibold text-ink">${c}% <span class="text-xs text-mute font-normal">완료율</span></div>
            <div class="text-xs text-mute font-mono">진행 ${m} 건 / 전체 ${n} 건</div>
          </div>
          <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border mt-1">
            <div class="h-full bg-accent transition-all duration-500" style="width: ${c}%; background: var(--color-accent); border-radius: 9999px;"></div>
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
            <div class="text-2xl font-semibold text-ink">${p}% <span class="text-xs text-mute font-normal">완료율</span></div>
            <div class="text-xs text-mute font-mono">진행 ${u} 건 / 전체 ${t} 건</div>
          </div>
          <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border mt-1">
            <div class="h-full bg-violet transition-all duration-500" style="width: ${p}%; background: #7928ca; border-radius: 9999px;"></div>
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
            <div class="flex justify-between"><span>전체 등록 태스크:</span> <strong class="font-mono">${a.length} 건</strong></div>
            <div class="flex justify-between text-error" style="color:var(--color-error)"><span>내 긴급 조치 과제:</span> <strong class="font-mono">${l.length} 건</strong></div>
            <div class="flex justify-between text-warning" style="color:var(--color-warning)"><span>원생 지연 조치 과제:</span> <strong class="font-mono">${b.length} 건</strong></div>
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
                ${l.length}
              </span>
            </div>

            <div class="urgent-list flex flex-col gap-2">
              ${l.length===0?`
                <div class="empty-state border border-dashed border-border py-6 text-center text-xs text-mute rounded-lg" style="background: var(--color-canvas-soft); font-size:11px;">
                  ✨ 오늘 지연되거나 조치가 필요한 내 긴급 업무가 없습니다.
                </div>
              `:l.map(i=>{const h=R(i.dueDate);return`
                  <div class="urgent-item bg-canvas border border-border rounded-md p-3 flex items-center justify-between transition-all hover:border-border-strong" style="border-left: 3px solid var(--color-accent);">
                    <div class="flex flex-col gap-1 pr-3 flex-1">
                      <div class="text-[11px] font-medium text-ink line-clamp-1">${A(i.title)}</div>
                      <div class="text-[9px] font-mono text-accent font-semibold">${h.text}</div>
                    </div>
                    <div class="flex items-center gap-1">
                      <button class="btn-quick-inprogress btn-secondary px-2 py-0.5 text-[9px] rounded" data-id="${i.id}">진행</button>
                      <button class="btn-quick-done btn-primary px-2 py-0.5 text-[9px] rounded" data-id="${i.id}">완료</button>
                    </div>
                  </div>
                `}).join("")}
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
                ${b.length}
              </span>
            </div>

            <div class="urgent-list flex flex-col gap-2">
              ${b.length===0?`
                <div class="empty-state border border-dashed border-border py-6 text-center text-xs text-mute rounded-lg" style="background: var(--color-canvas-soft); font-size:11px;">
                  ✨ 지연되거나 마감이 밀린 대학원생들의 업무가 없습니다.
                </div>
              `:b.map(i=>{const h=R(i.dueDate);return`
                  <div class="urgent-item bg-canvas border border-border rounded-md p-3 flex items-center justify-between transition-all hover:border-border-strong" style="border-left: 3px solid var(--color-error);">
                    <div class="flex flex-col gap-1 pr-3 flex-1">
                      <div class="text-[11px] font-medium text-ink line-clamp-1">${A(i.title)}</div>
                      <div class="text-[9px] font-mono text-error font-semibold" style="color:var(--color-error)">${h.text}</div>
                    </div>
                    <div class="flex items-center gap-1">
                      <button class="btn-quick-inprogress btn-secondary px-2 py-0.5 text-[9px] rounded" data-id="${i.id}">진행</button>
                      <button class="btn-quick-done btn-primary px-2 py-0.5 text-[9px] rounded" data-id="${i.id}">완료</button>
                    </div>
                  </div>
                `}).join("")}
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
            >${A(e)}</textarea>
            <div class="flex items-center justify-end text-[10px] text-mute font-mono pt-2 border-t border-border">
              <i data-lucide="cloud-lightning" class="w-3 h-3 mr-1 text-accent"></i>
              <span>Typing auto-saves in local storage</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `}function A(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function B(a){if(!a)return null;a=a.trim().toLowerCase();const e=new Date;if(e.setHours(0,0,0,0),/^(오늘|금일|today|d-day|dday)$/.test(a))return k(e);if(/^(내일|명일|tomorrow)$/.test(a))return k(D(e,1));if(/^(모레|내일모레|글피)$/.test(a))return k(D(e,2));if(/^(어제|작일|yesterday)$/.test(a))return k(D(e,-1));let s=a.match(/^(\d+)\s*일\s*(뒤|후|후에|이후)$/);if(s||(s=a.match(/^(\d+)\s*days?\s*(after|later)$/),s))return k(D(e,parseInt(s[1])));if(s=a.match(/^(\d+)\s*일\s*(전|전에|이전)$/),s)return k(D(e,-parseInt(s[1])));if(s=a.match(/^(이번주|다음주)?\s*(월|화|수|목|금|토|일)요일?$/),s){const n=s[1]==="다음주",o=s[2],c=["일","월","화","수","목","금","토"].indexOf(o),t=e.getDay();let d=c-t;return(n||d<=0)&&(d+=7),k(D(e,d))}if(s=a.match(/^(\d{1,2})\s*[월/\-.]\s*(\d{1,2})\s*일?$/),s){const n=parseInt(s[1])-1,o=parseInt(s[2]),m=new Date(e.getFullYear(),n,o);return k(m)}const r=Date.parse(a);return isNaN(r)?null:k(new Date(r))}function D(a,e){const s=new Date(a);return s.setDate(s.getDate()+e),s}function k(a){const e=a.getFullYear(),s=String(a.getMonth()+1).padStart(2,"0"),r=String(a.getDate()).padStart(2,"0");return`${e}-${s}-${r}`}function z(a){if(!a)return{title:"",dueDate:""};const e=/(?:^|\s)(오늘|금일|내일|명일|모레|어제|글피|today|tomorrow|yesterday)(?:까지|에|이|가|\s|$)/i,s=/(?:^|\s)((?:이번주|다음주)?\s*[월화수목금토일]요일)(?:까지|에|이|가|\s|$)/,r=/(?:^|\s)(\d{1,2}\s*월\s*\d{1,2}\s*일?)(?:까지|에|이|가|\s|$)/,n=/(?:^|\s)(\d{1,2}[/\-.]\d{1,2})(?:일|요일|까지|에|이|가|\s|$)/,o=/(?:^|\s)(\d{4}[/\-.]\d{1,2}[/\-.]\d{1,2})(?:까지|에|이|가|\s|$)/;let m="",c=a,t=c.match(o);if(t){const d=t[0].trim(),u=t[1].trim(),p=B(u);p&&(m=p,c=c.replace(d,"").trim())}if(!m&&(t=c.match(r)||c.match(n),t)){const d=t[0].trim(),u=t[1].trim(),p=B(u);p&&(m=p,c=c.replace(d,"").trim())}if(!m&&(t=c.match(s),t)){const d=t[0].trim(),u=t[1].trim(),p=B(u);p&&(m=p,c=c.replace(d,"").trim())}if(!m&&(t=c.match(e),t)){const d=t[0].trim(),u=t[1].trim(),p=B(u);p&&(m=p,c=c.replace(d,"").trim())}return c=c.replace(/\s+/g," ").trim(),c=c.replace(/^(까지|에|은|는|이|가|까지의)\s+/,""),c=c.replace(/\s+(까지|e|에|은|는|이|가|까지의)$/,""),c=c.trim(),{title:c,dueDate:m}}const M=document.getElementById("app-content"),T=document.getElementById("btn-board-dual-view"),E=document.getElementById("btn-board-grad-view"),S=document.getElementById("btn-board-prof-view"),C=document.getElementById("btn-calendar-view"),I=document.getElementById("btn-dashboard-view"),te=document.getElementById("btn-add-task");let w=null;function H(a){const e=a.currentView;e==="board_dual"?(T.classList.add("active"),E.classList.remove("active"),S.classList.remove("active"),C.classList.remove("active"),I.classList.remove("active"),M.innerHTML=Z(),V("graduate"),V("professor")):e==="board_grad"?(T.classList.remove("active"),E.classList.add("active"),S.classList.remove("active"),C.classList.remove("active"),I.classList.remove("active"),M.innerHTML=O("graduate","light"),V("graduate")):e==="board_prof"?(T.classList.remove("active"),E.classList.remove("active"),S.classList.add("active"),C.classList.remove("active"),I.classList.remove("active"),M.innerHTML=O("professor","dark"),V("professor")):e==="calendar"?(T.classList.remove("active"),E.classList.remove("active"),S.classList.remove("active"),C.classList.add("active"),I.classList.remove("active"),M.innerHTML=X(),se()):e==="dashboard"&&(T.classList.remove("active"),E.classList.remove("active"),S.classList.remove("active"),C.classList.remove("active"),I.classList.add("active"),M.innerHTML=ee(),re()),window.lucide&&window.lucide.createIcons(),ae()}f.subscribe(H);function q(a,e){w={type:a,key:e}}function $(){w=null}function ae(){if(!w)return;const{type:a,key:e}=w;if(a==="board-add"){const[s,r]=e.split(":"),n=f.getCurrentView();if(n==="board_dual"||r===(n==="board_grad"?"graduate":n==="board_prof"?"professor":null)){const c=document.querySelector(`.static-inline-add[data-status="${s}"][data-owner="${r}"]`);if(c){const t=c.querySelector(".static-title-input");t&&t.focus()}}}else if(a==="calendar-add"&&f.getCurrentView()==="calendar"){const s=document.querySelector(`.calendar-static-add-container[data-date="${e}"]`);if(s){const r=s.querySelector(".calendar-static-input");r&&r.focus()}}}function V(a){const e=document.querySelectorAll(`.task-card[data-owner="${a}"]`),s=document.querySelectorAll(`.board-column[data-owner="${a}"]`);e.forEach(t=>{t.addEventListener("dragstart",d=>{if(t.querySelector("input")){d.preventDefault();return}d.dataTransfer.setData("text/plain",t.dataset.id),setTimeout(()=>t.classList.add("dragging"),0)}),t.addEventListener("dragend",()=>{t.classList.remove("dragging")})}),s.forEach(t=>{t.addEventListener("dragover",d=>{d.preventDefault(),t.classList.add("drag-over")}),t.addEventListener("dragleave",()=>{t.classList.remove("drag-over")}),t.addEventListener("drop",d=>{d.preventDefault(),t.classList.remove("drag-over");const u=d.dataTransfer.getData("text/plain"),p=t.dataset.status,g=t.dataset.owner;u&&p&&f.updateTask(u,{status:p,owner:g})})}),document.querySelectorAll(`.static-inline-add[data-owner="${a}"] .static-title-input`).forEach(t=>{const d=t.closest(".static-inline-add"),u=d.dataset.status,p=d.dataset.owner;t.addEventListener("focus",()=>{q("board-add",`${u}:${p}`)}),t.addEventListener("blur",()=>{setTimeout(()=>{w&&w.type==="board-add"&&w.key===`${u}:${p}`&&document.activeElement!==t&&$()},100)}),t.addEventListener("keydown",g=>{if(!(g.isComposing||g.keyCode===229))if(g.key==="Enter"){g.preventDefault();const v=t.value.trim();if(!v)return;q("board-add",`${u}:${p}`);const{title:l,dueDate:b}=z(v);if(!l)return;const i=f.addTask(l,b,p);u!=="todo"&&f.updateTaskStatus(i.id,u)}else g.key==="Escape"&&(t.value="",t.blur(),$())})}),document.querySelectorAll(`.board-column[data-owner="${a}"] .inline-edit-title`).forEach(t=>{t.addEventListener("dblclick",d=>{if(d.stopPropagation(),t.querySelector("input"))return;const u=t.dataset.id,p=t.textContent.trim(),g=document.createElement("input");g.type="text",g.className="form-input py-1 px-1.5 text-xs w-full",g.style.fontFamily="inherit",g.value=p,t.innerHTML="",t.appendChild(g),g.focus(),g.select();let v=!1;$();const l=()=>{if(v)return;v=!0;const i=g.value.trim();i&&i!==p?f.updateTask(u,{title:i}):t.textContent=p},b=()=>{v||(v=!0,t.textContent=p)};g.addEventListener("blur",l),g.addEventListener("keydown",i=>{i.isComposing||i.keyCode===229||(i.key==="Enter"?(i.preventDefault(),l()):i.key==="Escape"&&(i.preventDefault(),b()))})})}),document.querySelectorAll(`.board-column[data-owner="${a}"] .inline-edit-due`).forEach(t=>{t.addEventListener("click",d=>{if(d.stopPropagation(),t.querySelector("input"))return;const u=t.dataset.id,p=t.querySelector(".due-text"),g=f.getTasks().find(y=>y.id===u),v=g?g.dueDate:p.textContent.trim(),l=document.createElement("input");l.type="text",l.className="form-input py-0.5 px-1 text-[11px] font-mono",l.style.width="140px",l.style.display="inline-block",l.placeholder="예: 오늘, 내일, 5/30",l.value=v;const b=t.querySelector("i");b&&(b.style.display="none"),p.style.display="none",t.appendChild(l),l.focus(),l.select();let i=!1;$();const h=()=>{if(i)return;i=!0;const y=l.value.trim();if(y){const P=B(y)||y;f.updateTask(u,{dueDate:P})}else b&&(b.style.display=""),p.style.display="",l.remove()},x=()=>{i||(i=!0,b&&(b.style.display=""),p.style.display="",l.remove())};l.addEventListener("blur",h),l.addEventListener("keydown",y=>{y.key==="Enter"?(y.preventDefault(),h()):y.key==="Escape"&&(y.preventDefault(),x())})})}),document.querySelectorAll(`.board-column[data-owner="${a}"] .delete-task-btn`).forEach(t=>{t.addEventListener("click",d=>{d.stopPropagation();const u=t.dataset.id;f.deleteTask(u)})}),document.querySelectorAll(`.board-column[data-owner="${a}"] .reminder-check-btn`).forEach(t=>{t.addEventListener("click",d=>{d.stopPropagation();const u=t.dataset.id,g=t.dataset.status==="done"?"todo":"done";f.updateTaskStatus(u,g)})})}function se(){const a=document.getElementById("calendar-prev-btn"),e=document.getElementById("calendar-next-btn"),s=document.getElementById("calendar-today-btn");a&&e&&s&&(a.addEventListener("click",()=>{const o=f.getCurrentMonth();f.setCalendarMonth(new Date(o.getFullYear(),o.getMonth()-1,1))}),e.addEventListener("click",()=>{const o=f.getCurrentMonth();f.setCalendarMonth(new Date(o.getFullYear(),o.getMonth()+1,1))}),s.addEventListener("click",()=>{f.setCalendarMonth(new Date)})),document.querySelectorAll(".calendar-static-input").forEach(o=>{const c=o.closest(".calendar-static-add-container").dataset.date;o.addEventListener("focus",()=>{q("calendar-add",c)}),o.addEventListener("blur",()=>{setTimeout(()=>{w&&w.type==="calendar-add"&&w.key===c&&document.activeElement!==o&&$()},100)}),o.addEventListener("keydown",t=>{if(!(t.isComposing||t.keyCode===229))if(t.key==="Enter"){t.preventDefault();const d=o.value.trim();if(!d)return;q("calendar-add",c);const{title:u,dueDate:p}=z(d);if(!u)return;f.addTask(u,p||c,"professor")}else t.key==="Escape"&&(o.value="",o.blur(),$())})}),document.querySelectorAll(".calendar-inline-edit-pill").forEach(o=>{o.addEventListener("dblclick",m=>{if(m.stopPropagation(),o.querySelector("input"))return;const c=o.dataset.id,t=o.textContent.trim(),d=t.replace(/^[👑🎓]\s*/,""),u=document.createElement("input");u.type="text",u.className="form-input py-0.5 px-1 text-[9px] w-full",u.style.height="16px",u.value=d,o.innerHTML="",o.appendChild(u),u.focus(),u.select();let p=!1;$();const g=()=>{if(p)return;p=!0;const l=u.value.trim();l&&l!==d?f.updateTask(c,{title:l}):o.textContent=t},v=()=>{p||(p=!0,o.textContent=t)};u.addEventListener("blur",g),u.addEventListener("keydown",l=>{l.isComposing||l.keyCode===229||(l.key==="Enter"?(l.preventDefault(),g()):l.key==="Escape"&&(l.preventDefault(),v()))})})})}function re(){const a=document.getElementById("dashboard-notepad");a&&a.addEventListener("input",r=>{f.saveMemo(r.target.value)});const e=document.querySelectorAll(".btn-quick-inprogress"),s=document.querySelectorAll(".btn-quick-done");e.forEach(r=>{r.addEventListener("click",()=>{const n=r.dataset.id;f.updateTaskStatus(n,"inprogress")})}),s.forEach(r=>{r.addEventListener("click",()=>{const n=r.dataset.id;f.updateTaskStatus(n,"done")})})}T.addEventListener("click",()=>{f.setView("board_dual")});E.addEventListener("click",()=>{f.setView("board_grad")});S.addEventListener("click",()=>{f.setView("board_prof")});C.addEventListener("click",()=>{f.setView("calendar")});I.addEventListener("click",()=>{f.setView("dashboard")});te.addEventListener("click",()=>{const a=f.getCurrentView();a==="calendar"||a==="dashboard"?(f.setView("board_dual"),setTimeout(()=>j("professor"),50)):j(a==="board_dual"?"professor":a==="board_grad"?"graduate":"professor")});function j(a){const e=document.querySelector(`.static-inline-add[data-status="todo"][data-owner="${a}"]`);if(e){const s=e.querySelector(".static-title-input");s&&(s.focus(),q("board-add",`todo:${a}`))}}const G=document.getElementById("btn-export-data"),Y=document.getElementById("btn-import-data"),_=document.getElementById("import-file-input");G&&G.addEventListener("click",()=>{const a=f.exportData(),e=new Blob([a],{type:"application/json"}),s=URL.createObjectURL(e),r=document.createElement("a"),n=new Date().toISOString().split("T")[0];r.href=s,r.download=`졸업칸반-백업-${n}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),setTimeout(()=>URL.revokeObjectURL(s),1e3)});Y&&_&&(Y.addEventListener("click",()=>_.click()),_.addEventListener("change",a=>{const e=a.target.files&&a.target.files[0];if(!e)return;const s=new FileReader;s.onload=r=>{const n=f.importData(r.target.result);n.ok?window.alert(`불러오기 완료! 할 일 ${n.count}개를 가져왔어요.`):window.alert(n.message),_.value=""},s.readAsText(e)}));document.addEventListener("DOMContentLoaded",()=>{H(f.state)});(document.readyState==="interactive"||document.readyState==="complete")&&H(f.state);

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function e(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=e(n);fetch(n.href,o)}})();const B=a=>{const t=new Date;return t.setDate(t.getDate()+a),t.toISOString().split("T")[0]},mt=[{id:"task-1",title:"장보기 (계란, 우유, 사료)",dueDate:B(1),status:"todo",category:"일상"},{id:"task-2",title:"주간 운동 3회 채우기",dueDate:B(0),status:"inprogress",category:"일상"},{id:"task-3",title:"칸반 앱 카테고리 탭 기능 마무리",dueDate:B(2),status:"inprogress",category:"개발"},{id:"task-4",title:"GitHub 배포 자동화 스크립트 정리",dueDate:B(3),status:"todo",category:"개발"}],K=["일상","개발"],q={professor:"교수님",graduate:"대학원생"},ht={"내 일":"교수님"},H=`🗒️ 오늘의 메모 & 주간 브리핑
- 이번 주 안에 끝낼 핵심 할 일 한 가지만 정해두기.
- 탭(일상/개발)은 위쪽 '+ 탭 추가'로 얼마든지 만들 수 있어요.`,f="__all__",pt="https://script.google.com/macros/s/AKfycbwcB7-zS24yffC5SbHnok1oHDZdNQncm5Z60d5YqB-jvnleBoCOCODgMlxDJMjocO_Cmw/exec",ft=700,yt=15e3;function b(a){const t=String(a||"").trim();return t?ht[t]||t:""}function E(a){return[...new Set((Array.isArray(a)?a:[]).map(b).filter(Boolean))]}function vt(){return!!(typeof window<"u"&&window.google&&window.google.script&&window.google.script.run)}class bt{constructor(){this.tasksKey="graduate_kanban_tasks_v2",this.viewKey="graduate_kanban_view_v2",this.memoKey="graduate_kanban_memo_v2",this.catKey="graduate_kanban_categories_v2",this.activeCatKey="graduate_kanban_active_category_v2",this.themeKey="graduate_kanban_theme_v1",this.hideCompletedKey="graduate_kanban_hide_completed_v1",this.syncEnabled=vt(),this.readyForRemoteWrites=!1,this.remoteSaveTimer=null,this.remotePollTimer=null,this.remoteUpdatedAt="",this.localDirty=!1,this.suppressRemoteSave=!1;const t=localStorage.getItem(this.tasksKey);let e=t?JSON.parse(t):mt;e=e.map(g=>{if(g.category)return g;const p=q[g.owner]||"일상";return{...g,category:p}}).map(g=>({...g,category:b(g.category)}));const s=localStorage.getItem(this.catKey);let n=s?JSON.parse(s):null;if(!n||!Array.isArray(n)||n.length===0){const g=[...new Set(e.map(p=>p.category).filter(Boolean))];n=[...new Set([...g,...K])]}n=E(n);const o=localStorage.getItem(this.viewKey)||"board",c=o.startsWith("board")?"board":o,d=localStorage.getItem(this.activeCatKey),r=b(d),l=r&&(r===f||n.includes(r))?r:f,u=localStorage.getItem(this.themeKey),h=typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,m=u==="dark"||u==="light"?u:h?"dark":"light";this.state={tasks:e,categories:n,activeCategory:l,currentView:c,currentMonth:new Date,categoryEditMode:!1,theme:m,hideCompleted:localStorage.getItem(this.hideCompletedKey)==="true",memo:localStorage.getItem(this.memoKey)||H,sync:{enabled:this.syncEnabled,status:this.syncEnabled?"connecting":"local",message:this.syncEnabled?"연결 중":"이 브라우저",lastSyncedAt:"",spreadsheetId:"",spreadsheetUrl:"",error:""}},t||(this.saveTasksToLocalStorage(),localStorage.setItem(this.memoKey,H)),this.saveTasksToLocalStorage(),this.saveCategoriesToLocalStorage(),this.listeners=[]}saveTasksToLocalStorage(){localStorage.setItem(this.tasksKey,JSON.stringify(this.state.tasks)),this.scheduleRemoteSave()}saveViewToLocalStorage(){localStorage.setItem(this.viewKey,this.state.currentView),this.scheduleRemoteSave()}saveCategoriesToLocalStorage(){localStorage.setItem(this.catKey,JSON.stringify(this.state.categories)),this.scheduleRemoteSave()}saveActiveCategoryToLocalStorage(){localStorage.setItem(this.activeCatKey,this.state.activeCategory),this.scheduleRemoteSave()}saveThemeToLocalStorage(){localStorage.setItem(this.themeKey,this.state.theme)}saveHideCompletedToLocalStorage(){localStorage.setItem(this.hideCompletedKey,String(this.state.hideCompleted))}saveMemoToLocalStorage(){localStorage.setItem(this.memoKey,this.state.memo),this.scheduleRemoteSave()}saveSnapshotToLocalStorage(){this.suppressRemoteSave=!0;try{localStorage.setItem(this.tasksKey,JSON.stringify(this.state.tasks)),localStorage.setItem(this.catKey,JSON.stringify(this.state.categories)),localStorage.setItem(this.viewKey,this.state.currentView),localStorage.setItem(this.activeCatKey,this.state.activeCategory),localStorage.setItem(this.memoKey,this.state.memo)}finally{this.suppressRemoteSave=!1}}getTasks(){return[...this.state.tasks]}getCategories(){return[...this.state.categories]}getActiveCategory(){return this.state.activeCategory}getVisibleTasks(){return this.state.activeCategory===f?[...this.state.tasks]:this.state.tasks.filter(t=>t.category===this.state.activeCategory)}getCurrentView(){return this.state.currentView}getCurrentMonth(){return this.state.currentMonth}getMemo(){return this.state.memo}getSyncState(){return{...this.state.sync}}isCategoryEditMode(){return!!this.state.categoryEditMode}getTheme(){return this.state.theme}isCompletedHidden(){return!!this.state.hideCompleted}setView(t){["board","calendar","dashboard"].includes(t)&&(this.state.currentView=t,this.saveViewToLocalStorage(),this.notify())}setActiveCategory(t){const e=t===f?f:b(t);e!==f&&!this.state.categories.includes(e)||(this.state.activeCategory=e,this.saveActiveCategoryToLocalStorage(),this.notify())}setCategoryEditMode(t){this.state.categoryEditMode=!!t,this.notify()}toggleCategoryEditMode(){this.setCategoryEditMode(!this.state.categoryEditMode)}setTheme(t){["light","dark"].includes(t)&&(this.state.theme=t,this.saveThemeToLocalStorage(),this.notify())}toggleTheme(){this.setTheme(this.state.theme==="dark"?"light":"dark")}setCompletedHidden(t){this.state.hideCompleted=!!t,this.saveHideCompletedToLocalStorage(),this.notify()}toggleCompletedHidden(){this.setCompletedHidden(!this.state.hideCompleted)}addCategory(t){const e=b(t);return e?e===f||e==="전체"?{ok:!1,message:"'전체'는 기본 탭이라 추가할 수 없어요."}:this.state.categories.includes(e)?{ok:!1,message:"이미 있는 탭이에요."}:(this.state.categories.push(e),this.state.categories=E(this.state.categories),this.saveCategoriesToLocalStorage(),this.state.activeCategory=e,this.saveActiveCategoryToLocalStorage(),this.notify(),{ok:!0}):{ok:!1,message:"탭 이름을 입력해 주세요."}}deleteCategory(t){const e=b(t);if(!this.state.categories.includes(e))return{ok:!1};if(this.state.categories.length<=1)return{ok:!1,message:"탭은 최소 한 개는 있어야 해요."};this.state.categories=this.state.categories.filter(n=>n!==e);const s=this.state.categories[0];return this.state.tasks=this.state.tasks.map(n=>n.category===e?{...n,category:s}:n),this.state.activeCategory===e&&(this.state.activeCategory=f,this.saveActiveCategoryToLocalStorage()),this.saveCategoriesToLocalStorage(),this.saveTasksToLocalStorage(),this.notify(),{ok:!0,movedTo:s}}renameCategory(t,e){const s=b(t),n=b(e);return n?this.state.categories.includes(s)?n===s?{ok:!0}:this.state.categories.includes(n)?{ok:!1,message:"이미 있는 탭 이름이에요."}:(this.state.categories=this.state.categories.map(o=>o===s?n:o),this.state.categories=E(this.state.categories),this.state.tasks=this.state.tasks.map(o=>o.category===s?{...o,category:n}:o),this.state.activeCategory===s&&(this.state.activeCategory=n,this.saveActiveCategoryToLocalStorage()),this.saveCategoriesToLocalStorage(),this.saveTasksToLocalStorage(),this.notify(),{ok:!0}):{ok:!1}:{ok:!1,message:"탭 이름을 입력해 주세요."}}setCalendarMonth(t){this.state.currentMonth=t,this.notify()}saveMemo(t){this.state.memo=t,this.saveMemoToLocalStorage()}addTask(t,e="",s=null){const n=b(s)||(this.state.activeCategory!==f?this.state.activeCategory:this.state.categories[0]||"일상"),o={id:`task-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,title:t.trim(),dueDate:e||"",status:"todo",category:n};return this.state.tasks.push(o),this.saveTasksToLocalStorage(),this.notify(),o}updateTask(t,e){const s=e&&e.category?{...e,category:b(e.category)}:e;this.state.tasks=this.state.tasks.map(n=>n.id===t?{...n,...s}:n),this.saveTasksToLocalStorage(),this.notify()}updateTaskStatus(t,e){["todo","inprogress","done"].includes(e)&&this.updateTask(t,{status:e})}deleteTask(t){this.state.tasks=this.state.tasks.filter(e=>e.id!==t),this.saveTasksToLocalStorage(),this.notify()}exportData(){return JSON.stringify({_app:"graduate-kanban",_version:3,tasks:this.state.tasks,categories:this.state.categories,memo:this.state.memo,currentView:this.state.currentView},null,2)}importData(t){let e;try{e=JSON.parse(t)}catch{return{ok:!1,message:"파일을 읽을 수 없어요. 올바른 백업 파일인지 확인해 주세요."}}if(!e||!Array.isArray(e.tasks))return{ok:!1,message:"이 칸반 백업 파일이 아닌 것 같아요."};const s=e.tasks.map(o=>o.category?o:{...o,category:q[o.owner]||"일상"}).map(o=>({...o,category:b(o.category)}));let n;if(Array.isArray(e.categories)&&e.categories.length>0)n=E(e.categories);else{const o=[...new Set(s.map(c=>c.category).filter(Boolean))];n=E([...o,...K])}return this.state.tasks=s,this.state.categories=n,n.includes(this.state.activeCategory)||(this.state.activeCategory=f,this.saveActiveCategoryToLocalStorage()),typeof e.memo=="string"&&(this.state.memo=e.memo),this.saveTasksToLocalStorage(),this.saveCategoriesToLocalStorage(),this.saveMemoToLocalStorage(),this.notify(),{ok:!0,count:s.length}}importSnapshotData(t){const e=this.normalizeSnapshot(t);return this.state={...this.state,...e,sync:this.state.sync},this.localDirty=!0,this.saveSnapshotToLocalStorage(),this.notify(),{ok:!0,count:e.tasks.length}}createSnapshot(){return{_app:"graduate-kanban",_version:4,tasks:this.state.tasks,categories:this.state.categories,activeCategory:this.state.activeCategory,memo:this.state.memo,currentView:this.state.currentView}}normalizeSnapshot(t){const e=t&&typeof t=="object"?t:{},n=(Array.isArray(e.tasks)?e.tasks:[]).map(l=>{const u=l&&typeof l=="object"?l:{},h=b(u.category||q[u.owner]||"일상");return{id:String(u.id||`task-${Date.now()}-${Math.random().toString(36).slice(2,9)}`),title:String(u.title||"").trim(),dueDate:String(u.dueDate||""),status:["todo","inprogress","done"].includes(u.status)?u.status:"todo",category:h}}).filter(l=>l.title);let o=Array.isArray(e.categories)?E(e.categories.map(l=>String(l||"").trim()).filter(Boolean)):[];if(o.length===0){const l=[...new Set(n.map(u=>u.category).filter(Boolean))];o=E([...l,...K])}else o=E([...o,...n.map(l=>l.category).filter(Boolean)]);const c=e.activeCategory===f?f:b(e.activeCategory),d=c&&(c===f||o.includes(c))?c:f,r=["board","calendar","dashboard"].includes(e.currentView)?e.currentView:"board";return{tasks:n,categories:o,activeCategory:d,currentView:r,currentMonth:this.state.currentMonth,memo:typeof e.memo=="string"?e.memo:H}}applyRemoteSnapshot(t,e={}){const s=this.normalizeSnapshot(t);this.state={...this.state,...s,sync:this.state.sync},this.remoteUpdatedAt=e.updatedAt||this.remoteUpdatedAt,this.localDirty=!1,this.saveSnapshotToLocalStorage(),this.setSyncState({status:"synced",message:"동기화됨",lastSyncedAt:e.updatedAt||this.state.sync.lastSyncedAt,spreadsheetId:e.spreadsheetId||this.state.sync.spreadsheetId,spreadsheetUrl:e.spreadsheetUrl||this.state.sync.spreadsheetUrl,error:""}),this.notify()}setSyncState(t){this.state.sync={...this.state.sync,...t},typeof window<"u"&&window.dispatchEvent(new CustomEvent("graduate-kanban-sync",{detail:this.getSyncState()}))}scheduleRemoteSave(){!this.syncEnabled||!this.readyForRemoteWrites||this.suppressRemoteSave||(this.localDirty=!0,window.clearTimeout(this.remoteSaveTimer),this.remoteSaveTimer=window.setTimeout(()=>this.saveRemoteNow(),ft))}async initRemoteSync(t=!1){if(!(!this.syncEnabled||this.readyForRemoteWrites)){this.setSyncState({status:"syncing",message:"불러오는 중",error:""});try{const e=await this.callAppsScript("getKanbanState");this.readyForRemoteWrites=!0,this.setSyncState({spreadsheetId:e.spreadsheetId||"",spreadsheetUrl:e.spreadsheetUrl||""}),t?await this.saveRemoteNow():e.hasData&&e.data?this.applyRemoteSnapshot(e.data,e):await this.saveRemoteNow(),this.startRemotePolling()}catch(e){this.readyForRemoteWrites=!0,this.setSyncState({status:"error",message:"동기화 오류",error:this.formatError(e)})}}}async refreshFromRemote(t=!1){if(this.syncEnabled&&!(!t&&(this.localDirty||this.isUserTyping()))){this.setSyncState({status:"syncing",message:"확인 중",error:""});try{const e=await this.callAppsScript("getKanbanState");this.setSyncState({spreadsheetId:e.spreadsheetId||this.state.sync.spreadsheetId,spreadsheetUrl:e.spreadsheetUrl||this.state.sync.spreadsheetUrl}),e.hasData&&e.data&&e.updatedAt!==this.remoteUpdatedAt?this.applyRemoteSnapshot(e.data,e):this.setSyncState({status:"synced",message:"동기화됨",lastSyncedAt:e.updatedAt||this.state.sync.lastSyncedAt,error:""})}catch(e){this.setSyncState({status:"error",message:"동기화 오류",error:this.formatError(e)})}}}async saveRemoteNow(){if(!(!this.syncEnabled||!this.readyForRemoteWrites)){window.clearTimeout(this.remoteSaveTimer),this.setSyncState({status:"syncing",message:"저장 중",error:""});try{const t=await this.callAppsScript("saveKanbanState",this.createSnapshot());this.remoteUpdatedAt=t.updatedAt||"",this.localDirty=!1,this.setSyncState({status:"synced",message:"동기화됨",lastSyncedAt:t.updatedAt||new Date().toISOString(),spreadsheetId:t.spreadsheetId||this.state.sync.spreadsheetId,spreadsheetUrl:t.spreadsheetUrl||this.state.sync.spreadsheetUrl,error:""})}catch(t){this.setSyncState({status:"error",message:"저장 오류",error:this.formatError(t)})}}}startRemotePolling(){this.syncEnabled&&(window.clearInterval(this.remotePollTimer),this.remotePollTimer=window.setInterval(()=>{document.visibilityState==="visible"&&this.refreshFromRemote(!1)},yt))}callAppsScript(t,e){return new Promise((s,n)=>{const o=window.google&&window.google.script&&window.google.script.run;if(!o||typeof o[t]!="function"){n(new Error("Apps Script backend is not available."));return}o.withSuccessHandler(s).withFailureHandler(n)[t](e)})}isUserTyping(){const t=typeof document<"u"?document.activeElement:null;return t?t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable:!1}formatError(t){return t?t.message||String(t):"알 수 없는 오류"}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(e=>e!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}}const i=new bt,G=["#0070f3","#7928ca","#10b981","#f5a623","#e91e63","#06b6d4","#d946ef","#ef4444"];function at(a){const t=i.getCategories().indexOf(a);return t<0?"#9aa0a6":G[t%G.length]}function st(a){if(!a)return{class:"due-none",text:"기한 없음"};const t=new Date;t.setHours(0,0,0,0);const e=new Date(a);e.setHours(0,0,0,0);const s=e-t,n=Math.ceil(s/(1e3*60*60*24));if(n<0)return{class:"due-overdue",text:`지연 D+${Math.abs(n)}`};if(n===0)return{class:"due-overdue",text:"오늘"};if(n===1)return{class:"due-soon",text:"내일"};if(n===2)return{class:"due-soon",text:"모레"};{const o=a.split("-");return{class:"due-normal",text:`${o.length===3?`${parseInt(o[1])}/${parseInt(o[2])}`:a} (D-${n})`}}}function wt(){const a=i.getCategories(),t=i.getActiveCategory(),e=i.isCategoryEditMode(),s=t===f?"active":"",n=e?"is-editing":"",o=e?"check":"pencil",c=e?"탭 편집 완료":"탭 편집";return`
    <div class="category-tabs ${n}" role="tablist">
      <button class="cat-tab ${s}" data-cat="${f}" role="tab">
        전체 <span class="cat-tab-num">1</span>
      </button>
      ${a.map((d,r)=>{const l=t===d,u=l?"active":"",h=j(d),m=r+2,g=at(d),p=m<=9?` <span class="cat-tab-num">${m}</span>`:"",w=l?`background:${g};color:#fff;border-color:${g};`:`background:${g}1a;color:${g};border-color:${g}40;`;return`
          <span class="cat-tab-wrap ${u} ${n}" data-cat="${h}">
            <button class="cat-tab cat-tab-named ${u}" data-cat="${h}" role="tab" style="${w}" title="${e?"더블클릭하면 이름 변경 · 카드를 끌어다 놓으면 이 탭으로 이동":"카드를 끌어다 놓으면 이 탭으로 이동"}">
              ${h}${p}
            </button>
            ${e?`<button class="cat-tab-delete" data-cat="${h}" title="'${h}' 탭 삭제" aria-label="탭 삭제">
              <i data-lucide="x" class="w-2 h-2"></i>
            </button>`:""}
          </span>
        `}).join("")}
      ${e?`<button class="cat-tab-add" id="cat-tab-add-btn" title="새 탭 추가">
        <i data-lucide="plus" class="w-3 h-3"></i>
        <span>탭 추가</span>
      </button>`:""}
      <button class="cat-tab-edit-toggle ${e?"active":""}" id="cat-tab-edit-toggle" aria-pressed="${e}" title="${c}" aria-label="${c}">
        <i data-lucide="${o}" class="w-3 h-3"></i>
        <span>${e?"완료":"편집"}</span>
      </button>
    </div>
  `}function J(a,t){const e=a.status==="done",s=st(a.dueDate),n=e?"task-card-title inline-edit-title line-through":"task-card-title inline-edit-title",o=e?"text-mute":s.class,c=e?"check-circle-2":"circle",d=e?"text-violet":"text-mute",r=j(a.title),l=a.category?at(a.category):"",u=t&&a.category?`<span class="card-category-badge" style="background:${l}1a;color:${l};border-color:${l}66">${j(a.category)}</span>`:"";return`
    <div class="task-card card-reminder ${e?"is-done":""}" draggable="true" data-id="${a.id}">
      <div class="reminder-left-slot">
        <button class="reminder-check-btn" data-id="${a.id}" data-status="${a.status}" title="완료 토글">
          <i data-lucide="${c}" class="w-4 h-4 ${d}"></i>
        </button>
        <div class="${n}" data-id="${a.id}" title="${r} (더블 클릭하여 수정)">
          ${r}
          ${u}
        </div>
      </div>

      <div class="reminder-right-slot">
        <span class="card-drag-handle" data-id="${a.id}" title="이 줄을 끌어서 다른 탭으로 이동 (어디를 잡아도 돼요)" aria-hidden="true">
          <i data-lucide="grip-vertical" class="w-3.5 h-3.5"></i>
        </span>
        <button class="card-move-btn" data-id="${a.id}" title="다른 탭으로 옮기기 (목록에서 선택)" aria-label="다른 탭으로 옮기기">
          <i data-lucide="folder-input" class="w-3.5 h-3.5"></i>
        </button>
        <div class="task-card-due ${o}" data-id="${a.id}" title="클릭하여 마감일 수정">
          <i data-lucide="calendar" class="w-2.5 h-2.5"></i>
          <span class="due-text">${s.text}</span>
        </div>
        <button class="card-action-btn delete-task-btn" data-id="${a.id}" title="할 일 삭제" aria-label="할 일 삭제">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `}function kt(){const a=i.getVisibleTasks(),t=i.getActiveCategory()===f,e=i.isCompletedHidden(),s=a.filter(d=>d.status!=="done"),n=a.filter(d=>d.status==="done"),o=n.length?`<div class="done-divider ${e?"is-collapsed":""}">
        <span class="done-count">완료됨 ${n.length}</span>
        <span class="done-divider-line" aria-hidden="true"></span>
        <button class="done-toggle-btn" id="done-toggle-btn" aria-pressed="${e}" title="${e?"완료됨 보기":"완료됨 숨기기"}" aria-label="${e?"완료됨 보기":"완료됨 숨기기"}">
          <i data-lucide="${e?"eye":"eye-off"}" class="w-3 h-3"></i>
          <span>${e?"보기":"숨기기"}</span>
        </button>
      </div>`:"",c=s.length===0&&n.length===0?'<div class="empty-state list-empty"><span>이 탭에 할 일이 없어요. 아래에 입력해서 추가하세요.</span></div>':"";return`
    ${wt()}
    <div class="todo-list-wrap">
      <div class="todo-list">
        ${c}
        ${s.map(d=>J(d,t)).join("")}
        ${o}
        ${e?"":n.map(d=>J(d,t)).join("")}
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
  `}function j(a){return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function St(){const a=i.getCurrentMonth(),t=a.getFullYear(),e=a.getMonth(),s=i.getTasks(),n=new Date(t,e,1).getDay(),o=new Date(t,e+1,0).getDate(),c=new Date(t,e,0).getDate(),d=new Date;d.setHours(0,0,0,0);const r=[];for(let g=n-1;g>=0;g--){const p=new Date(t,e-1,c-g);r.push({date:p,isCurrentMonth:!1,dayNumber:c-g})}for(let g=1;g<=o;g++){const p=new Date(t,e,g),w=p.toDateString()===d.toDateString();r.push({date:p,isCurrentMonth:!0,isToday:w,dayNumber:g})}const u=42-r.length;for(let g=1;g<=u;g++){const p=new Date(t,e+1,g);r.push({date:p,isCurrentMonth:!1,dayNumber:g})}return`
    <div class="calendar-view">
      <!-- Calendar Navigation Header -->
      <div class="calendar-header">
        <h2 class="calendar-month-title">${`${t}년 ${["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"][e]}`}</h2>
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
        ${r.map(g=>{const p=g.date.toISOString().split("T")[0],w=s.filter(y=>y.dueDate===p);return`
            <div class="calendar-day-cell ${g.isCurrentMonth?"":"other-month"} ${g.isToday?"today":""}" data-date="${p}">
              <div class="day-number-container">
                <span class="day-number">${g.dayNumber}</span>
              </div>
              
              <!-- Tasks due on this day -->
              <div class="day-tasks-container">
                ${w.map(y=>{const V=y.status==="done",$=new Date(y.dueDate);$.setHours(0,0,0,0);const ut=$-d,W=Math.ceil(ut/(1e3*60*60*24));let I=`status-${y.status}`;V?I+=" status-done":W<0?I+=" pill-overdue":W<=1&&(I+=" pill-soon");const gt=y.category?`[${P(y.category)}] `:"";return`
                    <div class="calendar-task-pill ${I} calendar-inline-edit-pill" data-id="${y.id}" title="${gt}${P(y.title)}">
                      ${P(y.title)}
                    </div>
                  `}).join("")}
              </div>
              
              <!-- Calendar Static Zero-Click Inline Addition Input (Always Visible) -->
              <div class="calendar-static-add-container mt-1.5" data-date="${p}">
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
  `}function P(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function xt(){const a=i.getTasks(),t=i.getCategories(),e=i.getMemo(),n=i.getSyncState().enabled?"Google Sheets 자동 저장":"이 브라우저에 자동 저장",o=a.length,c=a.filter(g=>g.status==="done").length,d=o-c,r=o>0?Math.round(c/o*100):0,l=new Date;l.setHours(0,0,0,0);const u=g=>{if(g.status==="done"||!g.dueDate)return!1;const p=new Date(g.dueDate);return p.setHours(0,0,0,0),p<=l},h=a.filter(u).sort((g,p)=>new Date(g.dueDate)-new Date(p.dueDate)),m=t.map(g=>{const p=a.filter($=>$.category===g),w=p.length,y=p.filter($=>$.status==="done").length,V=w>0?Math.round(y/w*100):0;return{cat:g,total:w,done:y,rate:V}});return`
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
            <div class="text-2xl font-semibold text-ink">${r}% <span class="text-xs text-mute font-normal">완료율</span></div>
            <div class="text-xs text-mute font-mono">미완료 ${d} 건 / 전체 ${o} 건</div>
          </div>
          <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border mt-1">
            <div class="h-full transition-all duration-500" style="width: ${r}%; background: var(--color-accent); border-radius: 9999px;"></div>
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
            <div class="text-2xl font-semibold text-ink" style="color:var(--color-error)">${h.length} <span class="text-xs text-mute font-normal">건</span></div>
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
            ${t.map(g=>`<span class="card-category-badge dash-cat-link" data-cat="${x(g)}" style="cursor:pointer;">${x(g)}</span>`).join("")}
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
          ${m.map(g=>`
            <div class="cat-progress-item dash-cat-link" data-cat="${x(g.cat)}" title="'${x(g.cat)}' 탭으로 이동" style="cursor:pointer;">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-medium text-ink">${x(g.cat)}</span>
                <span class="text-[10px] font-mono text-mute">${g.rate}% · ${g.done}/${g.total}</span>
              </div>
              <div class="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden border border-border">
                <div class="h-full transition-all duration-500" style="width: ${g.rate}%; background: #7928ca; border-radius: 9999px;"></div>
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
              ${h.length}
            </span>
          </div>

          <div class="urgent-list flex flex-col gap-2">
            ${h.length===0?`
              <div class="empty-state border border-dashed border-border py-6 text-center text-xs text-mute rounded-lg" style="background: var(--color-canvas-soft); font-size:11px;">
                ✨ 오늘 지연되거나 조치가 필요한 긴급 할 일이 없습니다.
              </div>
            `:h.map(g=>{const p=st(g.dueDate),w=g.category?`<span class="card-category-badge dash-cat-link" data-cat="${x(g.category)}" style="cursor:pointer;">${x(g.category)}</span>`:"";return`
                <div class="urgent-item bg-canvas border border-border rounded-md p-3 flex items-center justify-between transition-all hover:border-border-strong" style="border-left: 3px solid var(--color-error);">
                  <div class="flex flex-col gap-1 pr-3 flex-1">
                    <div class="text-[11px] font-medium text-ink line-clamp-1">${x(g.title)} ${w}</div>
                    <div class="text-[9px] font-mono text-error font-semibold" style="color:var(--color-error)">${p.text}</div>
                  </div>
                  <div class="flex items-center gap-1">
                    <button class="btn-quick-done btn-primary px-2 py-0.5 text-[9px] rounded" data-id="${g.id}">완료</button>
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
            >${x(e)}</textarea>
            <div class="flex items-center justify-end text-[10px] text-mute font-mono pt-2 border-t border-border">
              <i data-lucide="cloud-lightning" class="w-3 h-3 mr-1 text-accent"></i>
              <span>${n}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `}function x(a){return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function D(a){if(!a)return null;a=a.trim().toLowerCase();const t=a.replace(/\s+/g,""),e=new Date;if(e.setHours(0,0,0,0),/^(오늘|금일|today|d-day|dday)$/.test(t))return v(e);if(/^(내일|명일|tomorrow)$/.test(t))return v(k(e,1));if(/^(모레|모래|내일모레|내일모래)$/.test(t))return v(k(e,2));if(/^글피$/.test(t))return v(k(e,3));if(/^(어제|작일|yesterday)$/.test(t))return v(k(e,-1));let s=a.match(/^(\d+)\s*일\s*(뒤|후|후에|이후)$/);if(s||(s=a.match(/^(\d+)\s*days?\s*(after|later)$/),s))return v(k(e,parseInt(s[1])));if(s=a.match(/^(하루|이틀|사흘|나흘)\s*(뒤|후|후에|이후)$/),s)return v(k(e,Y(s[1])));if(s=a.match(/^(\d+)\s*일\s*(전|전에|이전)$/),s)return v(k(e,-parseInt(s[1])));if(s=a.match(/^(하루|이틀|사흘|나흘)\s*(전|전에|이전)$/),s)return v(k(e,-Y(s[1])));if(s=a.match(/^(이번주|다음주)?\s*(월|화|수|목|금|토|일)요일?$/),s){const o=s[1]==="다음주",c=s[2],r=["일","월","화","수","목","금","토"].indexOf(c),l=e.getDay();let u=r-l;return(o||u<=0)&&(u+=7),v(k(e,u))}if(s=a.match(/^(\d{1,2})\s*[월/\-.]\s*(\d{1,2})\s*일?$/),s){const o=parseInt(s[1])-1,c=parseInt(s[2]),d=new Date(e.getFullYear(),o,c);return v(d)}const n=Date.parse(a);return isNaN(n)?null:v(new Date(n))}function k(a,t){const e=new Date(a);return e.setDate(e.getDate()+t),e}function v(a){const t=a.getFullYear(),e=String(a.getMonth()+1).padStart(2,"0"),s=String(a.getDate()).padStart(2,"0");return`${t}-${e}-${s}`}function Y(a){return{하루:1,이틀:2,사흘:3,나흘:4}[a]||0}function nt(a){if(!a)return{title:"",dueDate:""};const t=/(?:^|\s)(내일\s*모레|내일\s*모래|오늘|금일|내일|명일|모레|모래|어제|작일|글피|today|tomorrow|yesterday)(?:까지의|까지|에는|에|이|가|은|는)?(?=\s|$)/i,e=/(?:^|\s)((?:\d+\s*일|하루|이틀|사흘|나흘)\s*(?:뒤|후|후에|이후|전|전에|이전))(?:까지의|까지|에는|에|이|가|은|는)?(?=\s|$)/,s=/(?:^|\s)((?:이번주|다음주)?\s*[월화수목금토일]요일)(?:까지의|까지|에는|에|이|가|은|는)?(?=\s|$)/,n=new RegExp("(?<!\\d)(\\d{1,2}\\s*월\\s*\\d{1,2}\\s*일?)(?:까지의|까지|에는|에|이|가|은|는)?(?=\\s|$)"),o=new RegExp("(?<!\\d)(\\d{1,2}[/\\-.]\\d{1,2})(?:일|요일|까지의|까지|에는|에|이|가|은|는)?(?=\\s|$)"),c=new RegExp("(?<!\\d)(\\d{4}[/\\-.]\\d{1,2}[/\\-.]\\d{1,2})(?:까지의|까지|에는|에|이|가|은|는)?(?=\\s|$)");let d="",r=a,l=r.match(c);if(l){const u=l[0].trim(),h=l[1].trim(),m=D(h);m&&(d=m,r=r.replace(u,"").trim())}if(!d&&(l=r.match(n)||r.match(o),l)){const u=l[0].trim(),h=l[1].trim(),m=D(h);m&&(d=m,r=r.replace(u,"").trim())}if(!d&&(l=r.match(s),l)){const u=l[0].trim(),h=l[1].trim(),m=D(h);m&&(d=m,r=r.replace(u,"").trim())}if(!d&&(l=r.match(e),l)){const u=l[0].trim(),h=l[1].trim(),m=D(h);m&&(d=m,r=r.replace(u,"").trim())}if(!d&&(l=r.match(t),l)){const u=l[0].trim(),h=l[1].trim(),m=D(h);m&&(d=m,r=r.replace(u,"").trim())}return r=r.replace(/\s+/g," ").trim(),r=r.replace(/^(까지|에|은|는|이|가|까지의)\s+/,""),r=r.replace(/\s+(까지|e|에|은|는|이|가|까지의)$/,""),r=r.trim(),{title:r,dueDate:d}}const U=document.getElementById("app-content"),ot=document.getElementById("btn-board-view"),rt=document.getElementById("btn-calendar-view"),it=document.getElementById("btn-dashboard-view"),Et=document.getElementById("btn-add-task"),L=document.getElementById("btn-migrate-sync"),C=document.getElementById("btn-theme-toggle"),A=document.getElementById("btn-sync-now"),X=document.getElementById("sync-status-text"),Z=document.getElementById("sync-status-icon");let S=null;function ct(a){const t=a.currentView;Ct(a.theme),Tt(a.theme),ot.classList.toggle("active",t==="board"),rt.classList.toggle("active",t==="calendar"),it.classList.toggle("active",t==="dashboard"),N(),t==="calendar"?(U.innerHTML=St(),Ot()):t==="dashboard"?(U.innerHTML=xt(),Vt()):(U.innerHTML=kt(),Nt(),_t()),window.lucide&&window.lucide.createIcons(),It()}i.subscribe(ct);function dt(a){if(!A||!X||!Z)return;const t=a&&a.status?a.status:"local",e={local:"hard-drive",connecting:"cloud",syncing:"refresh-cw",synced:"cloud-check",error:"cloud-alert"};A.dataset.status=t,Z.setAttribute("data-lucide",e[t]||"cloud"),X.textContent=a&&a.message?a.message:"이 브라우저",A.title=a&&a.error?a.error:"동기화 새로고침",window.lucide&&window.lucide.createIcons()}window.addEventListener("graduate-kanban-sync",a=>dt(a.detail));function Ct(a){const t=a==="dark";document.documentElement.classList.toggle("theme-dark",t),document.body.classList.toggle("theme-dark",t),document.documentElement.style.colorScheme=t?"dark":"light";const e=document.querySelector('meta[name="theme-color"]');e&&e.setAttribute("content",t?"#0f1115":"#0070f3")}function Tt(a){if(!C)return;const t=a==="dark",e=C.querySelector("i"),s=C.querySelector("span");C.setAttribute("aria-pressed",String(t)),C.setAttribute("aria-label",t?"라이트 모드 전환":"다크 모드 전환"),C.title=t?"라이트 모드 전환":"다크 모드 전환",e&&e.setAttribute("data-lucide",t?"sun":"moon"),s&&(s.textContent=t?"라이트":"다크")}function $t(a){const t=JSON.stringify(a),e=new TextEncoder().encode(t);let s="";return e.forEach(n=>{s+=String.fromCharCode(n)}),btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}function Dt(a){const t=a.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(a.length/4)*4,"="),e=atob(t),s=Uint8Array.from(e,n=>n.charCodeAt(0));return JSON.parse(new TextDecoder().decode(s))}function Lt(){if(!L)return;const a=i.getSyncState();L.hidden=!!a.enabled}function At(){const a=i.createSnapshot(),t=Array.isArray(a.tasks)?a.tasks.length:0;if(window.confirm(`이 브라우저에 있는 할 일 ${t}개와 메모를 Google 동기화판으로 옮길까요?`))try{const s=$t(a);window.location.href=`${pt}#import=${s}`}catch(s){window.alert(`자동 이동 준비 중 오류가 났어요: ${s.message||s}`)}}async function Mt(){if(!i.getSyncState().enabled)return!1;const a=window.location.hash.match(/^#import=(.+)$/);if(!a)return!1;try{const t=Dt(a[1]);window.history.replaceState(null,"",window.location.pathname+window.location.search);const e=Array.isArray(t.tasks)?t.tasks.length:0;return window.confirm(`이전 보드의 할 일 ${e}개와 메모를 Google Sheets 동기화판에 저장할까요?`)?(i.importSnapshotData(t),await i.initRemoteSync(!0),window.alert("이전 보드 내용을 동기화판으로 옮겼어요."),!0):(i.initRemoteSync(),!0)}catch(t){return window.alert(`이전 보드 내용을 읽지 못했어요: ${t.message||t}`),i.initRemoteSync(),!0}}function M(a,t){S={type:a,key:t}}function T(){S=null}function It(){if(!S)return;const{type:a,key:t}=S;if(a==="board-add"&&i.getCurrentView()==="board"){const e=document.querySelector(`.static-inline-add[data-status="${t}"]`),s=e&&e.querySelector(".static-title-input");s&&s.focus()}else if(a==="calendar-add"&&i.getCurrentView()==="calendar"){const e=document.querySelector(`.calendar-static-add-container[data-date="${t}"]`),s=e&&e.querySelector(".calendar-static-input");s&&s.focus()}}function N(){const a=document.querySelector(".move-menu");a&&a.remove()}let _=null;function Bt(a){F();const t=i.getTasks().find(c=>c.id===a);if(!t)return;const e=i.getCategories(),s=document.createElement("div");s.className="drag-drop-panel";const n=document.createElement("div");n.className="drag-drop-panel-title",n.textContent="여기 폴더에 놓기",s.appendChild(n),e.forEach(c=>{const d=c===t.category,r=document.createElement("div");r.className="drag-drop-zone"+(d?" is-current":"");const l=document.createElement("i");l.setAttribute("data-lucide",d?"folder-open":"folder"),r.appendChild(l);const u=document.createElement("span");u.textContent=d?`${c} (현재)`:c,r.appendChild(u),r.addEventListener("dragenter",h=>{h.preventDefault(),r.classList.add("over")}),r.addEventListener("dragover",h=>{h.preventDefault(),h.dataTransfer.dropEffect="move",r.classList.add("over")}),r.addEventListener("dragleave",()=>r.classList.remove("over")),r.addEventListener("drop",h=>{h.preventDefault(),h.stopPropagation();const m=h.dataTransfer.getData("text/plain")||a;i.updateTask(m,{category:c}),F()}),s.appendChild(r)}),document.body.appendChild(s),_=s;const o=document.querySelector(`.task-card[data-id="${a}"]`);if(o){const c=o.getBoundingClientRect(),d=190;let r=c.right+14;r+d>window.innerWidth-8&&(r=Math.max(8,c.left-d-14)),s.style.position="fixed",s.style.right="auto",s.style.transform="none",s.style.left=r+"px",s.style.top=c.top+"px";const l=s.offsetHeight;c.top+l>window.innerHeight-8&&(s.style.top=Math.max(8,window.innerHeight-l-8)+"px")}window.lucide&&window.lucide.createIcons()}function F(){_&&(_.remove(),_=null)}function Rt(a,t){N();const e=i.getTasks().find(l=>l.id===t);if(!e)return;const s=i.getCategories().filter(l=>l!==e.category);if(s.length===0){window.alert("옮길 다른 탭이 없어요. 먼저 위쪽 '+ 탭 추가'로 탭을 만드세요.");return}const n=document.createElement("div");n.className="move-menu";const o=document.createElement("div");o.className="move-menu-title",o.textContent="어느 탭으로 옮길까요?",n.appendChild(o),s.forEach(l=>{const u=document.createElement("button");u.className="move-menu-item",u.textContent=l,u.addEventListener("click",h=>{h.stopPropagation(),i.updateTask(t,{category:l}),N()}),n.appendChild(u)}),document.body.appendChild(n);const c=a.getBoundingClientRect();let r=window.scrollX+c.right-160;r<8&&(r=8),n.style.top=window.scrollY+c.bottom+6+"px",n.style.left=r+"px",setTimeout(()=>{document.addEventListener("click",function l(u){n.contains(u.target)||(N(),document.removeEventListener("click",l))})},0)}function Nt(){document.querySelectorAll(".task-card").forEach(t=>{t.addEventListener("dragstart",e=>{if(t.querySelector("input")){e.preventDefault();return}e.dataTransfer.setData("text/plain",t.dataset.id),e.dataTransfer.effectAllowed="move",setTimeout(()=>t.classList.add("dragging"),0),Bt(t.dataset.id)}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),F()})}),document.querySelectorAll(".static-inline-add .static-title-input").forEach(t=>{const s=t.closest(".static-inline-add").dataset.status;t.addEventListener("focus",()=>M("board-add",s)),t.addEventListener("blur",()=>{setTimeout(()=>{S&&S.type==="board-add"&&S.key===s&&document.activeElement!==t&&T()},100)}),t.addEventListener("keydown",n=>{if(!(n.isComposing||n.keyCode===229))if(n.key==="Enter"){n.preventDefault();const o=t.value.trim();if(!o)return;M("board-add",s);const{title:c,dueDate:d}=nt(o);if(!c)return;i.addTask(c,d)}else n.key==="Escape"&&(t.value="",t.blur(),T())})}),document.querySelectorAll(".inline-edit-title").forEach(t=>{t.addEventListener("dblclick",e=>{if(e.stopPropagation(),t.querySelector("input"))return;const s=t.dataset.id,n=i.getTasks().find(u=>u.id===s),o=n?n.title:t.textContent.trim(),c=document.createElement("input");c.type="text",c.className="form-input py-1 px-1.5 text-xs w-full",c.style.fontFamily="inherit",c.value=o,t.innerHTML="",t.appendChild(c),c.focus(),c.select();let d=!1;T();const r=()=>{if(d)return;d=!0;const u=c.value.trim();u&&u!==o?i.updateTask(s,{title:u}):t.textContent=o},l=()=>{d||(d=!0,t.textContent=o)};c.addEventListener("blur",r),c.addEventListener("keydown",u=>{u.isComposing||u.keyCode===229||(u.key==="Enter"?(u.preventDefault(),r()):u.key==="Escape"&&(u.preventDefault(),l()))})})}),document.querySelectorAll(".task-card-due").forEach(t=>{t.addEventListener("click",e=>{if(e.stopPropagation(),t.querySelector("input"))return;const s=t.dataset.id,n=t.querySelector(".due-text"),o=i.getTasks().find(m=>m.id===s),c=o?o.dueDate:n?n.textContent.trim():"",d=document.createElement("input");d.type="text",d.className="form-input py-0.5 px-1 text-[11px] font-mono",d.style.width="140px",d.style.display="inline-block",d.placeholder="예: 오늘, 내일, 6/17",d.value=c;const r=t.querySelector("i");r&&(r.style.display="none"),n&&(n.style.display="none"),t.appendChild(d),d.focus(),d.select();let l=!1;T();const u=()=>{if(l)return;l=!0;const m=d.value.trim();if(m){const g=D(m)||m;i.updateTask(s,{dueDate:g})}else i.updateTask(s,{dueDate:""})},h=()=>{l||(l=!0,r&&(r.style.display=""),n&&(n.style.display=""),d.remove())};d.addEventListener("blur",u),d.addEventListener("keydown",m=>{m.isComposing||m.keyCode===229||(m.key==="Enter"?(m.preventDefault(),u()):m.key==="Escape"&&(m.preventDefault(),h()))})})}),document.querySelectorAll(".delete-task-btn").forEach(t=>{t.addEventListener("click",e=>{e.stopPropagation(),i.deleteTask(t.dataset.id)})}),document.querySelectorAll(".reminder-check-btn").forEach(t=>{t.addEventListener("click",e=>{e.stopPropagation();const s=t.dataset.id,n=t.dataset.status==="done"?"todo":"done";i.updateTaskStatus(s,n)})}),document.querySelectorAll(".card-move-btn").forEach(t=>{t.addEventListener("click",e=>{e.stopPropagation(),Rt(t,t.dataset.id)})});const a=document.getElementById("done-toggle-btn");a&&a.addEventListener("click",t=>{t.stopPropagation(),i.toggleCompletedHidden()})}function _t(){const a=document.getElementById("cat-tab-edit-toggle");a&&a.addEventListener("click",e=>{e.stopPropagation(),i.toggleCategoryEditMode()}),document.querySelectorAll(".cat-tab").forEach(e=>{e.addEventListener("click",()=>{i.isCategoryEditMode()&&e.classList.contains("cat-tab-named")||e.dataset.cat&&i.setActiveCategory(e.dataset.cat)})}),document.querySelectorAll(".cat-tab-wrap").forEach(e=>{const s=e.dataset.cat;e.addEventListener("dragover",n=>{n.preventDefault(),e.classList.add("tab-drop-over")}),e.addEventListener("dragleave",()=>e.classList.remove("tab-drop-over")),e.addEventListener("drop",n=>{n.preventDefault(),e.classList.remove("tab-drop-over");const o=n.dataTransfer.getData("text/plain");o&&s&&i.updateTask(o,{category:s})})}),document.querySelectorAll(".cat-tab-named").forEach(e=>{e.addEventListener("dblclick",s=>{if(s.stopPropagation(),s.preventDefault(),!i.isCategoryEditMode()||e.querySelector("input"))return;const n=e.dataset.cat,o=document.createElement("input");o.type="text",o.className="cat-tab-edit-input form-input",o.value=n,e.textContent="",e.appendChild(o),o.focus(),o.select();let c=!1;const d=r=>{if(c)return;c=!0;const l=o.value.trim();if(r&&l&&l!==n){const u=i.renameCategory(n,l);u.ok||(u.message&&window.alert(u.message),i.notify())}else i.notify()};o.addEventListener("keydown",r=>{r.isComposing||r.keyCode===229||(r.key==="Enter"?(r.preventDefault(),d(!0)):r.key==="Escape"&&(r.preventDefault(),d(!1)))}),o.addEventListener("blur",()=>d(!0))})}),document.querySelectorAll(".cat-tab-delete").forEach(e=>{e.addEventListener("click",s=>{if(s.stopPropagation(),!i.isCategoryEditMode())return;const n=e.dataset.cat;if(!window.confirm(`'${n}' 탭을 삭제할까요?

이 탭의 할 일은 사라지지 않고 다른 탭으로 옮겨집니다.`))return;const c=i.deleteCategory(n);!c.ok&&c.message&&window.alert(c.message)})});const t=document.getElementById("cat-tab-add-btn");t&&t.addEventListener("click",()=>{if(document.getElementById("cat-tab-add-input"))return;const e=document.createElement("input");e.id="cat-tab-add-input",e.type="text",e.className="cat-tab-edit-input form-input",e.placeholder="새 탭 이름",t.parentNode.insertBefore(e,t),t.style.display="none",e.focus();let s=!1;const n=o=>{if(s)return;s=!0;const c=e.value.trim();if(e.parentNode&&e.remove(),t.style.display="",o&&c){const d=i.addCategory(c);!d.ok&&d.message&&window.alert(d.message)}};e.addEventListener("keydown",o=>{o.isComposing||o.keyCode===229||(o.key==="Enter"?(o.preventDefault(),n(!0)):o.key==="Escape"&&(o.preventDefault(),n(!1)))}),e.addEventListener("blur",()=>n(!0))})}function Ot(){const a=document.getElementById("calendar-prev-btn"),t=document.getElementById("calendar-next-btn"),e=document.getElementById("calendar-today-btn");a&&t&&e&&(a.addEventListener("click",()=>{const s=i.getCurrentMonth();i.setCalendarMonth(new Date(s.getFullYear(),s.getMonth()-1,1))}),t.addEventListener("click",()=>{const s=i.getCurrentMonth();i.setCalendarMonth(new Date(s.getFullYear(),s.getMonth()+1,1))}),e.addEventListener("click",()=>i.setCalendarMonth(new Date))),document.querySelectorAll(".calendar-static-input").forEach(s=>{const o=s.closest(".calendar-static-add-container").dataset.date;s.addEventListener("focus",()=>M("calendar-add",o)),s.addEventListener("blur",()=>{setTimeout(()=>{S&&S.type==="calendar-add"&&S.key===o&&document.activeElement!==s&&T()},100)}),s.addEventListener("keydown",c=>{if(!(c.isComposing||c.keyCode===229))if(c.key==="Enter"){c.preventDefault();const d=s.value.trim();if(!d)return;M("calendar-add",o);const{title:r,dueDate:l}=nt(d);if(!r)return;i.addTask(r,l||o)}else c.key==="Escape"&&(s.value="",s.blur(),T())})}),document.querySelectorAll(".calendar-inline-edit-pill").forEach(s=>{s.addEventListener("dblclick",n=>{if(n.stopPropagation(),s.querySelector("input"))return;const o=s.dataset.id,c=i.getTasks().find(m=>m.id===o),d=c?c.title:s.textContent.trim(),r=document.createElement("input");r.type="text",r.className="form-input py-0.5 px-1 text-[9px] w-full",r.style.height="16px",r.value=d,s.innerHTML="",s.appendChild(r),r.focus(),r.select();let l=!1;T();const u=()=>{if(l)return;l=!0;const m=r.value.trim();m&&m!==d?i.updateTask(o,{title:m}):i.notify()},h=()=>{l||(l=!0,i.notify())};r.addEventListener("blur",u),r.addEventListener("keydown",m=>{m.isComposing||m.keyCode===229||(m.key==="Enter"?(m.preventDefault(),u()):m.key==="Escape"&&(m.preventDefault(),h()))})})})}function Vt(){const a=document.getElementById("dashboard-notepad");a&&a.addEventListener("input",t=>i.saveMemo(t.target.value)),document.querySelectorAll(".btn-quick-done").forEach(t=>{t.addEventListener("click",()=>i.updateTaskStatus(t.dataset.id,"done"))}),document.querySelectorAll(".dash-cat-link").forEach(t=>{t.addEventListener("click",()=>{i.setActiveCategory(t.dataset.cat),i.setView("board")})})}ot.addEventListener("click",()=>i.setView("board"));rt.addEventListener("click",()=>i.setView("calendar"));it.addEventListener("click",()=>i.setView("dashboard"));L&&!L.dataset.migrationBound&&(L.dataset.migrationBound="1",L.addEventListener("click",At));A&&A.addEventListener("click",()=>i.refreshFromRemote(!0));C&&C.addEventListener("click",()=>i.toggleTheme());Et.addEventListener("click",()=>{i.getCurrentView()!=="board"?(i.setView("board"),setTimeout(O,50)):O()});function O(){const a=document.querySelector('.static-inline-add[data-status="todo"]'),t=a&&a.querySelector(".static-title-input");t&&(t.focus(),M("board-add","todo"))}const Q=document.getElementById("btn-export-data"),tt=document.getElementById("btn-import-data"),R=document.getElementById("import-file-input");Q&&Q.addEventListener("click",()=>{const a=i.exportData(),t=new Blob([a],{type:"application/json"}),e=URL.createObjectURL(t),s=document.createElement("a"),n=new Date().toISOString().split("T")[0];s.href=e,s.download=`졸업칸반-백업-${n}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),setTimeout(()=>URL.revokeObjectURL(e),1e3)});tt&&R&&(tt.addEventListener("click",()=>R.click()),R.addEventListener("change",a=>{const t=a.target.files&&a.target.files[0];if(!t)return;const e=new FileReader;e.onload=s=>{const n=i.importData(s.target.result);n.ok?window.alert(`불러오기 완료! 할 일 ${n.count}개를 가져왔어요.`):window.alert(n.message),R.value=""},e.readAsText(t)}));function z(){const a=document.getElementById("shortcut-help");a&&a.remove()}function Kt(){if(document.getElementById("shortcut-help")){z();return}const a=document.createElement("div");a.id="shortcut-help",a.className="shortcut-help-overlay",a.innerHTML=`
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
    </div>`,a.addEventListener("click",t=>{t.target===a&&z()}),document.body.appendChild(a)}document.addEventListener("keydown",a=>{const t=document.activeElement,e=t?t.tagName:"",s=e==="INPUT"||e==="TEXTAREA"||t&&t.isContentEditable;if(a.code==="Escape"){z();return}if(!(s||a.metaKey||a.ctrlKey||a.altKey||a.isComposing))if(a.code==="KeyN")a.preventDefault(),i.getCurrentView()!=="board"?(i.setView("board"),setTimeout(O,60)):O();else if(a.code==="KeyB")i.setView("board");else if(a.code==="KeyC")i.setView("calendar");else if(a.code==="KeyD")i.setView("dashboard");else if(/^Digit[1-9]$/.test(a.code)){const n=parseInt(a.code.replace("Digit",""),10)-1,o=[f,...i.getCategories()];n<o.length&&(i.getCurrentView()!=="board"&&i.setView("board"),i.setActiveCategory(o[n]))}else(a.key==="?"||a.code==="Slash"&&a.shiftKey)&&(a.preventDefault(),Kt())});async function qt(){ct(i.state),dt(i.getSyncState()),Lt(),await Mt()||i.initRemoteSync()}let et=!1;function lt(){et||(et=!0,qt())}document.addEventListener("DOMContentLoaded",lt);(document.readyState==="interactive"||document.readyState==="complete")&&lt();

// init dom vite fait
let taskInput=document.getElementById('taskInput')
let taskTagSelect=document.getElementById('taskTagSelect')
let dueDateInput=document.getElementById('dueDate')
let addTaskBtn=document.getElementById('addTask')
let todoList=document.getElementById('todoList')
let exportBtn=document.getElementById('exportJSON')
let searchInput=document.getElementById('searchInput')
let themeSwitch=document.getElementById('themeSwitch')

let newTagName=document.getElementById('newTagName')
let newTagColor=document.getElementById('newTagColor')
let addTagBtn=document.getElementById('addTagBtn')
let tagsList=document.getElementById('tagsList')

// localstorage rapide
let tasks=JSON.parse(localStorage.getItem('tasks'))||[]
let tags=JSON.parse(localStorage.getItem('tags'))||[]

// save vite
function saveTasks(){localStorage.setItem('tasks',JSON.stringify(tasks))}
function saveTags(){localStorage.setItem('tags',JSON.stringify(tags));renderTagSelect();renderTagList()}

// render select
function renderTagSelect(){taskTagSelect.innerHTML='';tags.forEach((t,i)=>{let o=document.createElement('option');o.value=i;o.textContent=t.name;o.style.backgroundColor=t.color;taskTagSelect.appendChild(o)})}

// render sidebar tags
function renderTagList(){tagsList.innerHTML='';tags.forEach(t=>{let d=document.createElement('div');d.className='tag';d.textContent=t.name;d.style.backgroundColor=t.color;tagsList.appendChild(d)})}

// render tasks
function renderTasks(){
  let s=searchInput.value.toLowerCase()
  todoList.innerHTML=''
  tasks.filter(t=>t.text.toLowerCase().includes(s)).forEach((t,i)=>{
    let div=document.createElement('div');div.className='task'
    let left=document.createElement('div');left.className='task-left'
    let sq=document.createElement('div');sq.className='task-square';sq.style.backgroundColor=t.tags.length>0?tags[t.tags[0]].color:'#999'
    let cb=document.createElement('input');cb.type='checkbox';cb.checked=t.done;cb.addEventListener('change',()=>{t.done=cb.checked;saveTasks();renderTasks()})
    let txt=document.createElement('div');txt.className='task-text';txt.textContent=`${t.text} (${t.dueDate||'pas de date'})`
    let tgs=document.createElement('div');tgs.className='task-tags';t.tags.forEach(idx=>{if(tags[idx]){let tg=document.createElement('div');tg.className='tag';tg.textContent=tags[idx].name;tg.style.backgroundColor=tags[idx].color;tgs.appendChild(tg)}})
    left.appendChild(sq);left.appendChild(cb);left.appendChild(txt);left.appendChild(tgs)
    let del=document.createElement('button');del.textContent='❌';del.addEventListener('click',()=>{div.style.opacity=0;div.style.transform='translateX(50px)';setTimeout(()=>{tasks.splice(i,1);saveTasks();renderTasks()},300)})
    div.appendChild(left);div.appendChild(del);todoList.appendChild(div)
  })
}

// add task
addTaskBtn.addEventListener('click',()=>{
  let t=taskInput.value.trim();if(!t)return
  let sel=Array.from(taskTagSelect.selectedOptions).map(o=>parseInt(o.value))
  let d=dueDateInput.value
  tasks.push({text:t,tags:sel,dueDate:d,done:false})
  taskInput.value='';taskTagSelect.selectedIndex=-1;dueDateInput.value=''
  saveTasks();renderTasks()
})

// search
searchInput.addEventListener('input',renderTasks)

// add tag
addTagBtn.addEventListener('click',()=>{
  let n=newTagName.value.trim();if(!n)return
  let c=newTagColor.value
  tags.push({name:n,color:c})
  newTagName.value=''
  saveTags()
})

// export
exportBtn.addEventListener('click',()=>{
  let data="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(tasks,null,2))
  let a=document.createElement('a');a.href=data;a.download="tasks.json";a.click()
})

// theme
themeSwitch.addEventListener('change',()=>{document.body.classList.toggle('light',themeSwitch.checked)})

// init
saveTags();renderTasks()

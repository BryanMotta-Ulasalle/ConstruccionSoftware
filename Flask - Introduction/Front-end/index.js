const API_BASE = 'http://localhost:5000';

// ── State ────────────────────────────────────────────────────
let tasks      = [];
let users      = [];
let editingTaskId = null;
let editingUserId = null;

// ── DOM: Tasks ───────────────────────────────────────────────
const tasksTbody  = document.getElementById('tasks-tbody');
const taskModal   = document.getElementById('task-modal');
const modalTitle  = document.getElementById('modal-title');
const inputTitle  = document.getElementById('input-title');
const inputContent= document.getElementById('input-content');
const inputStatus = document.getElementById('input-status');
const btnSave     = document.getElementById('btn-save');
const btnCancel   = document.getElementById('btn-cancel');
const btnNewTask  = document.getElementById('btn-new-task');
const backdrop    = document.getElementById('modal-backdrop');

// ── DOM: Users ───────────────────────────────────────────────
const usersTbody      = document.getElementById('users-tbody');
const userModal       = document.getElementById('user-modal');
const userModalTitle  = document.getElementById('user-modal-title');
const inputName       = document.getElementById('input-name');
const inputLastname   = document.getElementById('input-lastname');
const inputCity       = document.getElementById('input-city');
const inputCountry    = document.getElementById('input-country');
const inputCode       = document.getElementById('input-code');
const btnUserSave     = document.getElementById('btn-user-save');
const btnUserCancel   = document.getElementById('btn-user-cancel');
const btnNewUser      = document.getElementById('btn-new-user');
const userBackdrop    = document.getElementById('user-modal-backdrop');

// ── Toast ────────────────────────────────────────────────────
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    const icon  = document.getElementById('toast-icon');
    const msgEl = document.getElementById('toast-msg');
    icon.textContent  = isError ? 'error' : 'check_circle';
    msgEl.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── SPA Navigation ───────────────────────────────────────────
function navigateTo(section) {
    // Toggle sections
    document.getElementById('section-tasks').classList.toggle('hidden', section !== 'tasks');
    document.getElementById('section-users').classList.toggle('hidden', section !== 'users');

    // Update sidebar active state
    const navTasks = document.getElementById('nav-tasks');
    const navUsers = document.getElementById('nav-users');

    const activeClass   = ['bg-white', 'text-indigo-900', 'shadow-sm', 'font-bold', 'translate-x-1'];
    const inactiveClass = ['text-slate-600', 'hover:bg-slate-200', 'font-medium'];

    if (section === 'tasks') {
        navTasks.classList.add(...activeClass);
        navTasks.classList.remove(...inactiveClass);
        navUsers.classList.remove(...activeClass);
        navUsers.classList.add(...inactiveClass);
        fetchTasks();
    } else {
        navUsers.classList.add(...activeClass);
        navUsers.classList.remove(...inactiveClass);
        navTasks.classList.remove(...activeClass);
        navTasks.classList.add(...inactiveClass);
        fetchUsers();
    }
}

// ── Escape HTML ──────────────────────────────────────────────
function escHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ════════════════════════════════════════════════════════════
//  TASKS
// ════════════════════════════════════════════════════════════

function normalizeTask(t) {
    let status = 'In Progress';
    if (t.done === true) status = 'Completed';
    return { id: t.id, title: t.title || '', content: t.content || '', done: t.done, status };
}

function updateTaskStats() {
    document.getElementById('stat-in-progress').textContent = tasks.filter(t => t.status === 'In Progress').length;
    document.getElementById('stat-completed').textContent   = tasks.filter(t => t.status === 'Completed').length;
    document.getElementById('stat-total').textContent       = tasks.length;
}

function statusBadge(status) {
    if (status === 'In Progress') return `
        <div class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
        <span class="px-2.5 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold uppercase rounded-md">In Progress</span>`;
    if (status === 'Completed') return `
        <span class="px-2.5 py-1 bg-secondary text-white text-[10px] font-bold uppercase rounded-md">Completed</span>`;
    return `<span class="px-2.5 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold uppercase rounded-md">Backlog</span>`;
}

function renderTasks() {
    if (tasks.length === 0) {
        tasksTbody.innerHTML = `<tr><td colspan="4" class="px-4 py-12 text-center text-slate-400 text-sm">
            <span class="material-symbols-outlined text-3xl mb-2 block opacity-30">inbox</span>
            No hay tareas aún. ¡Crea la primera!
        </td></tr>`;
        return;
    }
    tasksTbody.innerHTML = tasks.map(task => `
        <tr class="group hover:bg-surface-container-low transition-all rounded-xl cursor-pointer">
            <td class="px-4 py-5 rounded-l-xl"><span class="font-bold text-indigo-950">${escHtml(task.title)}</span></td>
            <td class="px-4 py-5"><p class="text-on-surface-variant line-clamp-1">${escHtml(task.content)}</p></td>
            <td class="px-4 py-5"><div class="flex items-center gap-2">${statusBadge(task.status)}</div></td>
            <td class="px-4 py-5 text-right rounded-r-xl">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openEditTask(${task.id})" class="p-1.5 text-slate-400 hover:text-primary transition-colors hover:bg-white rounded-lg shadow-sm">
                        <span class="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onclick="deleteTask(${task.id})" class="p-1.5 text-slate-400 hover:text-error transition-colors hover:bg-white rounded-lg shadow-sm">
                        <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            </td>
        </tr>`).join('');
}

async function fetchTasks() {
    try {
        const res  = await fetch(`${API_BASE}/tasks`);
        const json = await res.json();
        tasks = json.tasks.map(normalizeTask);
        updateTaskStats();
        renderTasks();
    } catch (err) {
        tasksTbody.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-error text-sm">Error al cargar las tareas: ${err.message}</td></tr>`;
        showToast('Error al cargar las tareas', true);
    }
}

async function apiCreateTask(payload) {
    const res  = await fetch(`${API_BASE}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Error al crear tarea');
    const json = await res.json();
    return normalizeTask(json.task);
}

async function apiUpdateTask(id, payload) {
    const res  = await fetch(`${API_BASE}/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Error al actualizar tarea');
    const json = await res.json();
    return normalizeTask(json.task);
}

async function deleteTask(id) {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    try {
        const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        tasks = tasks.filter(t => t.id !== id);
        updateTaskStats();
        renderTasks();
        showToast('Tarea eliminada');
    } catch { showToast('Error al eliminar la tarea', true); }
}

function openCreateTask() {
    editingTaskId = null;
    modalTitle.textContent = 'Nueva Tarea';
    inputTitle.value = ''; inputContent.value = ''; inputStatus.value = 'Backlog';
    taskModal.classList.remove('hidden');
}

function openEditTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    editingTaskId = id;
    modalTitle.textContent = 'Editar Tarea';
    inputTitle.value   = task.title;
    inputContent.value = task.content;
    inputStatus.value  = task.status;
    taskModal.classList.remove('hidden');
}

function closeTaskModal() { taskModal.classList.add('hidden'); editingTaskId = null; }

btnSave.addEventListener('click', async () => {
    const title   = inputTitle.value.trim();
    const content = inputContent.value.trim();
    const status  = inputStatus.value;
    const done    = status === 'Completed';
    if (!title) {
        inputTitle.classList.add('ring-2', 'ring-red-400');
        setTimeout(() => inputTitle.classList.remove('ring-2', 'ring-red-400'), 1500);
        return;
    }
    btnSave.disabled = true; btnSave.textContent = 'Guardando...';
    try {
        if (editingTaskId === null) {
            tasks.push(await apiCreateTask({ title, content, done }));
            showToast('Tarea creada exitosamente');
        } else {
            tasks = tasks.map(t => t.id === editingTaskId ? null : t);
            const updated = await apiUpdateTask(editingTaskId, { title, content, done });
            tasks = tasks.map(t => t === null ? updated : t);
            showToast('Tarea actualizada');
        }
        updateTaskStats(); renderTasks(); closeTaskModal();
    } catch (err) { console.error(err); showToast('Error al guardar la tarea', true); }
    finally { btnSave.disabled = false; btnSave.textContent = 'Guardar'; }
});

btnNewTask.addEventListener('click', openCreateTask);
btnCancel.addEventListener('click', closeTaskModal);
backdrop.addEventListener('click', closeTaskModal);

// ════════════════════════════════════════════════════════════
//  USERS
// ════════════════════════════════════════════════════════════

function updateUserStats() {
    document.getElementById('stat-total-users').textContent = users.length;
}

function renderUsers() {
    if (users.length === 0) {
        usersTbody.innerHTML = `<tr><td colspan="6" class="px-4 py-12 text-center text-slate-400 text-sm">
            <span class="material-symbols-outlined text-3xl mb-2 block opacity-30">group</span>
            No hay usuarios aún. ¡Agrega el primero!
        </td></tr>`;
        return;
    }
    usersTbody.innerHTML = users.map(user => `
        <tr class="group hover:bg-surface-container-low transition-all rounded-xl cursor-pointer">
            <td class="px-4 py-5 rounded-l-xl"><span class="font-bold text-indigo-950">${escHtml(user.name)}</span></td>
            <td class="px-4 py-5"><span class="text-on-surface-variant">${escHtml(user.lastname)}</span></td>
            <td class="px-4 py-5"><span class="text-on-surface-variant">${escHtml(user.address?.city)}</span></td>
            <td class="px-4 py-5"><span class="text-on-surface-variant">${escHtml(user.address?.country)}</span></td>
            <td class="px-4 py-5">
                <span class="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">${escHtml(user.address?.code)}</span>
            </td>
            <td class="px-4 py-5 text-right rounded-r-xl">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openEditUser(${user.id})" class="p-1.5 text-slate-400 hover:text-primary transition-colors hover:bg-white rounded-lg shadow-sm">
                        <span class="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onclick="deleteUser(${user.id})" class="p-1.5 text-slate-400 hover:text-error transition-colors hover:bg-white rounded-lg shadow-sm">
                        <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            </td>
        </tr>`).join('');
}

async function fetchUsers() {
    try {
        const res  = await fetch(`${API_BASE}/users`);
        const json = await res.json();
        users = json.users ?? [];
        updateUserStats();
        renderUsers();
    } catch (err) {
        usersTbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-error text-sm">Error al cargar los usuarios: ${err.message}</td></tr>`;
        showToast('Error al cargar los usuarios', true);
    }
}

async function apiCreateUser(payload) {
    const res  = await fetch(`${API_BASE}/user`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Error al crear usuario');
    const json = await res.json();
    return json.user;
}

async function apiUpdateUser(id, payload) {
    const res  = await fetch(`${API_BASE}/user/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Error al actualizar usuario');
    const json = await res.json();
    return json.user;
}

async function deleteUser(id) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
        const res = await fetch(`${API_BASE}/user/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        users = users.filter(u => u.id !== id);
        updateUserStats();
        renderUsers();
        showToast('Usuario eliminado');
    } catch { showToast('Error al eliminar el usuario', true); }
}

function openCreateUser() {
    editingUserId = null;
    userModalTitle.textContent = 'Nuevo Usuario';
    inputName.value = ''; inputLastname.value = '';
    inputCity.value = ''; inputCountry.value = ''; inputCode.value = '';
    userModal.classList.remove('hidden');
}

function openEditUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    editingUserId = id;
    userModalTitle.textContent = 'Editar Usuario';
    inputName.value     = user.name;
    inputLastname.value = user.lastname;
    inputCity.value     = user.address?.city    || '';
    inputCountry.value  = user.address?.country || '';
    inputCode.value     = user.address?.code    || '';
    userModal.classList.remove('hidden');
}

function closeUserModal() { userModal.classList.add('hidden'); editingUserId = null; }

btnUserSave.addEventListener('click', async () => {
    const name     = inputName.value.trim();
    const lastname = inputLastname.value.trim();
    const address  = { city: inputCity.value.trim(), country: inputCountry.value.trim(), code: inputCode.value.trim() };
    if (!name) {
        inputName.classList.add('ring-2', 'ring-red-400');
        setTimeout(() => inputName.classList.remove('ring-2', 'ring-red-400'), 1500);
        return;
    }
    btnUserSave.disabled = true; btnUserSave.textContent = 'Guardando...';
    try {
        if (editingUserId === null) {
            users.push(await apiCreateUser({ name, lastname, address }));
            showToast('Usuario creado exitosamente');
        } else {
            const updated = await apiUpdateUser(editingUserId, { name, lastname, address });
            users = users.map(u => u.id === editingUserId ? updated : u);
            showToast('Usuario actualizado');
        }
        updateUserStats(); renderUsers(); closeUserModal();
    } catch (err) { console.error(err); showToast('Error al guardar el usuario', true); }
    finally { btnUserSave.disabled = false; btnUserSave.textContent = 'Guardar'; }
});

btnNewUser.addEventListener('click', openCreateUser);
btnUserCancel.addEventListener('click', closeUserModal);
userBackdrop.addEventListener('click', closeUserModal);

// ── Escape key cierra cualquier modal abierto ────────────────
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeTaskModal(); closeUserModal(); }
});

// ── Init ─────────────────────────────────────────────────────
fetchTasks();
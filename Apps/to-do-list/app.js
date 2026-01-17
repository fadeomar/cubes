// ============================================
// Main Application Class - Core Structure
// ============================================
class TodoApp {
    constructor() {
        this.tasks = [];
        this.lists = [
            { id: 'default', name: 'Default', color: '#6366f1' }
        ];
        this.currentListId = 'all';
        this.currentFilter = { priority: 'all', sort: 'date' };
        this.searchQuery = '';
        this.editingTaskId = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderLists();
        this.renderTasks();
        this.updateStats();
        this.setupTheme();
    }

    // ============================================
    // Data Management
    // ============================================
    loadData() {
        const savedTasks = localStorage.getItem('todoTasks');
        const savedLists = localStorage.getItem('todoLists');
        
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
        
        if (savedLists) {
            this.lists = JSON.parse(savedLists);
        }
    }

    saveData() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        localStorage.setItem('todoLists', JSON.stringify(this.lists));
    }

    // ============================================
    // Task Management
    // ============================================
    addTask(taskData) {
        const task = {
            id: Date.now().toString(),
            title: taskData.title,
            description: taskData.description || '',
            completed: false,
            dueDate: taskData.dueDate || null,
            priority: taskData.priority || 'medium',
            listId: taskData.listId || 'default',
            tags: taskData.tags ? taskData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
            createdAt: new Date().toISOString(),
            recurring: taskData.recurring || false,
            recurrenceType: taskData.recurrenceType || null,
            subtasks: [],
            notes: ''
        };
        
        this.tasks.push(task);
        this.saveData();
        this.renderTasks();
        this.updateStats();
        this.scheduleNotifications(task);
    }

    updateTask(taskId, updates) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            Object.assign(task, updates);
            if (updates.tags && typeof updates.tags === 'string') {
                task.tags = updates.tags.split(',').map(t => t.trim()).filter(t => t);
            }
            this.saveData();
            this.renderTasks();
            this.updateStats();
            if (updates.dueDate) {
                this.scheduleNotifications(task);
            }
        }
    }

    deleteTask(taskId, permanent = false) {
        if (permanent) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
        } else {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.deleted = true;
                task.deletedAt = new Date().toISOString();
            }
        }
        this.saveData();
        this.renderTasks();
        this.updateStats();
    }

    restoreTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.deleted = false;
            task.deletedAt = null;
        }
        this.saveData();
        this.renderTasks();
        this.updateStats();
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveData();
            this.renderTasks();
            this.updateStats();
        }
    }

    // ============================================
    // List Management
    // ============================================
    addList(listData) {
        const list = {
            id: `list-${Date.now()}`,
            name: listData.name,
            color: listData.color || '#6366f1'
        };
        this.lists.push(list);
        this.saveData();
        this.renderLists();
    }

    deleteList(listId) {
        if (['all', 'today', 'completed', 'trash'].includes(listId)) {
            return; // Cannot delete default lists
        }
        this.lists = this.lists.filter(l => l.id !== listId);
        // Move tasks to default list
        this.tasks.forEach(task => {
            if (task.listId === listId) {
                task.listId = 'default';
            }
        });
        this.saveData();
        this.renderLists();
        this.renderTasks();
    }

    // ============================================
    // Filtering & Sorting
    // ============================================
    getFilteredTasks() {
        let filtered = [...this.tasks];

        // Filter by current list
        if (this.currentListId === 'all') {
            filtered = filtered.filter(t => !t.deleted);
        } else if (this.currentListId === 'today') {
            const today = new Date().toDateString();
            filtered = filtered.filter(t => 
                !t.deleted && 
                !t.completed && 
                t.dueDate && 
                new Date(t.dueDate).toDateString() === today
            );
        } else if (this.currentListId === 'completed') {
            filtered = filtered.filter(t => t.completed && !t.deleted);
        } else if (this.currentListId === 'trash') {
            filtered = filtered.filter(t => t.deleted);
        } else {
            filtered = filtered.filter(t => t.listId === this.currentListId && !t.deleted);
        }

        // Filter by priority
        if (this.currentFilter.priority !== 'all') {
            filtered = filtered.filter(t => t.priority === this.currentFilter.priority);
        }

        // Search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query) ||
                t.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (this.currentFilter.sort) {
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'created':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                case 'date':
                default:
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
            }
        });

        return filtered;
    }

    // ============================================
    // Rendering - Lists
    // ============================================
    renderLists() {
        const listsMenu = document.getElementById('listsMenu');
        const customLists = document.getElementById('customLists');
        
        // Update task counts
        const allCount = this.tasks.filter(t => !t.deleted).length;
        const todayCount = this.tasks.filter(t => 
            !t.deleted && !t.completed && 
            t.dueDate && 
            new Date(t.dueDate).toDateString() === new Date().toDateString()
        ).length;
        const completedCount = this.tasks.filter(t => t.completed && !t.deleted).length;
        const trashCount = this.tasks.filter(t => t.deleted).length;

        document.getElementById('allTasksCount').textContent = allCount;
        document.getElementById('todayTasksCount').textContent = todayCount;
        document.getElementById('completedTasksCount').textContent = completedCount;
        document.getElementById('trashTasksCount').textContent = trashCount;

        // Render custom lists
        customLists.innerHTML = '';
        this.lists.forEach(list => {
            const count = this.tasks.filter(t => t.listId === list.id && !t.deleted).length;
            const li = document.createElement('li');
            li.className = `list-item ${this.currentListId === list.id ? 'active' : ''}`;
            li.dataset.listId = list.id;
            li.innerHTML = `
                <span class="list-icon" style="color: ${list.color}">📁</span>
                <span class="list-name">${list.name}</span>
                <span class="task-count">${count}</span>
            `;
            li.addEventListener('click', () => this.switchList(list.id));
            customLists.appendChild(li);
        });

        // Update list select in task form
        const taskListSelect = document.getElementById('taskList');
        taskListSelect.innerHTML = '<option value="default">Default</option>';
        this.lists.forEach(list => {
            const option = document.createElement('option');
            option.value = list.id;
            option.textContent = list.name;
            taskListSelect.appendChild(option);
        });
    }

    // ============================================
    // Rendering - Tasks
    // ============================================
    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        tasksList.innerHTML = '';

        if (filteredTasks.length === 0) {
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');

        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            tasksList.appendChild(taskElement);
        });

        // Update current list title
        const listTitle = document.getElementById('currentListTitle');
        if (this.currentListId === 'all') {
            listTitle.textContent = 'All Tasks';
        } else if (this.currentListId === 'today') {
            listTitle.textContent = 'Today';
        } else if (this.currentListId === 'completed') {
            listTitle.textContent = 'Completed';
        } else if (this.currentListId === 'trash') {
            listTitle.textContent = 'Trash';
        } else {
            const list = this.lists.find(l => l.id === this.currentListId);
            listTitle.textContent = list ? list.name : 'Tasks';
        }

        document.getElementById('tasksCount').textContent = `${filteredTasks.length} task${filteredTasks.length !== 1 ? 's' : ''}`;
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''} ${task.priority ? `priority-${task.priority}` : ''}`;
        div.dataset.taskId = task.id;
        
        if (task.dueDate && new Date(task.dueDate) < new Date() && !task.completed) {
            div.classList.add('overdue');
        }

        const dueDateText = task.dueDate 
            ? new Date(task.dueDate).toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            })
            : 'No due date';

        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

        div.innerHTML = `
            <div class="task-header">
                <input type="checkbox" 
                       class="task-checkbox" 
                       ${task.completed ? 'checked' : ''}
                       data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                    <div class="task-meta">
                        <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                            📅 ${dueDateText}
                        </span>
                        <span class="priority-badge ${task.priority}">${task.priority}</span>
                        ${task.recurring ? '<span>🔄 Recurring</span>' : ''}
                    </div>
                    ${task.tags && task.tags.length > 0 ? `
                        <div class="task-tags">
                            ${task.tags.map(tag => `<span class="tag">#${this.escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${task.subtasks && task.subtasks.length > 0 ? `
                        <div class="subtasks-container">
                            ${task.subtasks.map((subtask, idx) => `
                                <div class="subtask-item">
                                    <input type="checkbox" 
                                           class="subtask-checkbox" 
                                           ${subtask.completed ? 'checked' : ''}
                                           data-task-id="${task.id}"
                                           data-subtask-idx="${idx}">
                                    <span>${this.escapeHtml(subtask.title)}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="task-actions">
                    ${this.currentListId === 'trash' ? `
                        <button class="btn-icon btn-small" data-action="restore" data-task-id="${task.id}" title="Restore">
                            <span>♻️</span>
                        </button>
                        <button class="btn-icon btn-small btn-danger" data-action="delete-permanent" data-task-id="${task.id}" title="Delete Permanently">
                            <span>🗑️</span>
                        </button>
                    ` : `
                        <button class="btn-icon btn-small" data-action="edit" data-task-id="${task.id}" title="Edit">
                            <span>✏️</span>
                        </button>
                        <button class="btn-icon btn-small" data-action="delete" data-task-id="${task.id}" title="Delete">
                            <span>🗑️</span>
                        </button>
                    `}
                </div>
            </div>
        `;

        // Add event listeners
        const checkbox = div.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => this.toggleTaskComplete(task.id));

        const actionButtons = div.querySelectorAll('[data-action]');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                if (action === 'edit') {
                    this.openEditTaskModal(task.id);
                } else if (action === 'delete') {
                    this.deleteTask(task.id);
                } else if (action === 'delete-permanent') {
                    if (confirm('Are you sure you want to permanently delete this task?')) {
                        this.deleteTask(task.id, true);
                    }
                } else if (action === 'restore') {
                    this.restoreTask(task.id);
                }
            });
        });

        // Subtask checkboxes
        div.querySelectorAll('.subtask-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.subtaskIdx);
                if (!task.subtasks[idx]) return;
                task.subtasks[idx].completed = e.target.checked;
                this.saveData();
                this.renderTasks();
            });
        });

        return div;
    }

    // ============================================
    // Event Handlers - Setup
    // ============================================
    setupEventListeners() {
        // Add Task Button
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.openAddTaskModal();
        });

        // Task Form
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTaskSubmit();
        });

        // List Form
        document.getElementById('listForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleListSubmit();
        });

        // Add List Button
        document.getElementById('addListBtn').addEventListener('click', () => {
            document.getElementById('listModal').classList.add('show');
        });

        // Modal Closes
        document.getElementById('closeTaskModal').addEventListener('click', () => {
            document.getElementById('taskModal').classList.remove('show');
            this.editingTaskId = null;
        });

        document.getElementById('closeListModal').addEventListener('click', () => {
            document.getElementById('listModal').classList.remove('show');
        });

        document.getElementById('closeDetailsModal').addEventListener('click', () => {
            document.getElementById('taskDetailsModal').classList.remove('show');
        });

        document.getElementById('closeStatsModal').addEventListener('click', () => {
            document.getElementById('statsModal').classList.remove('show');
        });

        document.getElementById('cancelTaskBtn').addEventListener('click', () => {
            document.getElementById('taskModal').classList.remove('show');
            this.editingTaskId = null;
        });

        document.getElementById('cancelListBtn').addEventListener('click', () => {
            document.getElementById('listModal').classList.remove('show');
        });

        // Filters
        document.getElementById('priorityFilter').addEventListener('change', (e) => {
            this.currentFilter.priority = e.target.value;
            this.renderTasks();
        });

        document.getElementById('sortFilter').addEventListener('change', (e) => {
            this.currentFilter.sort = e.target.value;
            this.renderTasks();
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.renderTasks();
        });

        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Stats Button
        document.getElementById('statsBtn').addEventListener('click', () => {
            this.showStats();
        });

        // Recurring checkbox
        document.getElementById('taskRecurring').addEventListener('change', (e) => {
            document.getElementById('taskRecurrence').disabled = !e.target.checked;
        });

        // Voice Input (if supported)
        const voiceBtn = document.getElementById('voiceInputBtn');
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            voiceBtn.addEventListener('click', () => {
                this.startVoiceInput();
            });
        } else {
            voiceBtn.style.display = 'none';
        }

        // List items
        document.querySelectorAll('[data-list-id]').forEach(item => {
            item.addEventListener('click', () => {
                this.switchList(item.dataset.listId);
            });
        });

        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    // ============================================
    // Event Handlers - Actions
    // ============================================
    switchList(listId) {
        this.currentListId = listId;
        document.querySelectorAll('.list-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-list-id="${listId}"]`)?.classList.add('active');
        this.renderTasks();
    }

    openAddTaskModal() {
        this.editingTaskId = null;
        document.getElementById('modalTitle').textContent = 'Add New Task';
        document.getElementById('taskForm').reset();
        document.getElementById('taskRecurrence').disabled = true;
        document.getElementById('taskModal').classList.add('show');
    }

    openEditTaskModal(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.editingTaskId = taskId;
        document.getElementById('modalTitle').textContent = 'Edit Task';
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskDueDate').value = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskList').value = task.listId || 'default';
        document.getElementById('taskRecurring').checked = task.recurring || false;
        document.getElementById('taskRecurrence').value = task.recurrenceType || 'daily';
        document.getElementById('taskRecurrence').disabled = !task.recurring;
        document.getElementById('taskTags').value = task.tags ? task.tags.join(', ') : '';
        document.getElementById('taskModal').classList.add('show');
    }

    handleTaskSubmit() {
        const formData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            dueDate: document.getElementById('taskDueDate').value || null,
            priority: document.getElementById('taskPriority').value,
            listId: document.getElementById('taskList').value,
            recurring: document.getElementById('taskRecurring').checked,
            recurrenceType: document.getElementById('taskRecurring').checked 
                ? document.getElementById('taskRecurrence').value 
                : null,
            tags: document.getElementById('taskTags').value
        };

        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, formData);
        } else {
            this.addTask(formData);
        }

        document.getElementById('taskModal').classList.remove('show');
        this.editingTaskId = null;
    }

    handleListSubmit() {
        const formData = {
            name: document.getElementById('listName').value,
            color: document.getElementById('listColor').value
        };
        this.addList(formData);
        document.getElementById('listModal').classList.remove('show');
        document.getElementById('listForm').reset();
    }

    // ============================================
    // Theme Management
    // ============================================
    setupTheme() {
        const savedTheme = localStorage.getItem('todoTheme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('todoTheme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    // ============================================
    // Statistics
    // ============================================
    updateStats() {
        // Stats are updated in real-time as tasks change
    }

    showStats() {
        const total = this.tasks.filter(t => !t.deleted).length;
        const completed = this.tasks.filter(t => t.completed && !t.deleted).length;
        const pending = total - completed;
        const overdue = this.tasks.filter(t => 
            !t.deleted && 
            !t.completed && 
            t.dueDate && 
            new Date(t.dueDate) < new Date()
        ).length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        const statsContent = document.getElementById('statsContent');
        statsContent.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--radius-lg); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">${total}</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">Total Tasks</div>
                </div>
                <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--radius-lg); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--success);">${completed}</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">Completed</div>
                </div>
                <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--radius-lg); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--warning);">${pending}</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">Pending</div>
                </div>
                <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--radius-lg); text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--danger);">${overdue}</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">Overdue</div>
                </div>
            </div>
            <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--radius-lg);">
                <h4 style="margin-bottom: 1rem;">Completion Rate</h4>
                <div style="background: var(--bg-tertiary); border-radius: var(--radius-md); height: 2rem; overflow: hidden; position: relative;">
                    <div style="background: linear-gradient(90deg, var(--success), var(--primary)); height: 100%; width: ${completionRate}%; transition: width 0.3s ease; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.875rem;">
                        ${completionRate}%
                    </div>
                </div>
            </div>
        `;
        document.getElementById('statsModal').classList.add('show');
    }

    // ============================================
    // Notifications
    // ============================================
    scheduleNotifications(task) {
        if (!task.dueDate || task.completed) return;

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Schedule notification (simplified - in production, use service workers)
        const dueTime = new Date(task.dueDate).getTime();
        const now = Date.now();
        const timeUntilDue = dueTime - now;

        if (timeUntilDue > 0 && timeUntilDue <= 86400000) { // Within 24 hours
            setTimeout(() => {
                if (Notification.permission === 'granted' && !task.completed) {
                    new Notification(`Task Due: ${task.title}`, {
                        body: task.description || 'This task is due now!',
                        icon: '/favicon.ico'
                    });
                }
            }, timeUntilDue);
        }
    }

    // ============================================
    // Voice Input
    // ============================================
    startVoiceInput() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('taskTitle').value = transcript;
            this.openAddTaskModal();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            alert('Voice input failed. Please try again.');
        };

        recognition.start();
    }

    // ============================================
    // Utility Functions
    // ============================================
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

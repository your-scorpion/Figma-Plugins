// Self-contained Figma roadmap widget with inline task management

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, Rectangle, SVG, Input, useEffect, useStickable, useWidgetId } = widget

// Define a modern fintech color palette with high contrast - bluish theme
const colors = {
  background: "#F7FAFC",
  primary: "#1A365D",
  secondary: "#2563EB", // Changed from green to blue - WCAG AA compliant
  accent: "#3B82F6", // Changed from cyan to blue - WCAG AA compliant
  text: "#000000", // Black text for maximum contrast
  textLight: "#4A5568", // Darker for better contrast
  border: "#CBD5E0", // Slightly darker border for contrast
  cardBg: "#FFFFFF",
  inputBg: "#EDF2F7", // Light background for inputs
  inputText: "#000000", // Black text for inputs
  success: "#1E40AF", // Changed from teal to blue - WCAG AA compliant
  warning: "#C05621", // Darker warning for better contrast
  error: "#C53030" // Darker error for better contrast
}

function Widget() {
  const initialTasks = [
    { id: 't1', title: 'Design kickoff', description: 'Kickoff meeting and goals alignment', link: '', designer: 'John Doe', progress: 100, timeTrackedMs: 0, running: false, startedAt: 0, autoPaused: false, state: 'todo' },
  ]

  const [tasks, setTasks] = useSyncedState('tasks', initialTasks)
  const [showAddPopup, setShowAddPopup] = useSyncedState('showAddPopup', false)
  const [newTaskTitle, setNewTaskTitle] = useSyncedState('newTaskTitle', '')
  const [newTaskDesc, setNewTaskDesc] = useSyncedState('newTaskDesc', '')
  const [newTaskLink, setNewTaskLink] = useSyncedState('newTaskLink', '')
  const [newTaskDesigner, setNewTaskDesigner] = useSyncedState('newTaskDesigner', '')

  // Editing state and double-click detection
  const [editingTitleId, setEditingTitleId] = useSyncedState('editingTitleId', '')
  const [editingDescId, setEditingDescId] = useSyncedState('editingDescId', '')
  const [editingLinkId, setEditingLinkId] = useSyncedState('editingLinkId', '')
  const [editingDesignerId, setEditingDesignerId] = useSyncedState('editingDesignerId', '')
  const [confirmRemoveId, setConfirmRemoveId] = useSyncedState('confirmRemoveId', '')
  const [lastClickTarget, setLastClickTarget] = useSyncedState('lastClickTarget', '')
  const [lastClickTime, setLastClickTime] = useSyncedState('lastClickTime', 0)
  const [_tick, setTick] = useSyncedState('tick', 0)
  const [lastActivityAt, setLastActivityAt] = useSyncedState('lastActivityAt', Date.now())
  const [columnWidth, setColumnWidth] = useSyncedState('columnWidth', 180)
  const [autoColumnWidth, setAutoColumnWidth] = useSyncedState('autoColumnWidth', true)
  const [addingTask, setAddingTask] = useSyncedState('addingTask', false)
  const [newTaskState, setNewTaskState] = useSyncedState('newTaskState', 'todo')
  const [headerTitle, setHeaderTitle] = useSyncedState('headerTitle', 'roadmap')
  const [editingHeader, setEditingHeader] = useSyncedState('editingHeader', false)
  const [isDraggingSlider, setIsDraggingSlider] = useSyncedState('isDraggingSlider', false)
  const [collapsedTasks, setCollapsedTasks] = useSyncedState('collapsedTasks', new Set<string>())
  const columnGutter = 12
  const progressBarWidth = autoColumnWidth ? 160 : Math.max(60, columnWidth - 20)
  const overallProgressBarWidth = 600

  const DOUBLE_CLICK_MS = 300
  const INACTIVITY_MS = 10000

  const markActivity = () => {
    const now = Date.now()
    setLastActivityAt(now)
    // Auto-resume any tasks that were paused due to inactivity
    const hasAutoPaused = tasks.some(t => t.autoPaused)
    if (hasAutoPaused) {
      setTasks(tasks.map(t => t.autoPaused ? { ...t, autoPaused: false, running: true, startedAt: now } : t))
    }
  }



  // Live tick and inactivity auto-pause
  useEffect(() => {
    const now = Date.now()
    // Tick while user is active to refresh time display
    if ((now - lastActivityAt) <= INACTIVITY_MS) {
      setTimeout(() => setTick(v => v + 1), 1000)
    }
    // Auto-pause running timers if user inactive
    if (tasks.some(t => t.running) && (now - lastActivityAt) > INACTIVITY_MS) {
      setTasks(tasks.map(t => {
        if (t.running) {
          const stopAt = lastActivityAt
          const delta = Math.max(0, stopAt - (t.startedAt || 0))
          return { ...t, running: false, startedAt: 0, timeTrackedMs: (t.timeTrackedMs || 0) + delta, autoPaused: true }
        }
        return t
      }))
    }
  })
  const handleClickForEdit = (target: 'title' | 'desc' | 'link' | 'designer', id: string) => {
    markActivity()
    // Clear all editing states first to ensure only one field can be edited at a time
    setEditingTitleId('')
    setEditingDescId('')
    setEditingLinkId('')
    setEditingDesignerId('')
    
    // Then enable editing for the selected field
    if (target === 'title') setEditingTitleId(id)
    else if (target === 'desc') setEditingDescId(id)
    else if (target === 'link') setEditingLinkId(id)
    else if (target === 'designer') setEditingDesignerId(id)
  }

  const updateTaskTitle = (id: string, title: string) => {
    markActivity()
    setTasks(tasks.map(t => t.id === id ? { ...t, title } : t))
  }

  const updateTaskDesc = (id: string, description: string) => {
    markActivity()
    setTasks(tasks.map(t => t.id === id ? { ...t, description } : t))
  }

  const updateTaskLink = (id: string, link: string) => {
    markActivity()
    setTasks(tasks.map(t => t.id === id ? { ...t, link } : t))
  }

  const updateTaskDesigner = (id: string, designer: string) => {
    markActivity()
    setTasks(tasks.map(t => t.id === id ? { ...t, designer } : t))
  }

  const overall = Math.round(
    (tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / Math.max(tasks.length, 1))
  )

  // Removed overall and barWidth (not used in Kanban layout)

  const addTask = () => {
    markActivity()
    if (!newTaskTitle.trim()) return
    const newTask = {
      id: 't' + Date.now(),
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      link: newTaskLink.trim(),
      designer: newTaskDesigner.trim(),
      progress: 0,
      timeTrackedMs: 0,
      running: false,
      startedAt: 0,
      autoPaused: false,
      state: newTaskState,
    }
    setTasks([...tasks, newTask])
    setNewTaskTitle('')
    setNewTaskDesc('')
    setNewTaskLink('')
    setNewTaskDesigner('')
    setShowAddPopup(false)
    setAddingTask(false)
  }

  const updateProgress = (taskId: string, delta: number) => {
    markActivity()
    setTasks(tasks.map(task => {
      if (task.id !== taskId) return task
      const next = Math.max(0, Math.min(100, (task.progress || 0) + delta))
      if (next === 100) {
        return { ...task, progress: next, state: 'done' }
      }
      return { ...task, progress: next }
    }))
  }

  const removeTask = (taskId: string) => {
    markActivity()
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const setTaskDone = (taskId: string) => {
    markActivity()
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, progress: 100, state: 'done' } : task
    ))
  }

  const toggleTaskCollapse = (taskId: string) => {
    markActivity()
    const newCollapsedTasks = new Set(collapsedTasks)
    if (newCollapsedTasks.has(taskId)) {
      newCollapsedTasks.delete(taskId)
    } else {
      newCollapsedTasks.add(taskId)
    }
    setCollapsedTasks(newCollapsedTasks)
  }

  // Time tracker helpers
  const startTimer = (taskId: string) => {
    markActivity()
    setTasks(tasks.map(t => t.id === taskId && !t.running ? { ...t, running: true, startedAt: Date.now(), autoPaused: false } : t))
  }

  const stopTimer = (taskId: string) => {
    markActivity()
    setTasks(tasks.map(t => {
      if (t.id === taskId && t.running) {
        const delta = Math.max(0, Date.now() - (t.startedAt || 0))
        return { ...t, running: false, startedAt: 0, timeTrackedMs: (t.timeTrackedMs || 0) + delta, autoPaused: false }
      }
      return t
    }))
  }

  const resetTimer = (taskId: string) => {
    markActivity()
    setTasks(tasks.map(t => t.id === taskId ? { ...t, timeTrackedMs: 0, startedAt: t.running ? Date.now() : 0 } : t))
  }

  const moveState = (taskId: string, dir: -1 | 1) => {
    markActivity()
    const order = ['todo', 'inprogress', 'review', 'done']
    setTasks(tasks.map(t => {
      if (t.id !== taskId) return t
      const idx = order.indexOf(t.state as any)
      const next = Math.max(0, Math.min(order.length - 1, idx + dir))
      return { ...t, state: order[next] as any }
    }))
  }

  const formatMs = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const hh = hours < 10 ? '0' + String(hours) : String(hours)
    const mm = minutes < 10 ? '0' + String(minutes) : String(minutes)
    const ss = seconds < 10 ? '0' + String(seconds) : String(seconds)
    return `${hh}:${mm}:${ss}`
  }

  const currentElapsed = (t: any) => {
    if (!t.running) return t.timeTrackedMs || 0
    const delta = Math.max(0, Date.now() - (t.startedAt || 0))
    return (t.timeTrackedMs || 0) + delta
  }

  // Timezone parsing removed

  const pad2 = (n: number) => (n < 10 ? '0' + String(n) : String(n))

  // Open plugin UI to show report
  const generateReport = (autoJson: boolean = false) => {
    // Return a promise to keep the widget running while the iframe is open
    return new Promise((resolve) => {
      // Prepare report data
      const todoCount = tasks.filter(t => t.state === 'todo').length;
      const inProgressCount = tasks.filter(t => t.state === 'inprogress').length;
      const reviewCount = tasks.filter(t => t.state === 'review').length;
      const doneCount = tasks.filter(t => t.state === 'done').length;
      const totalCount = tasks.length;
      const completionRate = Math.round((doneCount / totalCount) * 100) || 0;
      
      // Prepare task data for the plugin
      const taskData = tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.state === 'todo' ? 'To Do' : 
                task.state === 'inprogress' ? 'In Progress' : 
                task.state === 'review' ? 'Review' : 'Done',
        progress: task.progress,
        designer: task.designer,
        link: task.link
      }));
      
      // Create report data object
      const reportData = {
        title: "Roadmap Status Report",
        date: new Date().toLocaleString(),
        statistics: {
          total: totalCount,
          todo: todoCount,
          inProgress: inProgressCount,
          review: reviewCount,
          done: doneCount,
          completionRate: completionRate
        },
        tasks: taskData
      };
      
      // Set up message handler to resolve the promise when the UI is closed
      figma.ui.onmessage = (msg) => {
        if (msg.type === 'close') {
          figma.closePlugin();
          resolve(1);
        }
      };
      
      // Open plugin UI with the report data
    // For Figma plugins, we need to use a direct HTML string
    const htmlContent = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Roadmap Report</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          :root {
            --primary: #0A0A0A;
            --secondary: #2563EB;
            --background: #F0F4FF;
            --card-bg: #FFFFFF;
            --border: #E1E7FF;
            --text: #0A0A0A;
            --accent: #3B82F6;
            --muted: #DBEAFE;
            --bar-bg: #E1E7FF;
          }
          html, body { height: 100%; }
          body {
            margin: 0; padding: 24px; font-family: 'Roboto', sans-serif; background: var(--background);
            color: var(--text); min-width: 360px; box-sizing: border-box;
          }
          h1 { 
            margin: 0 0 8px; 
            font-family: 'Playfair Display', serif;
            font-weight: 600;
            color: var(--primary);
          }
          h2 { 
            margin: 24px 0 16px; 
            font-family: 'Playfair Display', serif;
            font-weight: 600;
            color: var(--primary);
            border-bottom: 1px solid var(--border);
            padding-bottom: 8px;
          }
          .date {
            font-style: italic;
            color: var(--secondary);
            margin-bottom: 24px;
          }
          .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }
          .stat-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            padding: 16px;
            text-align: center;
          }
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: var(--primary);
            margin-bottom: 4px;
          }
          .stat-label {
            font-size: 14px;
            color: var(--secondary);
          }
          .completion-bar {
            width: 100%;
            height: 12px;
            background: var(--bar-bg);
            border-radius: 0;
            overflow: hidden;
            margin: 16px 0;
            border: 1px solid var(--border);
          }
          .completion-fill {
            height: 100%;
            background: var(--accent);
            width: 0%;
          }
          .status-distribution {
            display: flex;
            height: 24px;
            width: 100%;
            margin: 16px 0;
            border: 1px solid var(--border);
          }
          .status-bar {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
          }
          .todo-bar { background-color: #DBEAFE; }
          .in-progress-bar { background-color: #3B82F6; }
          .review-bar { background-color: #60A5FA; }
          .done-bar { background-color: #1E40AF; }
          .task-list {
            margin-top: 24px;
          }
          .task-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            padding: 16px;
            margin-bottom: 16px;
          }
          .task-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .task-title {
            font-weight: bold;
            color: var(--primary);
          }
          .task-status {
            font-style: italic;
            color: var(--secondary);
          }
          .task-description {
            color: var(--text);
            margin-bottom: 8px;
          }
          .task-meta {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: var(--muted);
          }
          .btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 8px 16px;
            font-family: 'Roboto', sans-serif;
            font-size: 14px;
            cursor: pointer;
            margin-top: 16px;
          }
          .btn:hover {
            background: #1E40AF;
          }
        </style>
      </head>
      <body>
        <h1 id="reportTitle">Roadmap Report</h1>
        <div id="reportDate" class="date"></div>
        
        <h2>Summary Statistics</h2>
        <div class="stats-container">
          <div class="stat-card">
            <div id="totalTasks" class="stat-value">0</div>
            <div class="stat-label">Total Tasks</div>
          </div>
          <div class="stat-card">
            <div id="todoTasks" class="stat-value">0</div>
            <div class="stat-label">To-Do</div>
          </div>
          <div class="stat-card">
            <div id="inProgressTasks" class="stat-value">0</div>
            <div class="stat-label">In Progress</div>
          </div>
          <div class="stat-card">
            <div id="reviewTasks" class="stat-value">0</div>
            <div class="stat-label">Review</div>
          </div>
          <div class="stat-card">
            <div id="doneTasks" class="stat-value">0</div>
            <div class="stat-label">Done</div>
          </div>
        </div>
        
        <h2>Task Completion</h2>
        <div>Completion Rate: <span id="completionRate">0%</span></div>
        <div class="completion-bar">
          <div id="completionFill" class="completion-fill" style="width: 0%"></div>
        </div>
        
        <h2>Status Distribution</h2>
        <div id="statusDistribution" class="status-distribution"></div>
        
        <h2>Task Details</h2>
        <div id="taskList" class="task-list"></div>
        
        <div class="actions">
          <button id="exportBtn" class="btn">Export PDF</button>
          <button id="exportJsonBtn" class="btn">Export JSON</button>
          <button id="closeBtn" class="btn">Close Report</button>
        </div>
        
        <script>
          // Initialize empty report data
          let reportData = {
            title: '',
            date: '',
            statistics: {
              total: 0,
              todo: 0,
              inProgress: 0,
              review: 0,
              done: 0,
              completionRate: 0
            },
            tasks: []
          };
          
          // Listen for messages from the plugin
          let autoJson = false;
          window.onmessage = (event) => {
            const message = event.data.pluginMessage;
            if (message.type === 'report-data') {
              reportData = message.data;
              autoJson = !!message.autoJson;
              renderReport();
              if (autoJson) {
                // Auto export JSON when requested
                exportJson();
              }
            }
          };
          
          // Render the report with the data
          function renderReport() {
            // Update title and date
            document.getElementById('reportTitle').textContent = reportData.title;
            document.getElementById('reportDate').textContent = reportData.date;
            
            // Update statistics
            document.getElementById('totalTasks').textContent = reportData.statistics.total;
            document.getElementById('todoTasks').textContent = reportData.statistics.todo;
            document.getElementById('inProgressTasks').textContent = reportData.statistics.inProgress;
            document.getElementById('reviewTasks').textContent = reportData.statistics.review;
            document.getElementById('doneTasks').textContent = reportData.statistics.done;
            document.getElementById('completionRate').textContent = reportData.statistics.completionRate + '%';
            
            // Update completion bar
            document.getElementById('completionFill').style.width = reportData.statistics.completionRate + '%';
            
            // Update status distribution
            const statusDistribution = document.getElementById('statusDistribution');
            statusDistribution.innerHTML = '';
            
            const total = reportData.statistics.total;
            if (total > 0) {
              // Calculate percentages
              const todoPercent = (reportData.statistics.todo / total) * 100;
              const inProgressPercent = (reportData.statistics.inProgress / total) * 100;
              const reviewPercent = (reportData.statistics.review / total) * 100;
              const donePercent = (reportData.statistics.done / total) * 100;
              
              // Create bars
              if (todoPercent > 0) {
                const todoBar = document.createElement('div');
                todoBar.className = 'status-bar todo-bar';
                todoBar.style.width = todoPercent + '%';
                todoBar.textContent = reportData.statistics.todo;
                statusDistribution.appendChild(todoBar);
              }
              
              if (inProgressPercent > 0) {
                const inProgressBar = document.createElement('div');
                inProgressBar.className = 'status-bar in-progress-bar';
                inProgressBar.style.width = inProgressPercent + '%';
                inProgressBar.textContent = reportData.statistics.inProgress;
                statusDistribution.appendChild(inProgressBar);
              }
              
              if (reviewPercent > 0) {
                const reviewBar = document.createElement('div');
                reviewBar.className = 'status-bar review-bar';
                reviewBar.style.width = reviewPercent + '%';
                reviewBar.textContent = reportData.statistics.review;
                statusDistribution.appendChild(reviewBar);
              }
              
              if (donePercent > 0) {
                const doneBar = document.createElement('div');
                doneBar.className = 'status-bar done-bar';
                doneBar.style.width = donePercent + '%';
                doneBar.textContent = reportData.statistics.done;
                statusDistribution.appendChild(doneBar);
              }
            }
            
            // Update task list
          const taskList = document.getElementById('taskList');
          taskList.innerHTML = '';
          
          reportData.tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            
            const taskHeader = document.createElement('div');
            taskHeader.className = 'task-header';
            
            const taskTitle = document.createElement('div');
            taskTitle.className = 'task-title';
            taskTitle.textContent = task.title;
            
            const taskStatus = document.createElement('div');
            taskStatus.className = 'task-status';
            taskStatus.textContent = task.status;
            
            taskHeader.appendChild(taskTitle);
            taskHeader.appendChild(taskStatus);
            
            const taskDescription = document.createElement('div');
            taskDescription.className = 'task-description';
            taskDescription.textContent = task.description || 'No description provided';
            
            const taskMeta = document.createElement('div');
            taskMeta.className = 'task-meta';
            taskMeta.textContent = 'ID: ' + task.id;
            
            // Add clickable link if available
            if (task.link && task.link.trim() !== '') {
              const taskLink = document.createElement('div');
              taskLink.className = 'task-link';
              taskLink.style.marginTop = '8px';
              
              const linkElement = document.createElement('a');
              linkElement.href = task.link;
              linkElement.textContent = '🔗 Open Link';
              linkElement.style.color = '#2563EB';
              linkElement.style.textDecoration = 'underline';
              linkElement.style.cursor = 'pointer';
              linkElement.style.fontSize = '12px';
              linkElement.target = '_blank';
              linkElement.rel = 'noopener noreferrer';
              
              taskLink.appendChild(linkElement);
              taskCard.appendChild(taskLink);
            }
            
            taskCard.appendChild(taskHeader);
            taskCard.appendChild(taskDescription);
            taskCard.appendChild(taskMeta);
            
            taskList.appendChild(taskCard);
          });
          }
          
          // Export handler: open print dialog (allows Save as PDF)
          const exportBtn = document.getElementById('exportBtn');
          if (exportBtn) {
            exportBtn.addEventListener('click', () => {
              window.print();
            });
          }

          // Export JSON handler
          function exportJson() {
            try {
              const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'roadmap-report.json';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            } catch (e) {
              console.error('JSON export failed', e);
            }
          }

          const exportJsonBtn = document.getElementById('exportJsonBtn');
          if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => exportJson());
          }
          
          // Close button handler
          document.getElementById('closeBtn').addEventListener('click', () => {
            parent.postMessage({ pluginMessage: { type: 'close' } }, '*');
          });
        </script>
      </body>
    </html>
    `;
    figma.showUI(htmlContent, { width: 600, height: 800 });
    
    // Send data to the plugin UI
    figma.ui.postMessage({ 
      type: 'report-data', 
      data: reportData,
      autoJson: autoJson
    });
    
    // Handle messages from the UI
    figma.ui.onmessage = (msg) => {
      if (msg.type === 'close') {
        figma.closePlugin();
      }
    };
    
    // Notify user
    figma.notify("Report plugin opened!");
    });
  }

  const importTasksFromJson = (): Promise<void> => {
    const html = `<!doctype html><html><head><meta charset='utf-8'>
      <style>body{font-family: Inter, Roboto, sans-serif; margin:12px}
      .hint{font-size:12px;color:#666;margin-top:8px}</style>
    </head><body>
      <input id="file" type="file" accept=".json" />
      <div class="hint">Select a JSON file exported from the report.</div>
      <script>
        const input = document.getElementById('file');
        input.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            const text = ev.target && ev.target.result;
            parent.postMessage({ pluginMessage: { type: 'json-data', data: text } }, '*');
          };
          reader.readAsText(file);
        });
        // Open picker automatically
        setTimeout(() => input.click(), 0);
      </script>
    </body></html>`;
    figma.showUI(html, { width: 360, height: 120 });

    const mapStatus = (s: unknown): 'todo' | 'inprogress' | 'review' | 'done' => {
      if (!s) return 'todo';
      const v = String(s).toLowerCase();
      if (v.includes('progress')) return 'inprogress';
      if (v.includes('review')) return 'review';
      if (v.includes('done')) return 'done';
      return 'todo';
    };

    // Keep the widget alive while the import UI is open
    return new Promise<void>((resolve) => {
      figma.ui.onmessage = (msg) => {
        if (msg && msg.type === 'json-data') {
          try {
            const parsed = JSON.parse(msg.data || '{}');
            const sourceTasks = Array.isArray(parsed) ? parsed : (parsed.tasks || []);
            if (!Array.isArray(sourceTasks)) {
              figma.notify('Invalid JSON: no tasks array found');
              figma.ui.hide && figma.ui.hide();
              resolve();
              return;
            }
            const normalized = sourceTasks.map((t) => ({
              id: t.id || ('t' + Date.now() + Math.floor(Math.random() * 1000)),
              title: t.title || 'Untitled',
              description: t.description || '',
              link: t.link || '',
              designer: t.designer || '',
              state: t.state || mapStatus((t as any).status),
              progress: Math.max(0, Math.min(100, Number(t.progress || 0))),
              timeTrackedMs: Number(t.timeTrackedMs || 0),
              running: Boolean(t.running || false),
              startedAt: Number(t.startedAt || 0),
              autoPaused: Boolean(t.autoPaused || false)
            }));

            setTasks(normalized);
            figma.notify(`Imported ${normalized.length} tasks`);
            figma.ui.hide && figma.ui.hide();
          } catch (e) {
            figma.notify('Error parsing JSON');
            figma.ui.hide && figma.ui.hide();
          }
          resolve();
        }
      };
    });
  };
  
  const findSectionsAndCreateTasks = () => {
    // Get all sections on the current page
    figma.notify("Finding sections...");
    
    // Use figma.currentPage to access the current page
    const nodes = figma.currentPage.children;
    const sections = nodes.filter(node => 
      (node.type && node.type.includes("SECTION")) || 
      (node.name && node.name.toLowerCase().includes("section"))
    );
    
    if (sections.length === 0) {
      figma.notify("No sections found on the current page!");
      return;
    }
    
    // Create a task for each section
    let newTasks = [...tasks];
    let newTasksCount = 0;
    
    sections.forEach(section => {
      // Add a new task for this section
      newTasks.push({
        id: 't' + Date.now() + Math.floor(Math.random() * 1000),
        title: section.name || "Untitled Section",
        description: `Design work for ${section.name || "Untitled Section"}`,
        link: "",
        designer: "",
        state: "todo",
        progress: 0,
        timeTrackedMs: 0,
        running: false,
        startedAt: 0,
        autoPaused: false
      });
      newTasksCount++;
    });
    
    setTasks(newTasks);
    figma.notify(`Created ${newTasksCount} tasks from sections!`);
  }
  
  const findFramesAndCreateTasks = () => {
    // Get all frames on the current page
    figma.notify("Finding frames...");
    
    // Use figma.currentPage to access the current page
    const nodes = figma.currentPage.children;
    const frames = nodes.filter(node => 
      node.type === "FRAME"
    );
    
    if (frames.length === 0) {
      figma.notify("No frames found on the current page!");
      return;
    }
    
    // Create a task for each frame
    let newTasks = [...tasks];
    let newTasksCount = 0;
    
    frames.forEach(frame => {
      // Add a new task for this frame
      newTasks.push({
        id: 't' + Date.now() + Math.floor(Math.random() * 1000),
        title: frame.name || "Untitled Frame",
        description: `Design work for ${frame.name || "Untitled Frame"}`,
        link: "",
        designer: "",
        state: "todo",
        progress: 0,
        timeTrackedMs: 0,
        running: false,
        startedAt: 0,
        autoPaused: false
      });
      newTasksCount++;
    });
    
    setTasks(newTasks);
    figma.notify(`Created ${newTasksCount} tasks from frames!`);
  }

  // Date formatting removed

  return (
    <AutoLayout
      name="Roadmap Widget"
      direction="vertical"
      spacing={12}
      padding={{ horizontal: 20, vertical: 16 }}
      cornerRadius={4}
      fill={colors.background}
      stroke={colors.border}
      strokeWidth={1}
      width="hug-contents"
      minHeight={390}
    >
      {/* Header */}
      <AutoLayout direction="vertical" width="fill-parent" spacing={8}>
        <AutoLayout direction="horizontal" spacing={8} verticalAlignItems="center" width="fill-parent">
          {editingHeader ? (
            <AutoLayout
              width="fill-parent"
              padding={{ vertical: 8, horizontal: 10 }}
              cornerRadius={6}
              fill={colors.inputBg}
              stroke={colors.border}
              strokeWidth={1}
              hoverStyle={{ stroke: colors.accent }}
            >
              <Input
                value={headerTitle}
                placeholder="roadmap"
                onTextEditEnd={(e) => { markActivity(); setHeaderTitle(e.characters); setEditingHeader(false) }}
                fontSize={36}
                width="fill-parent"
                fill="#000000"
                fontFamily="Inter"
              />
            </AutoLayout>
          ) : (
            <AutoLayout onClick={() => { markActivity(); setEditingHeader(true) }}>
              <Text fontSize={36} fontWeight="bold" fill="#000000">{headerTitle}</Text>
            </AutoLayout>
          )}
        </AutoLayout>
        <AutoLayout direction="horizontal" width="fill-parent" spacing={8}>
          <AutoLayout padding={{ horizontal: 10, vertical: 6 }} cornerRadius={0} fill="#000000" onClick={() => { markActivity(); setShowAddPopup(true) }}>
             <Text fontSize={14} fill="#fff" fontWeight="medium">+ Add Task</Text>
          </AutoLayout>
          <AutoLayout padding={{ horizontal: 10, vertical: 6 }} cornerRadius={3} fill={colors.secondary} onClick={() => { markActivity(); setAutoColumnWidth(!autoColumnWidth) }}>
            <Text fontSize={12} fill="#FFFFFF" fontFamily="Inter">{autoColumnWidth ? 'Auto Width: On' : 'Auto Width: Off'}</Text>
          </AutoLayout>
          <AutoLayout padding={{ horizontal: 10, vertical: 6 }} cornerRadius={3} fill={colors.accent} onClick={() => { 
              markActivity(); 
              return generateReport(); 
            }}>
            <Text fontSize={12} fill="#FFFFFF" fontFamily="Roboto">Generate Report</Text>
          </AutoLayout>

          <AutoLayout padding={{ horizontal: 10, vertical: 6 }} cornerRadius={3} fill="#4F46E5" onClick={() => { 
              markActivity(); 
              return importTasksFromJson(); 
            }}>
            <Text fontSize={12} fill="#FFFFFF" fontWeight="medium">Import JSON</Text>
          </AutoLayout>
          <AutoLayout direction="horizontal" width="fill-parent" horizontalAlignItems="end" spacing={8}>
            {!autoColumnWidth && (
              <AutoLayout direction="horizontal" spacing={8} verticalAlignItems="center">
                <Text fontSize={12} fill="#000000">Width:</Text>
                <AutoLayout padding={{ horizontal: 8, vertical: 4 }} cornerRadius={2} fill="#E1E7FF" onClick={() => { markActivity(); setColumnWidth(Math.max(120, columnWidth - 20)) }}>
                  <Text fontSize={12} fill="#000000">-</Text>
                </AutoLayout>
                <AutoLayout padding={{ horizontal: 8, vertical: 4 }} cornerRadius={2} fill="#E1E7FF" onClick={() => { markActivity(); setColumnWidth(Math.min(320, columnWidth + 20)) }}>
                  <Text fontSize={12} fill="#000000">+</Text>
                </AutoLayout>
                <Text fontSize={12} fill="#000000" fontWeight="medium">{columnWidth}px</Text>
                
              </AutoLayout>
            )}
          </AutoLayout>
        </AutoLayout>
        {/* Second row - tertiary style actions */}
        <AutoLayout direction="horizontal" width="fill-parent" spacing={8} verticalAlignItems="center">
          <AutoLayout padding={{ horizontal: 10, vertical: 6 }} cornerRadius={4} fill={colors.cardBg} stroke={colors.border} strokeWidth={1} onClick={() => { 
              markActivity(); 
              return findSectionsAndCreateTasks(); 
            }}>
            <Text fontSize={12} fill={colors.primary} fontWeight="medium">Create Tasks from Sections</Text>
          </AutoLayout>
          <AutoLayout padding={{ horizontal: 10, vertical: 6 }} cornerRadius={4} fill={colors.cardBg} stroke={colors.border} strokeWidth={1} onClick={() => { 
              markActivity(); 
              return findFramesAndCreateTasks(); 
            }}>
            <Text fontSize={12} fill={colors.primary} fontWeight="medium">Create Tasks from Frames</Text>
          </AutoLayout>
        </AutoLayout>
                 <Rectangle
                    width="fill-parent"
                    height={1}
                    cornerRadius={2}
                    fill="#d1d1d1ff"
                  />
        <AutoLayout direction="horizontal" width="fill-parent" spacing={8} verticalAlignItems="center">
          <Text fontSize={12} fill="#000000">Total Progress:</Text>
          <AutoLayout width={overallProgressBarWidth} height={8} cornerRadius={0} fill="#E1E7FF" verticalAlignItems="center" horizontalAlignItems="start">
                <Rectangle 
                  width={Math.round((overall / 100) * overallProgressBarWidth)} 
                  height={8} 
                  cornerRadius={0} 
                  fill="#3B82F6" 
            />
          </AutoLayout>
          <Text fontSize={12} fill="#000000">{overall}%</Text>
          <AutoLayout 
            padding={{ horizontal: 10, vertical: 6 }} 
            cornerRadius={4} 
            fill={colors.cardBg} 
            stroke={colors.border} 
            strokeWidth={1} 
            onClick={() => { 
              markActivity(); 
              setTasks(tasks.map(t => ({ ...t, progress: 100, state: 'done' })));
              figma.notify('Set all tasks to 100% and Done');
            }}
          >
            <Text fontSize={12} fill={colors.primary} fontWeight="medium">set all 100%</Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>

      {/* Kanban Grid */}
      <AutoLayout direction="horizontal" spacing={columnGutter} width="fill-parent">
        {['todo','inprogress','review','done'].map((col) => (
          <AutoLayout key={col} direction="vertical" spacing={10} padding={12} cornerRadius={6} fill={colors.cardBg} stroke={colors.border} strokeWidth={1} effect={{
            type: "drop-shadow",
            color: { r: 0, g: 0, b: 0, a: 0.06 },
            offset: { x: 0, y: 1 },
            blur: 4,
            spread: 0
          }} width={autoColumnWidth ? 'hug-contents' : columnWidth}>
            <AutoLayout width="fill-parent" spacing={8} verticalAlignItems="center">
              <Text fontSize={14} fontWeight="medium" fill={colors.primary} fontFamily="Inter">
                {col === 'todo' ? 'To Do' : col === 'inprogress' ? 'In Progress' : col === 'review' ? 'Review' : 'Done'}
              </Text>
              <AutoLayout padding={{ horizontal: 8, vertical: 4 }} cornerRadius={2} fill={colors.secondary} onClick={() => { markActivity(); setAddingTask(true); setNewTaskState(col); }}>
                <Text fontSize={11} fill="#FFFFFF" fontFamily="Inter">+ Add</Text>
              </AutoLayout>
            </AutoLayout>
            {tasks.filter(t => t.state === col).map((task) => (
              <AutoLayout key={task.id} direction="vertical" spacing={8} padding={{ horizontal: 12, vertical: 10 }} cornerRadius={6} fill={colors.cardBg} stroke={colors.border} strokeWidth={1} effect={{
                type: "drop-shadow",
                color: { r: 0, g: 0, b: 0, a: 0.08 },
                offset: { x: 0, y: 1 },
                blur: 6,
                spread: 0
              }} width="fill-parent">
                {/* Title */}
                {editingTitleId === task.id ? (
                  <AutoLayout
                    width="fill-parent"
                    padding={{ vertical: 8, horizontal: 10 }}
                    fill={colors.inputBg}
                    stroke={colors.border}
                    strokeWidth={1}
                    cornerRadius={6}
                  >
                    <Input
                      value={task.title}
                      placeholder="Task title"
                      onTextEditEnd={(e) => { markActivity(); updateTaskTitle(task.id, e.characters); setEditingTitleId('') }}
                      fontSize={13}
                      width="fill-parent"
                      fill="#000000"
                    />
                  </AutoLayout>
                ) : (
                  <AutoLayout
                    width="fill-parent"
                    padding={{ vertical: 4, horizontal: 6 }}
                    cornerRadius={0}
                    hoverStyle={{ fill: "#E1E7FF" }}
                    onClick={() => { handleClickForEdit('title', task.id) }}
                  >
                    <Text fontSize={13} fontWeight="medium" fill="#000000">{task.title}</Text>
                  </AutoLayout>
                )}

                {/* Description */}
                {editingDescId === task.id ? (
                  <AutoLayout
                    width="fill-parent"
                    padding={{ vertical: 8, horizontal: 10 }}
                    fill={colors.inputBg}
                    stroke={colors.border}
                    strokeWidth={1}
                    cornerRadius={6}
                  >
                    <Input
                      value={task.description || ''}
                      placeholder="Task description"
                      onTextEditEnd={(e) => { markActivity(); updateTaskDesc(task.id, e.characters); setEditingDescId('') }}
                      fontSize={12}
                      width="fill-parent"
                      inputBehavior="multiline"
                      height={80}
                      fill="#000000"
                    />
                  </AutoLayout>
                ) : (
                  <AutoLayout
                    width="fill-parent"
                    padding={{ vertical: 4, horizontal: 6 }}
                    cornerRadius={0}
                    hoverStyle={{ fill: "#E1E7FF" }}
                    onClick={() => { handleClickForEdit('desc', task.id) }}
                  >
                    <AutoLayout width="fill-parent" spacing={4}>
                      <Text fontSize={12} fill="#000000" width="fill-parent">{task.description || '—'}</Text>
                      <SVG
                        src='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.4745 5.40801L18.5917 7.52524M17.8358 3.54289L11.1816 10.197C10.8386 10.54 10.6122 10.9805 10.5318 11.4536L10 14L12.5464 13.4682C13.0195 13.3878 13.46 13.1614 13.803 12.8184L20.4571 6.16417C21.1834 5.43785 21.1834 4.26922 20.4571 3.54289C19.7308 2.81657 18.5622 2.81657 17.8358 3.54289Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 14V19C18 20.1046 17.1046 21 16 21H5C3.89543 21 3 20.1046 3 19V8C3 6.89543 3.89543 6 5 6H10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                        width={12}
                        height={12}
                        opacity={0}
                        hoverStyle={{ opacity: 1 }}
                      />
                    </AutoLayout>
                  </AutoLayout>
                )}

                {/* Link */}
                {editingLinkId === task.id ? (
                  <AutoLayout
                    width="fill-parent"
                    padding={{ vertical: 8, horizontal: 10 }}
                    fill={colors.inputBg}
                    stroke={colors.border}
                    strokeWidth={1}
                    cornerRadius={6}
                  >
                    <Input
                      value={task.link || ''}
                      placeholder="Task link (https://...)"
                      onTextEditEnd={(e) => { markActivity(); updateTaskLink(task.id, e.characters); setEditingLinkId('') }}
                      fontSize={12}
                      width="fill-parent"
                      fill="#000000"
                    />
                  </AutoLayout>
                ) : (
                  <AutoLayout 
                    width="fill-parent" 
                    spacing={6}
                    padding={{ vertical: 4, horizontal: 6 }}
                    cornerRadius={0}
                    hoverStyle={{ fill: "#E1E7FF" }}
                    onClick={() => { handleClickForEdit('link', task.id) }}
                  >
                    <Text fontSize={12} fill="#000000">Link:</Text>
                    {task.link ? (
                      <Text 
                        fontSize={12} 
                        fill="#E56A3F"
                        onClick={() => {
                          if (task.link && task.link.startsWith('http')) {
                            figma.openExternal(task.link);
                          }
                        }}
                        hoverStyle={{ fill: '#C2410C' }}
                      >
                        {task.link}
                      </Text>
                    ) : (
                      <Text fontSize={12} fill="#666666">No link</Text>
                    )}
                  </AutoLayout>
                )}

                {/* Designer */}
                {editingDesignerId === task.id ? (
                  <AutoLayout
                    width="fill-parent"
                    padding={{ vertical: 8, horizontal: 10 }}
                    fill={colors.inputBg}
                    stroke={colors.border}
                    strokeWidth={1}
                    cornerRadius={6}
                  >
                    <Input
                      value={task.designer || ''}
                      placeholder="Designer name"
                      onTextEditEnd={(e) => { markActivity(); updateTaskDesigner(task.id, e.characters); setEditingDesignerId('') }}
                      fontSize={12}
                      width="fill-parent"
                      fill="#000000"
                    />
                  </AutoLayout>
                ) : (
                  <AutoLayout 
                    width="fill-parent" 
                    spacing={6}
                    padding={{ vertical: 4, horizontal: 6 }}
                    cornerRadius={0}
                    hoverStyle={{ fill: "#E1E7FF" }}
                    verticalAlignItems="center"
                    onClick={() => { handleClickForEdit('designer', task.id) }}
                  >
                    <Text fontSize={12} fill="#000000">Designer:</Text>
                    {task.designer ? (
                      <Text fontSize={12} fill="#000000">{task.designer}</Text>
                    ) : (
                      <Text fontSize={12} fill="#666666">Not assigned</Text>
                    )}
                  </AutoLayout>
                )}

                {/* Progress */}
                <AutoLayout width={progressBarWidth} height={8} cornerRadius={0} fill="#E1E7FF" verticalAlignItems="center" horizontalAlignItems="start">
                  <Rectangle 
                    width={Math.round((task.progress / 100) * progressBarWidth)} 
                    height={8} 
                    cornerRadius={0} 
                    fill="#1E40AF" 
                  />
                </AutoLayout>

                

                {/* Controls */}
                <AutoLayout direction="horizontal" spacing={6} verticalAlignItems="center" width="fill-parent">
                  {/* Move state */}
                  <AutoLayout padding={{ horizontal: 8, vertical: 4 }} cornerRadius={0} fill="#E1E7FF" onClick={() => { moveState(task.id, -1) }}>
                    <Text fontSize={11} fill="#000000">←</Text>
                  </AutoLayout>
                  <AutoLayout padding={{ horizontal: 8, vertical: 4 }} cornerRadius={0} fill="#E1E7FF" onClick={() => { moveState(task.id, 1) }}>
                    <Text fontSize={11} fill="#000000">→</Text>
                  </AutoLayout>

                  {/* Progress controls */}
                  {(task.progress > 0) && (
                    <AutoLayout padding={{ horizontal: 8, vertical: 4 }} cornerRadius={0} fill="#E1E7FF" onClick={() => { markActivity(); updateProgress(task.id, -10) }}>
                      <Text fontSize={11} fill="#000000">-10%</Text>
                    </AutoLayout>
                  )}
                  {(task.progress < 100) && (
                    <AutoLayout padding={{ horizontal: 8, vertical: 4 }} cornerRadius={0} fill="#E1E7FF" onClick={() => { markActivity(); updateProgress(task.id, 10) }}>
                      <Text fontSize={11} fill="#000000">+10%</Text>
                    </AutoLayout>
                  )}
                </AutoLayout>
                {/* Remove row */}
                <AutoLayout width="fill-parent" horizontalAlignItems="end">
                  {confirmRemoveId === task.id ? (
                    <AutoLayout spacing={8}>
                      <Text fontSize={11} fill="#000000">Delete?</Text>
                      <AutoLayout padding={{ horizontal: 8, vertical: 4 }} cornerRadius={0} fill="#E56A3F" onClick={() => { removeTask(task.id); setConfirmRemoveId('') }}>
                        <Text fontSize={11} fill="#FFFFFF">Yes</Text>
                      </AutoLayout>
                      <AutoLayout padding={{ horizontal: 8, vertical: 4 }} cornerRadius={0} fill="#E1E7FF" onClick={() => { setConfirmRemoveId('') }}>
                        <Text fontSize={11} fill="#000000">No</Text>
                      </AutoLayout>
                    </AutoLayout>
                  ) : (
                    <AutoLayout padding={{ horizontal: 8, vertical: 4 }} cornerRadius={0} fill="#E56A3F" onClick={() => { setConfirmRemoveId(task.id) }}>
                      <Text fontSize={11} fill="#FFFFFF">Remove</Text>
                    </AutoLayout>
                  )}
                </AutoLayout>
              </AutoLayout>
            ))}
          </AutoLayout>
        ))}
      </AutoLayout>

      {/* Add Task Popup */}
      {showAddPopup && (
        <AutoLayout
          direction="vertical"
          spacing={16}
          padding={24}
          cornerRadius={8}
          fill="#FFFFFF"
          stroke={colors.border}
          strokeWidth={2}
          effect={{
            type: "drop-shadow",
            color: { r: 0, g: 0, b: 0, a: 0.1 },
            offset: { x: 0, y: 4 },
            blur: 8,
            spread: 0
          }}
          width="fill-parent"
        >
          <Text fontSize={18} fontWeight="bold" fill="#000000">Add New Task to To Do</Text>
          
          <AutoLayout
            direction="vertical"
            spacing={4}
            width="fill-parent"
          >
            <Text fontSize={12} fontWeight="medium" fill={colors.textLight}>Task Title</Text>
            <AutoLayout
              width="fill-parent"
              padding={{ vertical: 10, horizontal: 12 }}
              cornerRadius={6}
              fill={colors.inputBg}
              stroke={colors.border}
              strokeWidth={1}
              hoverStyle={{ stroke: colors.accent }}
            >
              <Input
                value={newTaskTitle}
                placeholder="Enter a descriptive title..."
                onTextEditEnd={(e) => { markActivity(); setNewTaskTitle(e.characters) }}
                fontSize={14}
                width="fill-parent"
                fill="#000000"
              />
            </AutoLayout>
          </AutoLayout>

          <AutoLayout
            direction="vertical"
            spacing={4}
            width="fill-parent"
          >
            <Text fontSize={12} fontWeight="medium" fill={colors.textLight}>Description</Text>
            <AutoLayout
              width="fill-parent"
              padding={{ vertical: 10, horizontal: 12 }}
              cornerRadius={6}
              fill={colors.inputBg}
              stroke={colors.border}
              strokeWidth={1}
              hoverStyle={{ stroke: colors.accent }}
            >
              <Input
                value={newTaskDesc}
                placeholder="Describe the task details..."
                onTextEditEnd={(e) => { markActivity(); setNewTaskDesc(e.characters) }}
                fontSize={13}
                width="fill-parent"
                fill="#000000"
              />
            </AutoLayout>
          </AutoLayout>

          <AutoLayout
            direction="vertical"
            spacing={4}
            width="fill-parent"
          >
            <Text fontSize={12} fontWeight="medium" fill={colors.textLight}>Reference Link</Text>
            <AutoLayout
              width="fill-parent"
              padding={{ vertical: 10, horizontal: 12 }}
              cornerRadius={6}
              fill={colors.inputBg}
              stroke={colors.border}
              strokeWidth={1}
              hoverStyle={{ stroke: colors.accent }}
            >
              <Input
                value={newTaskLink}
                placeholder="https://..."
                onTextEditEnd={(e) => { markActivity(); setNewTaskLink(e.characters) }}
                fontSize={13}
                width="fill-parent"
                fill="#000000"
              />
            </AutoLayout>
          </AutoLayout>

          <AutoLayout
            direction="vertical"
            spacing={4}
            width="fill-parent"
          >
            <Text fontSize={12} fontWeight="medium" fill={colors.textLight}>Assigned Designer</Text>
            <AutoLayout
              width="fill-parent"
              padding={{ vertical: 10, horizontal: 12 }}
              cornerRadius={6}
              fill={colors.inputBg}
              stroke={colors.border}
              strokeWidth={1}
              hoverStyle={{ stroke: colors.accent }}
            >
              <Input
                value={newTaskDesigner}
                placeholder="Who will work on this task?"
                onTextEditEnd={(e) => { markActivity(); setNewTaskDesigner(e.characters) }}
                fontSize={13}
                width="fill-parent"
                fill="#000000"
              />
            </AutoLayout>
          </AutoLayout>

          <AutoLayout direction="horizontal" spacing={12} verticalAlignItems="center" width="fill-parent" horizontalAlignItems="end">
            <AutoLayout
              padding={{ horizontal: 20, vertical: 12 }}
              cornerRadius={6}
              fill="#1E40AF"
              effect={{
                type: "drop-shadow",
                color: { r: 0, g: 0, b: 0, a: 0.1 },
                offset: { x: 0, y: 2 },
                blur: 4,
                spread: 0
              }}
              hoverStyle={{ fill: "#3B82F6" }}
              onClick={addTask}
            >
              <Text fontSize={14} fill="#FFFFFF" fontWeight="bold">Add Task</Text>
            </AutoLayout>
            
            <AutoLayout padding={{ horizontal: 16, vertical: 12 }} cornerRadius={6} fill="#E1E7FF" stroke={colors.border} strokeWidth={1} hoverStyle={{ fill: "#FFFFFF" }} onClick={() => {
              markActivity()
              setShowAddPopup(false)
              setNewTaskTitle('')
              setNewTaskDesc('')
              setNewTaskLink('')
            }}>
              <Text fontSize={14} fill="#000000" fontWeight="medium">Cancel</Text>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      )}

      {/* Add Task Popup from Column */}
      {addingTask && (
        <AutoLayout
          direction="vertical"
          spacing={16}
          padding={24}
          positioning="absolute"
          x={0}
          y={0}
          width={300}
          cornerRadius={8}
          fill="#FFFFFF"
          stroke="#E0E0E0"
          strokeWidth={1}
          effect={{
            type: "drop-shadow",
            color: { r: 0, g: 0, b: 0, a: 0.1 },
            offset: { x: 0, y: 2 },
            blur: 8,
            spread: 0
          }}
        >
          <Text fontSize={16} fontWeight="bold" fill="#000000">Add New Task to {newTaskState === 'todo' ? 'To Do' : newTaskState === 'inprogress' ? 'In Progress' : newTaskState === 'review' ? 'Review' : 'Done'}</Text>
          
          <AutoLayout direction="vertical" width="fill-parent" spacing={4}>
            <Text fontSize={12} fontWeight="medium" fill="#666666">Task Title</Text>
            <AutoLayout 
              width="fill-parent" 
              padding={{ vertical: 8, horizontal: 12 }}
              cornerRadius={6}
              fill="#F5F5F5"
              stroke="#E0E0E0"
              strokeWidth={1}
              hoverStyle={{
                stroke: "#4F46E5"
              }}
            >
              <Input
                value={newTaskTitle}
                placeholder="Enter a descriptive task title..."
                onTextEditEnd={(e) => { markActivity(); setNewTaskTitle(e.characters) }}
                fontSize={14}
                width="fill-parent"
                fill="#000000"
              />
            </AutoLayout>
          </AutoLayout>

          <AutoLayout direction="vertical" width="fill-parent" spacing={4}>
            <Text fontSize={12} fontWeight="medium" fill="#666666">Description</Text>
            <AutoLayout 
              width="fill-parent" 
              padding={{ vertical: 8, horizontal: 12 }}
              cornerRadius={6}
              fill="#F5F5F5"
              stroke="#E0E0E0"
              strokeWidth={1}
              hoverStyle={{
                stroke: "#4F46E5"
              }}
            >
              <Input
                value={newTaskDesc}
                placeholder="Describe the task in detail..."
                onTextEditEnd={(e) => { markActivity(); setNewTaskDesc(e.characters) }}
                fontSize={14}
                width="fill-parent"
                inputBehavior="multiline"
                fill="#000000"
              />
            </AutoLayout>
          </AutoLayout>

          <AutoLayout direction="vertical" width="fill-parent" spacing={4}>
            <Text fontSize={12} fontWeight="medium" fill="#666666">Link</Text>
            <AutoLayout 
              width="fill-parent" 
              padding={{ vertical: 8, horizontal: 12 }}
              cornerRadius={6}
              fill="#F5F5F5"
              stroke="#E0E0E0"
              strokeWidth={1}
              hoverStyle={{
                stroke: "#4F46E5"
              }}
            >
              <Input
                value={newTaskLink}
                placeholder="https://..."
                onTextEditEnd={(e) => { markActivity(); setNewTaskLink(e.characters) }}
                fontSize={14}
                width="fill-parent"
                fill="#000000"
              />
            </AutoLayout>
          </AutoLayout>

          <AutoLayout direction="vertical" width="fill-parent" spacing={4}>
            <Text fontSize={12} fontWeight="medium" fill="#666666">Designer</Text>
            <AutoLayout 
              width="fill-parent" 
              padding={{ vertical: 8, horizontal: 12 }}
              cornerRadius={6}
              fill="#F5F5F5"
              stroke="#E0E0E0"
              strokeWidth={1}
              hoverStyle={{
                stroke: "#4F46E5"
              }}
            >
              <Input
                value={newTaskDesigner}
                placeholder="Who is working on this task?"
                onTextEditEnd={(e) => { markActivity(); setNewTaskDesigner(e.characters) }}
                fontSize={14}
                width="fill-parent"
                fill="#000000"
              />
            </AutoLayout>
          </AutoLayout>

          <AutoLayout direction="horizontal" spacing={12} verticalAlignItems="center">
            <AutoLayout
              padding={{ horizontal: 20, vertical: 10 }}
              cornerRadius={6}
              fill="#4F46E5"
              hoverStyle={{
                fill: "#3730A3"
              }}
              effect={{
                type: "drop-shadow",
                color: { r: 0, g: 0, b: 0, a: 0.2 },
                offset: { x: 0, y: 1 },
                blur: 3,
                spread: 0
              }}
              onClick={addTask}
            >
              <Text fontSize={14} fill="#FFFFFF" fontWeight="medium">Add Task</Text>
            </AutoLayout>
            
            <AutoLayout 
              padding={{ horizontal: 16, vertical: 10 }} 
              cornerRadius={6} 
              fill="#F5F5F5"
              hoverStyle={{
                fill: "#E0E0E0"
              }}
              onClick={() => {
                markActivity()
                setAddingTask(false)
                setNewTaskTitle('')
                setNewTaskDesc('')
                setNewTaskLink('')
                setNewTaskDesigner('')
              }}
            >
              <Text fontSize={14} fill="#000000" fontWeight="medium">Cancel</Text>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      )}
    </AutoLayout>
  )
}

widget.register(Widget)

// ДАННЫЕ ПО УМОЛЧАНИЮ 
const initialData = {
    "2026-0": {
        employees: [
            { name: "Petr", surname: "Baikal", age: 36, position: "Senior", salary: 5000, project: "GLS" },
            { name: "Susan", surname: "Romashka", age: 28, position: "Middle", salary: 3000, project: "Adidas" }
        ],
        projects: [
            { company: "GLS", project: "Honey Group", budget: 70000, capacity: 5 },
            { company: "Adidas", project: "Sneakers", budget: 120000, capacity: 10 }
        ]
    }
};

let monthlyData = JSON.parse(localStorage.getItem('monthlyData')) || initialData;
let currentPeriod = "2026-0";
let empSortDirection = true;
let projSortDirection = true;
let currentAssigningIndex = null;

// ЭЛЕМЕНТЫ 
const burgerBtn = document.getElementById('burger-toggle');
const sidebar = document.querySelector('.sidebar');
const navEmployees = document.getElementById('nav-employees');
const navProjects = document.getElementById('nav-projects');
const sectionEmployees = document.getElementById('employees-section');
const sectionProjects = document.getElementById('projects-section');
const monthSelect = document.getElementById('month');
const yearSelect = document.getElementById('year');
const overlay = document.getElementById('overlay');

// Сайдбары и формы
const employeeSidebar = document.getElementById('add-employee-sidebar');
const projectSidebar = document.getElementById('add-project-sidebar');
const employeeForm = document.getElementById('add-employee-form');
const projectForm = document.getElementById('add-project-form');

// ФУНКЦИИ ЗАКРЫТИЯ 

window.closeAllSidebars = function () {

    employeeSidebar?.classList.remove('active');
    projectSidebar?.classList.remove('active');
    document.getElementById('assign-modal')?.classList.remove('active');
    document.getElementById('seed-modal')?.classList.remove('active');
    overlay?.classList.remove('active');

    employeeForm?.reset();
    projectForm?.reset();
};

// Привязываем закрытие к клику на оверлей
overlay?.addEventListener('click', closeAllSidebars);

// Функции для конкретных окон (для вызова из HTML)
window.closeSeedModal = () => closeAllSidebars();
window.closeAssignModal = () => closeAllSidebars();

// НАВИГАЦИЯ
burgerBtn?.addEventListener('click', () => sidebar.classList.toggle('collapsed'));

function switchTab(activeNav, showSection, hideSection) {
    document.querySelectorAll('.elements').forEach(el => el.classList.remove('active'));
    activeNav.classList.add('active');
    showSection.classList.remove('hidden');
    hideSection.classList.add('hidden');
    renderAll();
}

navEmployees?.addEventListener('click', (e) => { e.preventDefault(); switchTab(navEmployees, sectionEmployees, sectionProjects); });
navProjects?.addEventListener('click', (e) => { e.preventDefault(); switchTab(navProjects, sectionProjects, sectionEmployees); });

// SEED DATA 

window.openSeedModal = function () {
    const modal = document.getElementById('seed-modal');
    const tableBody = document.getElementById('seed-table-body');
    const targetName = document.getElementById('target-month-name');

    if (targetName) {
        const monthText = monthSelect.options[monthSelect.selectedIndex].text;
        targetName.innerText = `${monthText} ${yearSelect.value}`;
    }

    tableBody.innerHTML = "";
    const periods = Object.keys(monthlyData);
    const otherPeriods = periods.filter(p => p !== currentPeriod);

    if (otherPeriods.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">No other months with data found.</td></tr>';
    } else {
        otherPeriods.forEach(period => {
            const [year, monthIdx] = period.split('-');
            const data = monthlyData[period];
            const monthName = new Date(year, monthIdx).toLocaleString('en-US', { month: 'long' });

            const totalBudget = data.projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
            const totalSalaries = data.employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);
            const income = totalBudget - totalSalaries;

            tableBody.insertAdjacentHTML('beforeend', `
                <tr>
                    <td>${year}</td>
                    <td>${monthName}</td>
                    <td>${data.projects.length}</td>
                    <td>${data.employees.length}</td>
                    <td style="color: ${income >= 0 ? 'green' : 'red'}">${income}$</td>
                    <td>
                        <button class="btn-seed-action" onclick="confirmSeed('${period}')">Seed</button>
                    </td>
                </tr>
            `);
        });
    }

    modal.classList.add('active');
    overlay.classList.add('active');
};

window.confirmSeed = function (fromPeriod) {
    if (confirm(`Copy all data from ${fromPeriod}? This will overwrite current month.`)) {
        monthlyData[currentPeriod] = JSON.parse(JSON.stringify(monthlyData[fromPeriod]));
        saveAndRefresh();
        closeAllSidebars();
    }
};

// Рендер

function renderAll() {
    currentPeriod = `${yearSelect.value}-${monthSelect.value}`;
    if (!monthlyData[currentPeriod]) {
        monthlyData[currentPeriod] = { employees: [], projects: [] };
    }
    renderEmployees();
    renderProjects();
}

function renderEmployees() {
    const listBody = document.getElementById('employees-list-body');
    if (!listBody) return;
    listBody.innerHTML = "";

    monthlyData[currentPeriod].employees.forEach((emp, index) => {
        const statusClass = emp.project ? 'text-offline' : 'text-online';
        listBody.insertAdjacentHTML('beforeend', `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.surname}</td>
                <td>${emp.age}</td>
                <td>${emp.position}</td>
                <td>${emp.salary}$</td>
                <td>${emp.salary}$</td>
                <td><span class="status-text ${statusClass}">${emp.project ? 'Busy' : 'Available'}</span></td>
                <td>${emp.project || '—'}</td>
                <td>
                    <button class="btn-text" onclick="openAssignModal(${index})">Assign</button>
                    <button class="btn-text" style="color:red" onclick="deleteEmployee(${index})">Delete</button>
                </td>
            </tr>
        `);
    });
}

function renderProjects() {
    const listBody = document.getElementById('projects-list-body');
    if (!listBody) return;
    listBody.innerHTML = "";

    monthlyData[currentPeriod].projects.forEach((proj, index) => {
        const staff = monthlyData[currentPeriod].employees.filter(e => e.project === proj.company);
        const costs = staff.reduce((sum, e) => sum + e.salary, 0);
        listBody.insertAdjacentHTML('beforeend', `
            <tr>
                <td>${proj.company}</td>
                <td>${proj.project}</td>
                <td>${proj.budget}$</td>
                <td>${proj.capacity}</td>
                <td>${staff.length}</td>
                <td>${costs}$</td>
                <td><button class="btn-text" style="color:red" onclick="deleteProject(${index})">Delete</button></td>
            </tr>
        `);
    });
}

// ФОРМЫ И ДЕЙСТВИЯ

window.openEmployeeSidebar = () => { employeeSidebar.classList.add('active'); overlay.classList.add('active'); };
window.openProjectSidebar = () => { projectSidebar.classList.add('active'); overlay.classList.add('active'); };

employeeForm.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(employeeForm);
    monthlyData[currentPeriod].employees.push({
        name: fd.get('name'), surname: fd.get('surname'), age: 25,
        position: fd.get('position'), salary: Number(fd.get('salary')), project: ""
    });
    saveAndRefresh();
    closeAllSidebars();
};

projectForm.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(projectForm);
    monthlyData[currentPeriod].projects.push({
        company: fd.get('company'), project: fd.get('projectName'),
        budget: Number(fd.get('budget')), capacity: Number(fd.get('capacity'))
    });
    saveAndRefresh();
    closeAllSidebars();
};

window.deleteEmployee = (index) => { if (confirm("Delete?")) { monthlyData[currentPeriod].employees.splice(index, 1); saveAndRefresh(); } };
window.deleteProject = (index) => { if (confirm("Delete?")) { monthlyData[currentPeriod].projects.splice(index, 1); saveAndRefresh(); } };

function saveAndRefresh() {
    localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
    renderAll();
}

//  ASSIGN 
window.openAssignModal = function (index) {
    currentAssigningIndex = index;
    const emp = monthlyData[currentPeriod].employees[index];
    const modal = document.getElementById('assign-modal');
    const select = document.getElementById('modal-project-select');
    document.getElementById('assign-employee-name').innerText = `${emp.name} ${emp.surname}`;

    select.innerHTML = '<option value="">None (Available)</option>';
    monthlyData[currentPeriod].projects.forEach(p => {
        select.insertAdjacentHTML('beforeend', `<option value="${p.company}" ${emp.project === p.company ? 'selected' : ''}>${p.company}</option>`);
    });

    modal.classList.add('active');
    overlay.classList.add('active');
};

window.confirmAssignment = function () {
    const newProject = document.getElementById('modal-project-select').value;
    monthlyData[currentPeriod].employees[currentAssigningIndex].project = newProject;
    saveAndRefresh();
    closeAllSidebars();
};

// СОРТИРОВКА 
window.sortData = (type) => {
    monthlyData[currentPeriod].employees.sort((a, b) => {
        if (type === 'alpha') return empSortDirection ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        return empSortDirection ? a.salary - b.salary : b.salary - a.salary;
    });
    empSortDirection = !empSortDirection;
    renderEmployees();
};

window.sortProjects = (type) => {
    monthlyData[currentPeriod].projects.sort((a, b) => {
        return projSortDirection ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company);
    });
    projSortDirection = !projSortDirection;
    renderProjects();
};

// Инициализация
monthSelect.onchange = renderAll;
yearSelect.onchange = renderAll;
window.onload = renderAll;
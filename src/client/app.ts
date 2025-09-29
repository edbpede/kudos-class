import type { AppState, Student, Rule } from '../types';
import { loadAppState, saveAppState, exportAppData, validateImportData, downloadJSON, sortStudentsAlphabetically, sortRulesByOrder } from '../utils/storage';

class KudosApp {
	private state: AppState;
	private appContainer: HTMLElement;

	constructor() {
		this.state = loadAppState();
		this.appContainer = document.getElementById('app')!;
		this.init();
	}

	private init(): void {
		this.render();
	}

	private render(): void {
		const loadingElement = document.getElementById('loading');
		if (loadingElement) {
			loadingElement.style.display = 'none';
		}

		if (this.state.mode === 'setup') {
			this.renderSetupMode();
		} else {
			this.renderAwardingMode();
		}
	}

	private renderSetupMode(): void {
		this.appContainer.innerHTML = `
			<div class="container mx-auto px-4 py-8 max-w-2xl">
				<header class="text-center mb-8">
					<h1 class="text-4xl font-bold text-gray-800 mb-2">🌟 Kudos Class</h1>
					<p class="text-gray-600">Set up your class and start rewarding great behavior!</p>
					<div class="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg inline-block">
						<span class="font-medium">Setup Mode</span>
					</div>
				</header>

				<div class="bg-white rounded-2xl shadow-xl p-8">
					<form id="setup-form" class="space-y-6">
						<div>
							<label for="class-name" class="block text-sm font-medium text-gray-700 mb-2">
								Class/Grade Name *
							</label>
							<input
								type="text"
								id="class-name"
								name="className"
								value="${this.state.className}"
								placeholder="e.g., Ms. Smith's 3rd Grade"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
								required
								aria-describedby="class-name-help"
							>
							<p id="class-name-help" class="mt-1 text-sm text-gray-500">Enter your class or grade name</p>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-4">
								Students in Your Class
							</label>
							<div class="space-y-3">
								<div class="flex gap-2">
									<input
										type="text"
										id="new-student-name"
										placeholder="Enter student name"
										class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
										aria-label="New student name"
									>
									<button
										type="button"
										id="add-student-btn"
										class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
										aria-label="Add student"
									>
										Add
									</button>
								</div>
								<div id="student-list" class="space-y-2">
									${this.renderStudentList()}
								</div>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-4">
								Classroom Rules
							</label>
							<p class="text-sm text-gray-600 mb-4">Set clear expectations for your students. These will be displayed during awarding mode.</p>

							<!-- Positive Rules Section -->
							<div class="mb-6">
								<h4 class="text-sm font-semibold text-green-700 mb-3 flex items-center">
									<span class="mr-2">⭐</span> Actions that earn a star
								</h4>
								<div class="space-y-3">
									<div class="flex gap-2">
										<input
											type="text"
											id="new-positive-rule"
											placeholder="e.g., Raising hand before speaking"
											class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
											aria-label="New positive rule"
											maxlength="100"
										>
										<button
											type="button"
											id="add-positive-rule-btn"
											class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
											aria-label="Add positive rule"
										>
											Add
										</button>
									</div>
									<div id="positive-rules-list" class="space-y-2">
										${this.renderPositiveRulesList()}
									</div>
								</div>
							</div>

							<!-- Negative Rules Section -->
							<div class="mb-6">
								<h4 class="text-sm font-semibold text-red-700 mb-3 flex items-center">
									<span class="mr-2">⭐</span> Actions that lose a star
								</h4>
								<div class="space-y-3">
									<div class="flex gap-2">
										<input
											type="text"
											id="new-negative-rule"
											placeholder="e.g., Talking without permission"
											class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
											aria-label="New negative rule"
											maxlength="100"
										>
										<button
											type="button"
											id="add-negative-rule-btn"
											class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
											aria-label="Add negative rule"
										>
											Add
										</button>
									</div>
									<div id="negative-rules-list" class="space-y-2">
										${this.renderNegativeRulesList()}
									</div>
								</div>
							</div>
						</div>

						<div class="flex flex-col sm:flex-row gap-4">
							<button
								type="submit"
								id="save-and-start-btn"
								class="flex-1 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
								disabled="${this.state.students.length === 0 || !this.state.className.trim()}"
							>
								Save and Start Awarding ⭐
							</button>
						</div>

						<div class="border-t pt-6 space-y-3">
							<h3 class="text-sm font-medium text-gray-700">Import/Export Data</h3>
							<div class="flex flex-col sm:flex-row gap-3">
								<button
									type="button"
									id="export-btn"
									class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
									disabled="${this.state.students.length === 0}"
								>
									📤 Export Data
								</button>
								<label class="flex-1">
									<input type="file" id="import-file" accept=".json" class="hidden" aria-label="Import data file">
									<span class="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2">
										📥 Import Data
									</span>
								</label>
							</div>
						</div>
					</form>
				</div>
			</div>
		`;

		this.attachSetupModeListeners();
	}

	private renderStudentList(): string {
		if (this.state.students.length === 0) {
			return '<p class="text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">No students added yet. Add students using the form above.</p>';
		}

		const sortedStudents = sortStudentsAlphabetically(this.state.students);
		return sortedStudents.map(student => `
			<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
				<span class="font-medium text-gray-800">${this.escapeHtml(student.name)}</span>
				<button
					type="button"
					class="remove-student-btn px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					data-student-id="${student.id}"
					aria-label="Remove ${this.escapeHtml(student.name)}"
				>
					Remove
				</button>
			</div>
		`).join('');
	}

	private renderPositiveRulesList(): string {
		const positiveRules = this.state.rules.filter(rule => rule.type === 'positive');
		if (positiveRules.length === 0) {
			return '<p class="text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">No positive rules added yet. Add rules to encourage good behavior.</p>';
		}

		const sortedRules = sortRulesByOrder(positiveRules);
		return sortedRules.map(rule => `
			<div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
				<div class="flex items-center flex-1">
					<span class="text-green-600 mr-2">⭐</span>
					<span class="font-medium text-gray-800">${this.escapeHtml(rule.description)}</span>
				</div>
				<button
					type="button"
					class="remove-rule-btn px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					data-rule-id="${rule.id}"
					aria-label="Remove rule: ${this.escapeHtml(rule.description)}"
				>
					Remove
				</button>
			</div>
		`).join('');
	}

	private renderNegativeRulesList(): string {
		const negativeRules = this.state.rules.filter(rule => rule.type === 'negative');
		if (negativeRules.length === 0) {
			return '<p class="text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">No negative rules added yet. Add rules to discourage unwanted behavior.</p>';
		}

		const sortedRules = sortRulesByOrder(negativeRules);
		return sortedRules.map(rule => `
			<div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
				<div class="flex items-center flex-1">
					<span class="text-red-600 mr-2">⭐</span>
					<span class="font-medium text-gray-800">${this.escapeHtml(rule.description)}</span>
				</div>
				<button
					type="button"
					class="remove-rule-btn px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					data-rule-id="${rule.id}"
					aria-label="Remove rule: ${this.escapeHtml(rule.description)}"
				>
					Remove
				</button>
			</div>
		`).join('');
	}

	private renderAwardingMode(): void {
		const studentCount = this.state.students.length;
		const totalStars = this.state.students.reduce((sum, student) => sum + student.stars, 0);

		this.appContainer.innerHTML = `
			<div class="container mx-auto px-4 py-6 max-w-7xl">
				<header class="text-center mb-6">
					<div class="flex items-center justify-center gap-4 mb-4">
						<button
							id="back-to-setup-btn"
							class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
							aria-label="Return to setup mode"
						>
							← Back to Setup
						</button>
						<div class="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
							<span class="font-medium">Awarding Mode</span>
						</div>
					</div>
					<h1 class="text-3xl font-bold text-gray-800 mb-2">${this.escapeHtml(this.state.className)}</h1>
					<div class="flex items-center justify-center gap-6 text-sm text-gray-600">
						<span>${studentCount} student${studentCount !== 1 ? 's' : ''}</span>
						<span>⭐ ${totalStars} total stars awarded</span>
					</div>
				</header>

				${this.renderRulesDisplay()}

				<!-- Main content area with responsive grid -->
				<div class="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
					<!-- Student cards section -->
					<div class="order-2 lg:order-1">
						<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
							${sortStudentsAlphabetically(this.state.students).map(student => this.renderStudentCard(student)).join('')}
						</div>

						<!-- Instructions section -->
						<div class="mt-8 text-center">
							<div class="inline-block p-4 bg-blue-50 rounded-lg">
								<p class="text-sm text-blue-800 mb-2"><strong>How to use:</strong></p>
								<p class="text-sm text-blue-700">• Tap student name to add a star (max 4)</p>
								<p class="text-sm text-blue-700">• Right-click to remove a star</p>
								<p class="text-sm text-blue-700">• Hover over student cards for +/- controls</p>
							</div>
						</div>
					</div>

					<!-- Rules sidebar (hidden on mobile, visible on larger screens) -->
					<div class="order-1 lg:order-2 hidden lg:block">
						${this.renderRulesSidebar()}
					</div>
				</div>
			</div>
		`;

		this.attachAwardingModeListeners();
	}

	private renderRulesDisplay(): string {
		if (this.state.rules.length === 0) {
			return '';
		}

		const positiveRules = this.state.rules.filter(rule => rule.type === 'positive');
		const negativeRules = this.state.rules.filter(rule => rule.type === 'negative');

		return `
			<!-- Mobile Rules Banner (visible only on mobile/tablet) -->
			<div class="mb-6 lg:hidden">
				<div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
					<button
						id="toggle-mobile-rules-btn"
						class="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						aria-label="Toggle classroom rules"
						aria-expanded="false"
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<span class="text-lg mr-3">📋</span>
								<div class="text-left">
									<h3 class="text-sm font-semibold text-gray-800">Classroom Rules</h3>
									<p class="text-xs text-gray-500">${positiveRules.length + negativeRules.length} rule${positiveRules.length + negativeRules.length !== 1 ? 's' : ''} • Tap to view</p>
								</div>
							</div>
							<div class="flex items-center">
								<span id="mobile-rules-chevron" class="transform transition-transform duration-200">
									<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
									</svg>
								</span>
							</div>
						</div>
					</button>

					<div id="mobile-rules-content" class="hidden">
						<div class="p-4 space-y-4">
							${this.renderRulesContent(positiveRules, negativeRules)}
						</div>
					</div>
				</div>
			</div>
		`;
	}

	private renderRulesSidebar(): string {
		if (this.state.rules.length === 0) {
			return '';
		}

		const positiveRules = this.state.rules.filter(rule => rule.type === 'positive');
		const negativeRules = this.state.rules.filter(rule => rule.type === 'negative');

		return `
			<div class="sticky top-6">
				<div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
					<div class="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
						<h3 class="text-sm font-semibold text-gray-800 flex items-center">
							<span class="text-lg mr-2">📋</span>
							Classroom Rules
						</h3>
						<p class="text-xs text-gray-500 mt-1">${positiveRules.length + negativeRules.length} rule${positiveRules.length + negativeRules.length !== 1 ? 's' : ''} to guide behavior</p>
					</div>

					<div class="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
						${this.renderRulesContent(positiveRules, negativeRules)}
					</div>
				</div>
			</div>
		`;
	}

	private renderRulesContent(positiveRules: any[], negativeRules: any[]): string {
		return `
			${positiveRules.length > 0 ? `
				<div class="mb-4">
					<h4 class="text-sm font-medium text-emerald-700 mb-3 flex items-center">
						<span class="mr-2 text-base">🌟</span>
						Actions that earn a star
					</h4>
					<div class="space-y-2">
						${sortRulesByOrder(positiveRules).map(rule => `
							<div class="flex items-start p-3 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors duration-150">
								<div class="flex-shrink-0 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
									+
								</div>
								<p class="text-sm text-gray-800 leading-relaxed">${this.escapeHtml(rule.description)}</p>
							</div>
						`).join('')}
					</div>
				</div>
			` : ''}

			${negativeRules.length > 0 ? `
				<div>
					<h4 class="text-sm font-medium text-red-700 mb-3 flex items-center">
						<span class="mr-2 text-base">⚠️</span>
						Actions that lose a star
					</h4>
					<div class="space-y-2">
						${sortRulesByOrder(negativeRules).map(rule => `
							<div class="flex items-start p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors duration-150">
								<div class="flex-shrink-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
									−
								</div>
								<p class="text-sm text-gray-800 leading-relaxed">${this.escapeHtml(rule.description)}</p>
							</div>
						`).join('')}
					</div>
				</div>
			` : ''}
		`;
	}

	private renderStudentCard(student: Student): string {
		const stars = '⭐'.repeat(student.stars) + '☆'.repeat(4 - student.stars);

		return `
			<div
				class="student-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-200 transform hover:-translate-y-1 relative group"
				data-student-id="${student.id}"
				role="button"
				tabindex="0"
				aria-label="${this.escapeHtml(student.name)} has ${student.stars} star${student.stars !== 1 ? 's' : ''}. Click to add a star, right-click to remove a star."
			>
				<!-- Hover Controls -->
				<div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<button
						class="hover-control add-star-btn w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-colors duration-150"
						data-student-id="${student.id}"
						aria-label="Add star to ${this.escapeHtml(student.name)}"
						${student.stars >= 4 ? 'disabled' : ''}
					>
						+
					</button>
					<button
						class="hover-control remove-star-btn w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-colors duration-150"
						data-student-id="${student.id}"
						aria-label="Remove star from ${this.escapeHtml(student.name)}"
						${student.stars <= 0 ? 'disabled' : ''}
					>
						−
					</button>
				</div>

				<div class="text-center">
					<h3 class="text-lg font-semibold text-gray-800 mb-3">${this.escapeHtml(student.name)}</h3>
					<div class="text-3xl mb-2" aria-hidden="true">${stars}</div>
					<p class="text-sm text-gray-600">${student.stars}/4 stars</p>
				</div>
			</div>
		`;
	}

	private attachSetupModeListeners(): void {
		const form = document.getElementById('setup-form') as HTMLFormElement;
		const classNameInput = document.getElementById('class-name') as HTMLInputElement;
		const newStudentInput = document.getElementById('new-student-name') as HTMLInputElement;
		const addStudentBtn = document.getElementById('add-student-btn') as HTMLButtonElement;
		const newPositiveRuleInput = document.getElementById('new-positive-rule') as HTMLInputElement;
		const addPositiveRuleBtn = document.getElementById('add-positive-rule-btn') as HTMLButtonElement;
		const newNegativeRuleInput = document.getElementById('new-negative-rule') as HTMLInputElement;
		const addNegativeRuleBtn = document.getElementById('add-negative-rule-btn') as HTMLButtonElement;
		const saveStartBtn = document.getElementById('save-and-start-btn') as HTMLButtonElement;
		const exportBtn = document.getElementById('export-btn') as HTMLButtonElement;
		const importFile = document.getElementById('import-file') as HTMLInputElement;

		// Class name input
		classNameInput.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			this.state.className = target.value;
			this.updateSaveButtonState();
			this.saveState();
		});

		// Add student
		const addStudent = () => {
			const name = newStudentInput.value.trim();
			if (name && name.length <= 50) {
				const student: Student = {
					id: crypto.randomUUID(),
					name: name,
					stars: 0
				};
				this.state.students.push(student);
				newStudentInput.value = '';
				this.updateStudentList();
				this.updateSaveButtonState();
				this.saveState();
			}
		};

		addStudentBtn.addEventListener('click', addStudent);
		newStudentInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				addStudent();
			}
		});

		// Add positive rule
		const addPositiveRule = () => {
			const description = newPositiveRuleInput.value.trim();
			if (description && description.length <= 100) {
				const rule: Rule = {
					id: crypto.randomUUID(),
					description: description,
					type: 'positive',
					order: this.state.rules.filter(r => r.type === 'positive').length + 1
				};
				this.state.rules.push(rule);
				newPositiveRuleInput.value = '';
				this.updateRulesLists();
				this.saveState();
			}
		};

		addPositiveRuleBtn.addEventListener('click', addPositiveRule);
		newPositiveRuleInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				addPositiveRule();
			}
		});

		// Add negative rule
		const addNegativeRule = () => {
			const description = newNegativeRuleInput.value.trim();
			if (description && description.length <= 100) {
				const rule: Rule = {
					id: crypto.randomUUID(),
					description: description,
					type: 'negative',
					order: this.state.rules.filter(r => r.type === 'negative').length + 1
				};
				this.state.rules.push(rule);
				newNegativeRuleInput.value = '';
				this.updateRulesLists();
				this.saveState();
			}
		};

		addNegativeRuleBtn.addEventListener('click', addNegativeRule);
		newNegativeRuleInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				addNegativeRule();
			}
		});

		// Remove student and rules
		document.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('remove-student-btn')) {
				const studentId = target.dataset.studentId;
				if (studentId && confirm('Remove this student from the class?')) {
					this.state.students = this.state.students.filter(s => s.id !== studentId);
					this.updateStudentList();
					this.updateSaveButtonState();
					this.saveState();
				}
			} else if (target.classList.contains('remove-rule-btn')) {
				const ruleId = target.dataset.ruleId;
				if (ruleId && confirm('Remove this rule?')) {
					this.state.rules = this.state.rules.filter(r => r.id !== ruleId);
					this.updateRulesLists();
					this.saveState();
				}
			}
		});

		// Form submit
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			if (this.validateSetupForm()) {
				this.state.mode = 'awarding';
				this.saveState();
				this.render();
			}
		});

		// Export/Import
		exportBtn.addEventListener('click', () => {
			const data = exportAppData(this.state);
			const filename = `kudos-class-${this.state.className.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
			downloadJSON(data, filename);
		});

		importFile.addEventListener('change', (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (event) => {
					try {
						const data = JSON.parse(event.target?.result as string);
						const validData = validateImportData(data);
						if (validData) {
							if (confirm('This will replace your current class data. Continue?')) {
								this.state.className = validData.className;
								this.state.students = validData.students;
								this.state.rules = validData.rules || [];
								this.saveState();
								this.render();
							}
						} else {
							alert('Invalid import file. Please check the file format.');
						}
					} catch (error) {
						alert('Error reading import file. Please check the file format.');
					}
				};
				reader.readAsText(file);
			}
		});
	}

	private attachAwardingModeListeners(): void {
		const backBtn = document.getElementById('back-to-setup-btn') as HTMLButtonElement;

		backBtn.addEventListener('click', () => {
			this.state.mode = 'setup';
			this.saveState();
			this.render();
		});

		// Mobile rules toggle functionality
		const toggleMobileRulesBtn = document.getElementById('toggle-mobile-rules-btn');
		const mobileRulesContent = document.getElementById('mobile-rules-content');
		const mobileRulesChevron = document.getElementById('mobile-rules-chevron');

		if (toggleMobileRulesBtn && mobileRulesContent && mobileRulesChevron) {
			toggleMobileRulesBtn.addEventListener('click', () => {
				const isHidden = mobileRulesContent.classList.contains('hidden');

				if (isHidden) {
					// Show rules
					mobileRulesContent.classList.remove('hidden');
					mobileRulesContent.style.display = 'block';
					mobileRulesChevron.style.transform = 'rotate(180deg)';
					toggleMobileRulesBtn.setAttribute('aria-expanded', 'true');

					// Smooth reveal animation
					requestAnimationFrame(() => {
						mobileRulesContent.style.opacity = '0';
						mobileRulesContent.style.transform = 'translateY(-10px)';
						mobileRulesContent.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';

						requestAnimationFrame(() => {
							mobileRulesContent.style.opacity = '1';
							mobileRulesContent.style.transform = 'translateY(0)';
						});
					});
				} else {
					// Hide rules
					mobileRulesContent.style.transition = 'opacity 0.2s ease-in, transform 0.2s ease-in';
					mobileRulesContent.style.opacity = '0';
					mobileRulesContent.style.transform = 'translateY(-10px)';
					mobileRulesChevron.style.transform = 'rotate(0deg)';
					toggleMobileRulesBtn.setAttribute('aria-expanded', 'false');

					setTimeout(() => {
						mobileRulesContent.classList.add('hidden');
						mobileRulesContent.style.display = 'none';
					}, 200);
				}
			});
		}

		// Student card interactions
		document.querySelectorAll('.student-card').forEach(card => {
			const studentId = (card as HTMLElement).dataset.studentId!;

			const addStar = () => {
				const student = this.state.students.find(s => s.id === studentId);
				if (student && student.stars < 4) {
					student.stars++;
					this.saveState();
					this.updateStudentCard(studentId, student);
				}
			};

			const removeStar = () => {
				const student = this.state.students.find(s => s.id === studentId);
				if (student && student.stars > 0) {
					student.stars--;
					this.saveState();
					this.updateStudentCard(studentId, student);
				}
			};

			// Click/tap to add star (only if not clicking hover controls)
			card.addEventListener('click', (e) => {
				const target = e.target as HTMLElement;
				if (!target.classList.contains('hover-control') && !target.closest('.hover-control')) {
					addStar();
				}
			});

			// Right-click to remove star (desktop)
			card.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				removeStar();
			});

			// Keyboard navigation
			card.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					addStar();
				} else if (e.key === 'Backspace' || e.key === 'Delete') {
					e.preventDefault();
					removeStar();
				}
			});
		});

		// Hover control interactions
		document.querySelectorAll('.add-star-btn').forEach(btn => {
			btn.addEventListener('click', (e) => {
				e.stopPropagation();
				const studentId = (btn as HTMLElement).dataset.studentId!;
				const student = this.state.students.find(s => s.id === studentId);
				if (student && student.stars < 4) {
					student.stars++;
					this.saveState();
					this.updateStudentCard(studentId, student);
				}
			});
		});

		document.querySelectorAll('.remove-star-btn').forEach(btn => {
			btn.addEventListener('click', (e) => {
				e.stopPropagation();
				const studentId = (btn as HTMLElement).dataset.studentId!;
				const student = this.state.students.find(s => s.id === studentId);
				if (student && student.stars > 0) {
					student.stars--;
					this.saveState();
					this.updateStudentCard(studentId, student);
				}
			});
		});
	}

	private updateStudentCard(studentId: string, student: Student): void {
		const card = document.querySelector(`[data-student-id="${studentId}"]`) as HTMLElement;
		if (card) {
			const stars = '⭐'.repeat(student.stars) + '☆'.repeat(4 - student.stars);
			const starsElement = card.querySelector('.text-3xl');
			const countElement = card.querySelector('.text-center .text-sm');

			if (starsElement) starsElement.textContent = stars;
			if (countElement) countElement.textContent = `${student.stars}/4 stars`;

			card.setAttribute('aria-label', `${student.name} has ${student.stars} star${student.stars !== 1 ? 's' : ''}. Click to add a star, right-click to remove a star.`);

			// Update hover control button states
			const addBtn = card.querySelector('.add-star-btn') as HTMLButtonElement;
			const removeBtn = card.querySelector('.remove-star-btn') as HTMLButtonElement;

			if (addBtn) {
				addBtn.disabled = student.stars >= 4;
				addBtn.style.opacity = student.stars >= 4 ? '0.5' : '1';
			}
			if (removeBtn) {
				removeBtn.disabled = student.stars <= 0;
				removeBtn.style.opacity = student.stars <= 0 ? '0.5' : '1';
			}

			// Add visual feedback
			card.classList.add('scale-105', 'ring-2', 'ring-yellow-300');
			setTimeout(() => {
				card.classList.remove('scale-105', 'ring-2', 'ring-yellow-300');
			}, 200);
		}

		// Update header stats
		const totalStars = this.state.students.reduce((sum, s) => sum + s.stars, 0);
		const statsElement = document.querySelector('.text-gray-600');
		if (statsElement) {
			statsElement.innerHTML = `<span>${this.state.students.length} student${this.state.students.length !== 1 ? 's' : ''}</span><span>⭐ ${totalStars} total stars awarded</span>`;
		}
	}

	private updateStudentList(): void {
		const studentListElement = document.getElementById('student-list');
		if (studentListElement) {
			studentListElement.innerHTML = this.renderStudentList();
		}
	}

	private updateRulesLists(): void {
		const positiveRulesElement = document.getElementById('positive-rules-list');
		const negativeRulesElement = document.getElementById('negative-rules-list');

		if (positiveRulesElement) {
			positiveRulesElement.innerHTML = this.renderPositiveRulesList();
		}
		if (negativeRulesElement) {
			negativeRulesElement.innerHTML = this.renderNegativeRulesList();
		}
	}

	private updateSaveButtonState(): void {
		const saveBtn = document.getElementById('save-and-start-btn') as HTMLButtonElement;
		const exportBtn = document.getElementById('export-btn') as HTMLButtonElement;
		const isValid = this.validateSetupForm();

		if (saveBtn) {
			saveBtn.disabled = !isValid;
		}
		if (exportBtn) {
			exportBtn.disabled = this.state.students.length === 0;
		}
	}

	private validateSetupForm(): boolean {
		return this.state.className.trim().length > 0 && this.state.students.length > 0;
	}

	private saveState(): void {
		saveAppState(this.state);
	}

	private escapeHtml(text: string): string {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	new KudosApp();
});
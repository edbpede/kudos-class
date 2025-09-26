import type { AppState, Student } from '../types';
import { loadAppState, saveAppState, exportAppData, validateImportData, downloadJSON } from '../utils/storage';

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

		return this.state.students.map(student => `
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

	private renderAwardingMode(): void {
		const studentCount = this.state.students.length;
		const totalStars = this.state.students.reduce((sum, student) => sum + student.stars, 0);

		this.appContainer.innerHTML = `
			<div class="container mx-auto px-4 py-6">
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

				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					${this.state.students.map(student => this.renderStudentCard(student)).join('')}
				</div>

				<div class="mt-8 text-center">
					<div class="inline-block p-4 bg-blue-50 rounded-lg">
						<p class="text-sm text-blue-800 mb-2"><strong>How to use:</strong></p>
						<p class="text-sm text-blue-700">• Tap student name to add a star (max 4)</p>
						<p class="text-sm text-blue-700">• Long-press or right-click to remove a star</p>
					</div>
				</div>
			</div>
		`;

		this.attachAwardingModeListeners();
	}

	private renderStudentCard(student: Student): string {
		const stars = '⭐'.repeat(student.stars) + '☆'.repeat(4 - student.stars);

		return `
			<div
				class="student-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-200 transform hover:-translate-y-1"
				data-student-id="${student.id}"
				role="button"
				tabindex="0"
				aria-label="${this.escapeHtml(student.name)} has ${student.stars} star${student.stars !== 1 ? 's' : ''}. Click to add a star, long-press or right-click to remove a star."
			>
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

		// Remove student
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

		// Student card interactions
		document.querySelectorAll('.student-card').forEach(card => {
			const studentId = (card as HTMLElement).dataset.studentId!;
			let pressTimer: number;
			let isLongPress = false;

			const addStar = () => {
				if (!isLongPress) {
					const student = this.state.students.find(s => s.id === studentId);
					if (student && student.stars < 4) {
						student.stars++;
						this.saveState();
						this.updateStudentCard(studentId, student);
					}
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

			// Click/tap to add star
			card.addEventListener('click', addStar);

			// Long-press to remove star (mobile)
			card.addEventListener('touchstart', (e) => {
				isLongPress = false;
				pressTimer = window.setTimeout(() => {
					isLongPress = true;
					navigator.vibrate?.(100);
					removeStar();
				}, 800);
			});

			card.addEventListener('touchend', () => {
				clearTimeout(pressTimer);
			});

			card.addEventListener('touchmove', () => {
				clearTimeout(pressTimer);
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
	}

	private updateStudentCard(studentId: string, student: Student): void {
		const card = document.querySelector(`[data-student-id="${studentId}"]`) as HTMLElement;
		if (card) {
			const stars = '⭐'.repeat(student.stars) + '☆'.repeat(4 - student.stars);
			const starsElement = card.querySelector('.text-3xl');
			const countElement = card.querySelector('.text-sm');

			if (starsElement) starsElement.textContent = stars;
			if (countElement) countElement.textContent = `${student.stars}/4 stars`;

			card.setAttribute('aria-label', `${student.name} has ${student.stars} star${student.stars !== 1 ? 's' : ''}. Click to add a star, long-press or right-click to remove a star.`);

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
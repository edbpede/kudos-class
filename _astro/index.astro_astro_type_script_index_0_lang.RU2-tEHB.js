const N="kudos-class-app-state",E={mode:"setup",className:"",students:[],rules:[]};function D(){try{const n=localStorage.getItem(N);if(n){const e=JSON.parse(n);return{...E,...e,students:b(e.students||[]),rules:e.rules||[]}}}catch(n){console.warn("Failed to load app state from localStorage:",n)}return E}function M(n){try{localStorage.setItem(N,JSON.stringify(n))}catch(e){console.error("Failed to save app state to localStorage:",e)}}function j(n){return{className:n.className,students:b(n.students),rules:x(n.rules),exportDate:new Date().toISOString(),version:"1.0"}}function P(n){try{if(typeof n=="object"&&n!==null&&typeof n.className=="string"&&Array.isArray(n.students)&&Array.isArray(n.rules||[])&&typeof n.exportDate=="string"&&typeof n.version=="string"){const e=n.students.every(t=>typeof t=="object"&&t!==null&&typeof t.id=="string"&&typeof t.name=="string"&&typeof t.stars=="number"&&t.stars>=0&&t.stars<=5),s=!n.rules||n.rules.every(t=>typeof t=="object"&&t!==null&&typeof t.id=="string"&&typeof t.description=="string"&&(t.type==="positive"||t.type==="negative")&&typeof t.order=="number");if(e&&s)return{...n,students:b(n.students),rules:n.rules||[]}}}catch(e){console.error("Import data validation failed:",e)}return null}function U(n,e){const s=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),t=URL.createObjectURL(s),a=document.createElement("a");a.href=t,a.download=e,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(t)}function b(n){const e=new Intl.Collator("da-DK",{sensitivity:"accent",numeric:!1,ignorePunctuation:!1,caseFirst:"lower"});return[...n].sort((s,t)=>e.compare(s.name,t.name))}function x(n){return[...n].sort((e,s)=>e.order!==s.order?e.order-s.order:e.type!==s.type?e.type==="positive"?-1:1:e.description.localeCompare(s.description))}const H="modulepreload",q=function(n){return"/"+n},B={},A=function(e,s,t){let a=Promise.resolve();if(s&&s.length>0){let c=function(o){return Promise.all(o.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),p=l?.nonce||l?.getAttribute("nonce");a=c(s.map(o=>{if(o=q(o),o in B)return;B[o]=!0;const u=o.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${f}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":H,u||(m.as="script"),m.crossOrigin="",m.href=o,p&&m.setAttribute("nonce",p),document.head.appendChild(m),u)return new Promise((v,w)=>{m.addEventListener("load",v),m.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${o}`)))})}))}function i(c){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=c,window.dispatchEvent(l),!l.defaultPrevented)throw c}return a.then(c=>{for(const l of c||[])l.status==="rejected"&&i(l.reason);return e().catch(i)})},O=(n,e,s)=>{const t=n[e];return t?typeof t=="function"?t():Promise.resolve(t):new Promise((a,i)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(i.bind(null,new Error("Unknown variable dynamic import: "+e+(e.split("/").length!==s?". Note that variables only represent file names one level deep.":""))))})},L="da",$=["da","en"],C={da:{native:"Dansk",english:"Danish"},en:{native:"English",english:"English"}};let R={da:{},en:{}};async function F(n){try{const e=await O(Object.assign({"./locales/da.json":()=>A(()=>import("./da.BIlCUBxo.js"),[]),"./locales/en.json":()=>A(()=>import("./en.BPpI5zjp.js"),[])}),`./locales/${n}.json`,3);R[n]=e.default}catch(e){console.error(`Failed to load translations for locale: ${n}`,e)}}async function X(){await Promise.all($.map(n=>F(n)))}function I(n,e){return e.split(".").reduce((s,t)=>s?.[t],n)}function r(n,e=L,s){const t=I(R[e],n);if(t)return t;if(e!==L){const a=I(R[L],n);if(a)return a}return s||n}function k(){if(typeof window>"u")return L;const n=localStorage.getItem("kudos-locale");return n&&$.includes(n)?n:L}function J(n){if(!(typeof window>"u")){if(!$.includes(n)){console.error(`Invalid locale: ${n}`);return}localStorage.setItem("kudos-locale",n),window.dispatchEvent(new CustomEvent("localechange",{detail:{locale:n}}))}}function V(){return[...$]}class Y{container;currentLocale;constructor(e){const s=document.getElementById(e);if(!s)throw new Error(`Container with id "${e}" not found`);this.container=s,this.currentLocale=k(),this.render(),this.attachEventListeners()}render(){const e=V();this.container.innerHTML=`
      <div class="inline-flex items-center gap-2 bg-white rounded-lg shadow-md border border-gray-200 p-1">
        ${e.map(s=>`
          <button
            type="button"
            class="language-btn px-3 py-2 rounded-md text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${s===this.currentLocale?"bg-blue-600 text-white":"text-gray-700 hover:bg-gray-100"}"
            data-locale="${s}"
            aria-label="Switch to ${C[s].english}"
            ${s===this.currentLocale?'aria-current="true"':""}
          >
            ${C[s].native}
          </button>
        `).join("")}
      </div>
    `}attachEventListeners(){this.container.querySelectorAll(".language-btn").forEach(e=>{e.addEventListener("click",s=>{const a=s.target.dataset.locale;a&&a!==this.currentLocale&&this.changeLanguage(a)})})}changeLanguage(e){this.currentLocale=e,J(e),this.render(),this.attachEventListeners(),window.dispatchEvent(new CustomEvent("languagechange",{detail:{locale:e}}))}update(){this.currentLocale=k(),this.render(),this.attachEventListeners()}}function _(n){return new Y(n)}class G{state;appContainer;currentLocale;constructor(){this.state=D(),this.appContainer=document.getElementById("app"),this.currentLocale=k(),this.init()}async init(){await X(),this.render(),this.setupLanguageChangeListener()}setupLanguageChangeListener(){window.addEventListener("languagechange",(e=>{this.currentLocale=e.detail.locale,document.documentElement.lang=this.currentLocale,this.render()}))}render(){const e=document.getElementById("loading");e&&(e.style.display="none"),this.state.mode==="setup"?this.renderSetupMode():this.renderAwardingMode()}renderSetupMode(){this.appContainer.innerHTML=`
			<div class="container mx-auto px-4 py-8 max-w-2xl">
				<header class="text-center mb-8">
					<div class="flex justify-end mb-4">
						<div id="language-switcher-setup"></div>
					</div>
					<div class="flex items-center justify-center gap-3 mb-2">
						<img src="/favicon.svg" alt="" class="w-8 h-8 opacity-60" aria-hidden="true" />
						<h1 class="text-4xl font-bold text-gray-800">${r("setup.title",this.currentLocale)}</h1>
					</div>
					<p class="text-gray-600">${r("setup.subtitle",this.currentLocale)}</p>
					<div class="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg inline-block">
						<span class="font-medium">${r("modes.setup",this.currentLocale)}</span>
					</div>
				</header>

				<div class="bg-white rounded-2xl shadow-xl p-8">
					<form id="setup-form" class="space-y-6">
						<div>
							<label for="class-name" class="block text-sm font-medium text-gray-700 mb-2">
								${r("setup.className.label",this.currentLocale)} *
							</label>
							<input
								type="text"
								id="class-name"
								name="className"
								value="${this.state.className}"
								placeholder="${r("setup.className.placeholder",this.currentLocale)}"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
								required
								aria-describedby="class-name-help"
							>
							<p id="class-name-help" class="mt-1 text-sm text-gray-500">${r("setup.className.help",this.currentLocale)}</p>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-4">
								${r("setup.students.label",this.currentLocale)}
							</label>
							<div class="space-y-3">
								<div class="flex gap-2">
									<input
										type="text"
										id="new-student-name"
										placeholder="${r("setup.students.placeholder",this.currentLocale)}"
										class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
										aria-label="${r("setup.students.placeholder",this.currentLocale)}"
									>
									<button
										type="button"
										id="add-student-btn"
										class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
										aria-label="${r("setup.students.addButton",this.currentLocale)}"
									>
										${r("setup.students.addButton",this.currentLocale)}
									</button>
								</div>
								<div id="student-list" class="space-y-2">
									${this.renderStudentList()}
								</div>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-4">
								${r("setup.rules.label",this.currentLocale)}
							</label>
							<p class="text-sm text-gray-600 mb-4">${r("setup.rules.description",this.currentLocale)}</p>

							<!-- Positive Rules Section -->
							<div class="mb-6">
								<h4 class="text-sm font-semibold text-green-700 mb-3 flex items-center">
									<span class="mr-2">⭐</span> ${r("setup.rules.positive.title",this.currentLocale)}
								</h4>
								<div class="space-y-3">
									<div class="flex gap-2">
										<input
											type="text"
											id="new-positive-rule"
											placeholder="${r("setup.rules.positive.placeholder",this.currentLocale)}"
											class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
											aria-label="${r("setup.rules.positive.placeholder",this.currentLocale)}"
											maxlength="100"
										>
										<button
											type="button"
											id="add-positive-rule-btn"
											class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
											aria-label="${r("setup.rules.positive.addButton",this.currentLocale)}"
										>
											${r("setup.rules.positive.addButton",this.currentLocale)}
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
									<span class="mr-2">⭐</span> ${r("setup.rules.negative.title",this.currentLocale)}
								</h4>
								<div class="space-y-3">
									<div class="flex gap-2">
										<input
											type="text"
											id="new-negative-rule"
											placeholder="${r("setup.rules.negative.placeholder",this.currentLocale)}"
											class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
											aria-label="${r("setup.rules.negative.placeholder",this.currentLocale)}"
											maxlength="100"
										>
										<button
											type="button"
											id="add-negative-rule-btn"
											class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
											aria-label="${r("setup.rules.negative.addButton",this.currentLocale)}"
										>
											${r("setup.rules.negative.addButton",this.currentLocale)}
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
								${this.state.students.length===0||!this.state.className.trim()?"disabled":""}
							>
								${r("setup.buttons.saveAndStart",this.currentLocale)}
							</button>
							<button
								type="button"
								id="reset-btn"
								class="px-8 py-4 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-600 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium"
							>
								${r("setup.buttons.resetAll",this.currentLocale)}
							</button>
						</div>

						<div class="border-t pt-6 space-y-3">
							<h3 class="text-sm font-medium text-gray-700">${r("setup.importExport.title",this.currentLocale)}</h3>
							<div class="flex flex-col sm:flex-row gap-3">
								<button
									type="button"
									id="export-btn"
									class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
									disabled="${this.state.students.length===0}"
								>
									${r("setup.buttons.export",this.currentLocale)}
								</button>
								<label class="flex-1">
									<input type="file" id="import-file" accept=".json" class="hidden" aria-label="${r("setup.buttons.import",this.currentLocale)}">
									<span class="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2">
										${r("setup.buttons.import",this.currentLocale)}
									</span>
								</label>
							</div>
						</div>
					</form>
				</div>
			</div>
		`,this.attachSetupModeListeners(),_("language-switcher-setup")}renderStudentList(){return this.state.students.length===0?`<p class="text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">${r("setup.students.noStudents",this.currentLocale)}</p>`:b(this.state.students).map(s=>`
			<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
				<span class="font-medium text-gray-800">${this.escapeHtml(s.name)}</span>
				<button
					type="button"
					class="remove-student-btn px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					data-student-id="${s.id}"
					aria-label="${r("setup.students.removeButton",this.currentLocale)} ${this.escapeHtml(s.name)}"
				>
					${r("setup.students.removeButton",this.currentLocale)}
				</button>
			</div>
		`).join("")}renderPositiveRulesList(){const e=this.state.rules.filter(t=>t.type==="positive");return e.length===0?`<p class="text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">${r("setup.rules.positive.noRules",this.currentLocale)}</p>`:x(e).map(t=>`
			<div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
				<div class="flex items-center flex-1">
					<span class="text-green-600 mr-2">⭐</span>
					<span class="font-medium text-gray-800">${this.escapeHtml(t.description)}</span>
				</div>
				<button
					type="button"
					class="remove-rule-btn px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					data-rule-id="${t.id}"
					aria-label="${r("setup.rules.removeButton",this.currentLocale)}: ${this.escapeHtml(t.description)}"
				>
					${r("setup.rules.removeButton",this.currentLocale)}
				</button>
			</div>
		`).join("")}renderNegativeRulesList(){const e=this.state.rules.filter(t=>t.type==="negative");return e.length===0?`<p class="text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">${r("setup.rules.negative.noRules",this.currentLocale)}</p>`:x(e).map(t=>`
			<div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
				<div class="flex items-center flex-1">
					<span class="text-red-600 mr-2">⭐</span>
					<span class="font-medium text-gray-800">${this.escapeHtml(t.description)}</span>
				</div>
				<button
					type="button"
					class="remove-rule-btn px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					data-rule-id="${t.id}"
					aria-label="${r("setup.rules.removeButton",this.currentLocale)}: ${this.escapeHtml(t.description)}"
				>
					${r("setup.rules.removeButton",this.currentLocale)}
				</button>
			</div>
		`).join("")}renderAwardingMode(){const e=this.state.students.length,s=this.state.students.reduce((l,p)=>l+p.stars,0),t=e!==1?r("awarding.stats.students",this.currentLocale):r("awarding.stats.student",this.currentLocale),a=this.state.rules.length>0,i=a?"grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]":"",c="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(11rem,1fr))]";this.appContainer.innerHTML=`
			<div class="container mx-auto px-4 py-6 max-w-screen-2xl">
				<header class="text-center mb-6">
					<div class="flex items-center justify-center gap-4 mb-4">
						<button
							id="back-to-setup-btn"
							class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
							aria-label="${r("awarding.backButton",this.currentLocale)}"
						>
							${r("awarding.backButton",this.currentLocale)}
						</button>
						<div class="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
							<span class="font-medium">${r("modes.awarding",this.currentLocale)}</span>
						</div>
						<div id="language-switcher-awarding"></div>
					</div>
					<div class="flex items-center justify-center gap-3 mb-2">
						<img src="/favicon.svg" alt="" class="w-7 h-7 opacity-50" aria-hidden="true" />
						<h1 class="text-3xl font-bold text-gray-800">${this.escapeHtml(this.state.className)}</h1>
					</div>
					<div class="flex items-center justify-center gap-6 text-sm text-gray-600">
						<span>${e} ${t}</span>
						<span>⭐ ${s} ${r("awarding.stats.totalStars",this.currentLocale)}</span>
					</div>
				</header>

				${this.renderRulesDisplay()}

				<!-- Main content area with responsive grid -->
				<div class="${i}">
					<!-- Student cards section -->
					<div class="order-2 lg:order-1">
						<div class="${c}">
							${b(this.state.students).map(l=>this.renderStudentCard(l)).join("")}
						</div>

						<!-- Instructions section -->
						<div class="mt-8 text-center">
							<div class="inline-block p-4 bg-blue-50 rounded-lg">
								<p class="text-sm text-blue-800 mb-2"><strong>${r("awarding.instructions.title",this.currentLocale)}</strong></p>
								<p class="text-sm text-blue-700">${r("awarding.instructions.tap",this.currentLocale)}</p>
								<p class="text-sm text-blue-700">${r("awarding.instructions.rightClick",this.currentLocale)}</p>
								<p class="text-sm text-blue-700">${r("awarding.instructions.hover",this.currentLocale)}</p>
							</div>
						</div>
					</div>

					<!-- Rules sidebar (hidden on mobile, visible on larger screens) -->
					<div class="order-1 lg:order-2 hidden lg:block ${a?"":"lg:hidden"}">
						${this.renderRulesSidebar()}
					</div>
				</div>
			</div>
		`,this.attachAwardingModeListeners(),_("language-switcher-awarding")}renderRulesDisplay(){if(this.state.rules.length===0)return"";const e=this.state.rules.filter(i=>i.type==="positive"),s=this.state.rules.filter(i=>i.type==="negative"),t=e.length+s.length,a=t!==1?r("awarding.rules.subtitle",this.currentLocale):r("awarding.rules.rule",this.currentLocale);return`
			<!-- Mobile Rules Banner (visible only on mobile/tablet) -->
			<div class="mb-6 lg:hidden">
				<div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
					<button
						id="toggle-mobile-rules-btn"
						class="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						aria-label="${r("awarding.rules.title",this.currentLocale)}"
						aria-expanded="false"
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<span class="text-lg mr-3">📋</span>
								<div class="text-left">
									<h3 class="text-sm font-semibold text-gray-800">${r("awarding.rules.title",this.currentLocale)}</h3>
									<p class="text-xs text-gray-500">${t} ${a} • ${r("awarding.rules.toggleButton",this.currentLocale)}</p>
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
							${this.renderRulesContent(e,s)}
						</div>
					</div>
				</div>
			</div>
		`}renderRulesSidebar(){if(this.state.rules.length===0)return"";const e=this.state.rules.filter(i=>i.type==="positive"),s=this.state.rules.filter(i=>i.type==="negative"),t=e.length+s.length,a=t!==1?r("awarding.rules.subtitle",this.currentLocale):r("awarding.rules.rule",this.currentLocale);return`
			<div class="sticky top-6">
				<div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
					<div class="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
						<h3 class="text-sm font-semibold text-gray-800 flex items-center">
							<span class="text-lg mr-2">📋</span>
							${r("awarding.rules.title",this.currentLocale)}
						</h3>
						<p class="text-xs text-gray-500 mt-1">${t} ${a}</p>
					</div>

					<div class="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
						${this.renderRulesContent(e,s)}
					</div>
				</div>
			</div>
		`}renderRulesContent(e,s){return`
			${e.length>0?`
				<div class="mb-4">
					<h4 class="text-sm font-medium text-emerald-700 mb-3 flex items-center">
						<span class="mr-2 text-base">🌟</span>
						${r("awarding.rules.positive",this.currentLocale)}
					</h4>
					<div class="space-y-2">
						${x(e).map((t,a)=>`
							<div class="flex items-start p-3 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors duration-150">
								<div class="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
									${a+1}
								</div>
								<p class="text-sm text-gray-800 leading-relaxed"><span class="font-medium">${a+1}.</span> ${this.escapeHtml(t.description)}</p>
							</div>
						`).join("")}
					</div>
				</div>
			`:""}

			${s.length>0?`
				<div>
					<h4 class="text-sm font-medium text-red-700 mb-3 flex items-center">
						<span class="mr-2 text-base">⚠️</span>
						${r("awarding.rules.negative",this.currentLocale)}
					</h4>
					<div class="space-y-2">
						${x(s).map((t,a)=>`
							<div class="flex items-start p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors duration-150">
								<div class="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
									${a+1}
								</div>
								<p class="text-sm text-gray-800 leading-relaxed"><span class="font-medium">${a+1}.</span> ${this.escapeHtml(t.description)}</p>
							</div>
						`).join("")}
					</div>
				</div>
			`:""}
		`}renderStudentCard(e){const s="⭐".repeat(e.stars)+"☆".repeat(5-e.stars),t=e.stars!==1?r("awarding.studentCard.stars",this.currentLocale):r("awarding.studentCard.stars",this.currentLocale);return`
			<div
				class="student-card bg-white rounded-xl shadow-lg p-4 sm:p-5 hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-200 transform hover:-translate-y-1 relative group"
				data-student-id="${e.id}"
				role="button"
				tabindex="0"
				aria-label="${this.escapeHtml(e.name)} ${e.stars} ${r("awarding.studentCard.ariaLabel",this.currentLocale)}"
			>
				<!-- Hover Controls -->
				<div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<button
						class="hover-control add-star-btn w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-colors duration-150"
						data-student-id="${e.id}"
						aria-label="${r("awarding.studentCard.addStar",this.currentLocale)} ${this.escapeHtml(e.name)}"
						${e.stars>=5?"disabled":""}
					>
						+
					</button>
					<button
						class="hover-control remove-star-btn w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-colors duration-150"
						data-student-id="${e.id}"
						aria-label="${r("awarding.studentCard.removeStar",this.currentLocale)} ${this.escapeHtml(e.name)}"
						${e.stars<=0?"disabled":""}
					>
						−
					</button>
				</div>

				<div class="text-center">
					<h3 class="text-lg font-semibold text-gray-800 mb-3">${this.escapeHtml(e.name)}</h3>
					<div class="text-2xl xl:text-3xl mb-2" aria-hidden="true">${s}</div>
					<p class="text-sm text-gray-600">${e.stars}/5 ${t}</p>
				</div>
			</div>
		`}attachSetupModeListeners(){const e=document.getElementById("setup-form"),s=document.getElementById("class-name"),t=document.getElementById("new-student-name"),a=document.getElementById("add-student-btn"),i=document.getElementById("new-positive-rule"),c=document.getElementById("add-positive-rule-btn"),l=document.getElementById("new-negative-rule"),p=document.getElementById("add-negative-rule-btn");document.getElementById("save-and-start-btn");const o=document.getElementById("reset-btn"),u=document.getElementById("export-btn"),f=document.getElementById("import-file");s.addEventListener("input",d=>{const g=d.target;this.state.className=g.value,this.updateSaveButtonState(),this.saveState()});const m=()=>{const d=t.value.trim();if(d&&d.length<=50){const g={id:crypto.randomUUID(),name:d,stars:0};this.state.students=b([...this.state.students,g]),t.value="",this.updateStudentList(),this.updateSaveButtonState(),this.saveState()}};a.addEventListener("click",m),t.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),m())});const v=()=>{const d=i.value.trim();if(d&&d.length<=100){const g={id:crypto.randomUUID(),description:d,type:"positive",order:this.state.rules.filter(h=>h.type==="positive").length+1};this.state.rules.push(g),i.value="",this.updateRulesLists(),this.saveState()}};c.addEventListener("click",v),i.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),v())});const w=()=>{const d=l.value.trim();if(d&&d.length<=100){const g={id:crypto.randomUUID(),description:d,type:"negative",order:this.state.rules.filter(h=>h.type==="negative").length+1};this.state.rules.push(g),l.value="",this.updateRulesLists(),this.saveState()}};p.addEventListener("click",w),l.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),w())}),document.addEventListener("click",d=>{const g=d.target;if(g.classList.contains("remove-student-btn")){const h=g.dataset.studentId;h&&confirm(r("setup.students.removeConfirm",this.currentLocale))&&(this.state.students=this.state.students.filter(y=>y.id!==h),this.updateStudentList(),this.updateSaveButtonState(),this.saveState())}else if(g.classList.contains("remove-rule-btn")){const h=g.dataset.ruleId;h&&confirm(r("setup.rules.removeConfirm",this.currentLocale))&&(this.state.rules=this.state.rules.filter(y=>y.id!==h),this.updateRulesLists(),this.saveState())}}),e.addEventListener("submit",d=>{d.preventDefault(),this.validateSetupForm()&&(this.state.mode="awarding",this.saveState(),this.render())}),o.addEventListener("click",()=>{this.resetAllData()}),u.addEventListener("click",()=>{const d=j(this.state),g=`kudos-class-${this.state.className.toLowerCase().replace(/\s+/g,"-")}-${new Date().toISOString().split("T")[0]}.json`;U(d,g)}),f.addEventListener("change",d=>{const g=d.target.files?.[0];if(g){const h=new FileReader;h.onload=y=>{try{const T=JSON.parse(y.target?.result),S=P(T);S?confirm(r("setup.importExport.importConfirm",this.currentLocale))&&(this.state.className=S.className,this.state.students=b(S.students),this.state.rules=S.rules||[],this.saveState(),this.render()):alert(r("setup.importExport.importError",this.currentLocale))}catch{alert(r("setup.importExport.importReadError",this.currentLocale))}},h.readAsText(g)}}),this.updateSaveButtonState()}attachAwardingModeListeners(){document.getElementById("back-to-setup-btn").addEventListener("click",()=>{this.state.mode="setup",this.saveState(),this.render()});const s=document.getElementById("toggle-mobile-rules-btn"),t=document.getElementById("mobile-rules-content"),a=document.getElementById("mobile-rules-chevron");s&&t&&a&&s.addEventListener("click",()=>{t.classList.contains("hidden")?(t.classList.remove("hidden"),t.style.display="block",a.style.transform="rotate(180deg)",s.setAttribute("aria-expanded","true"),requestAnimationFrame(()=>{t.style.opacity="0",t.style.transform="translateY(-10px)",t.style.transition="opacity 0.2s ease-out, transform 0.2s ease-out",requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="translateY(0)"})})):(t.style.transition="opacity 0.2s ease-in, transform 0.2s ease-in",t.style.opacity="0",t.style.transform="translateY(-10px)",a.style.transform="rotate(0deg)",s.setAttribute("aria-expanded","false"),setTimeout(()=>{t.classList.add("hidden"),t.style.display="none"},200))}),document.querySelectorAll(".student-card").forEach(i=>{const c=i.dataset.studentId,l=()=>{const o=this.state.students.find(u=>u.id===c);o&&o.stars<5&&(o.stars++,this.saveState(),this.updateStudentCard(c,o))},p=()=>{const o=this.state.students.find(u=>u.id===c);o&&o.stars>0&&(o.stars--,this.saveState(),this.updateStudentCard(c,o))};i.addEventListener("click",o=>{const u=o.target;!u.classList.contains("hover-control")&&!u.closest(".hover-control")&&l()}),i.addEventListener("contextmenu",o=>{o.preventDefault(),p()}),i.addEventListener("keydown",o=>{const u=o;u.key==="Enter"||u.key===" "?(u.preventDefault(),l()):(u.key==="Backspace"||u.key==="Delete")&&(u.preventDefault(),p())})}),document.querySelectorAll(".add-star-btn").forEach(i=>{i.addEventListener("click",c=>{c.stopPropagation();const l=i.dataset.studentId,p=this.state.students.find(o=>o.id===l);p&&p.stars<5&&(p.stars++,this.saveState(),this.updateStudentCard(l,p))})}),document.querySelectorAll(".remove-star-btn").forEach(i=>{i.addEventListener("click",c=>{c.stopPropagation();const l=i.dataset.studentId,p=this.state.students.find(o=>o.id===l);p&&p.stars>0&&(p.stars--,this.saveState(),this.updateStudentCard(l,p))})})}updateStudentCard(e,s){const t=document.querySelector(`[data-student-id="${e}"]`);if(t){const p="⭐".repeat(s.stars)+"☆".repeat(5-s.stars),o=t.querySelector('[aria-hidden="true"]'),u=t.querySelector(".text-center .text-sm"),f=r("awarding.studentCard.stars",this.currentLocale);o&&(o.textContent=p),u&&(u.textContent=`${s.stars}/5 ${f}`),t.setAttribute("aria-label",`${s.name} ${s.stars} ${r("awarding.studentCard.ariaLabel",this.currentLocale)}`);const m=t.querySelector(".add-star-btn"),v=t.querySelector(".remove-star-btn");m&&(m.disabled=s.stars>=5,m.style.opacity=s.stars>=5?"0.5":"1"),v&&(v.disabled=s.stars<=0,v.style.opacity=s.stars<=0?"0.5":"1"),t.classList.add("scale-105","ring-2","ring-yellow-300"),setTimeout(()=>{t.classList.remove("scale-105","ring-2","ring-yellow-300")},200)}const a=this.state.students.reduce((p,o)=>p+o.stars,0),i=this.state.students.length,c=i!==1?r("awarding.stats.students",this.currentLocale):r("awarding.stats.student",this.currentLocale),l=document.querySelector(".text-gray-600");l&&(l.innerHTML=`<span>${i} ${c}</span><span>⭐ ${a} ${r("awarding.stats.totalStars",this.currentLocale)}</span>`)}updateStudentList(){const e=document.getElementById("student-list");e&&(e.innerHTML=this.renderStudentList())}updateRulesLists(){const e=document.getElementById("positive-rules-list"),s=document.getElementById("negative-rules-list");e&&(e.innerHTML=this.renderPositiveRulesList()),s&&(s.innerHTML=this.renderNegativeRulesList())}updateSaveButtonState(){const e=document.getElementById("save-and-start-btn"),s=document.getElementById("export-btn"),t=this.validateSetupForm();e&&(e.disabled=!t),s&&(s.disabled=this.state.students.length===0)}validateSetupForm(){return this.state.className.trim().length>0&&this.state.students.length>0}showConfirmationDialog(e,s=r("setup.reset.confirmButton",this.currentLocale)){return new Promise(t=>{const a=document.createElement("div");a.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",a.id="confirmation-overlay",a.innerHTML=`
				<div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform scale-95 opacity-0 transition-all duration-200" id="confirmation-modal">
					<div class="text-center mb-6">
						<div class="text-red-500 text-4xl mb-3">⚠️</div>
						<h3 class="text-lg font-semibold text-gray-800 mb-2">${r("setup.reset.confirmTitle",this.currentLocale)}</h3>
						<p class="text-gray-600">${e}</p>
					</div>
					<div class="flex gap-3">
						<button
							id="confirm-cancel-btn"
							class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
						>
							${r("setup.reset.cancelButton",this.currentLocale)}
						</button>
						<button
							id="confirm-yes-btn"
							class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
						>
							${s}
						</button>
					</div>
				</div>
			`,document.body.appendChild(a);const i=a.querySelector("#confirmation-modal");requestAnimationFrame(()=>{a.style.opacity="1",i.style.transform="scale(1)",i.style.opacity="1"});const c=l=>{a.style.opacity="0",i.style.transform="scale(0.95)",i.style.opacity="0",setTimeout(()=>{document.body.removeChild(a),t(l)},200)};a.querySelector("#confirm-cancel-btn")?.addEventListener("click",()=>c(!1)),a.querySelector("#confirm-yes-btn")?.addEventListener("click",()=>c(!0)),a.addEventListener("click",l=>{l.target===a&&c(!1)}),a.addEventListener("keydown",l=>{l.key==="Escape"&&c(!1)})})}async resetAllData(){await this.showConfirmationDialog(r("setup.reset.confirmMessage",this.currentLocale),r("setup.reset.confirmButton",this.currentLocale))&&(this.state={...E},this.saveState(),this.showSuccessMessage(r("setup.reset.successMessage",this.currentLocale)),this.render())}showSuccessMessage(e){const s=document.createElement("div");s.className="fixed top-4 right-4 z-50 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg transform translate-x-full opacity-0 transition-all duration-300",s.innerHTML=`
			<div class="flex items-center">
				<span class="text-xl mr-3">✅</span>
				<span class="font-medium">${e}</span>
			</div>
		`,document.body.appendChild(s),requestAnimationFrame(()=>{s.style.transform="translateX(0)",s.style.opacity="1"}),setTimeout(()=>{s.style.transform="translateX(full)",s.style.opacity="0",setTimeout(()=>{s.parentNode&&document.body.removeChild(s)},300)},3e3)}saveState(){this.state.students=b(this.state.students),M(this.state)}escapeHtml(e){const s=document.createElement("div");return s.textContent=e,s.innerHTML}}document.addEventListener("DOMContentLoaded",()=>{new G});

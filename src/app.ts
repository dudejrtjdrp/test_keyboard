import { wordLists } from './words';

interface KeyStats {
    currentCount: number;
    recordCount: number;
    totalPresses: number;
}

interface LogEntry {
    key: string;
    code: string;
    type: 'press' | 'release';
    timestamp: number;
    duration?: number;
    order: number;
}

interface KeyboardKey {
    code: string;
    label: string;
    korean?: string;
    className?: string;
}

interface Translations {
    [key: string]: {
        ko: string;
        en: string;
    };
}

class KeyboardTester {
    private pressedKeys: Map<string, number> = new Map();
    private stats: KeyStats = {
        currentCount: 0,
        recordCount: 0,
        totalPresses: 0
    };
    private logs: LogEntry[] = [];
    private keyElements: Map<string, HTMLElement> = new Map();
    private mouseElements: Map<number, HTMLElement> = new Map();
    private pressOrder: number = 0;
    private currentLanguage: 'ko' | 'en' = 'ko';
    private currentOS: 'windows' | 'mac' = 'windows';
    
    private keyboardElement: HTMLElement;
    private logListElement: HTMLElement;
    private resetBtn: HTMLElement;
    private languageBtn: HTMLElement;
    private osBtn: HTMLElement;
    private mouseButtonsElement: HTMLElement;

    private instructionElement: HTMLElement;
    private gameBtn: HTMLElement;
    private reactionGame: HTMLElement;
    private gameInput: HTMLInputElement;
    private gameWord: HTMLElement;
    private gameWordContainer: HTMLElement;
    private gameTimer: HTMLElement;
    private gameResults: HTMLElement;

    private gameActive: boolean = false;
    private gameMode: boolean = false;
    private currentWordIndex: number = 0;
    private gameWords: string[] = [];
    private wordStartTime: number = 0;
    private reactionTimes: number[] = [];
    private isWaitingForNext: boolean = false;
    private timerInterval: number | null = null;

    private translations: Translations = {
        mainTitle: {
            ko: '⌨️ 키보드 동시입력 테스트',
            en: '⌨️ Keyboard Multi-Input Test'
        },
        subtitle: {
            ko: '여러 키를 동시에 눌러보세요!',
            en: 'Press multiple keys simultaneously!'
        },
        currentKeys: {
            ko: '현재 누른 키',
            en: 'Current Keys'
        },
        recordKeys: {
            ko: '최대 기록',
            en: 'Max Record'
        },
        totalPresses: {
            ko: '총 누른 횟수',
            en: 'Total Presses'
        },
        keyPressed: {
            ko: '눌림',
            en: 'Pressed'
        },
        keyReleased: {
            ko: '뗌',
            en: 'Released'
        },
        duration: {
            ko: '유지 시간',
            en: 'Duration'
        },
        order: {
            ko: '순서',
            en: 'Order'
        },
        noLogs: {
            ko: '아직 기록이 없습니다',
            en: 'No logs yet'
        },
        reset: {
            ko: '🔄 기록 초기화',
            en: '🔄 Reset Records'
        },
        language: {
            ko: '🌐 English',
            en: '🌐 한국어'
        },
        confirmReset: {
            ko: '정말로 모든 기록을 초기화하시겠습니까?',
            en: 'Are you sure you want to reset all records?'
        },
        instruction: {
            ko: '키보드를 눌러보세요!',
            en: 'Press any keys!'
        },
        logTitle: {
            ko: '입력 로그',
            en: 'Input Log'
        },
        mouseTitle: {
            ko: '마우스 버튼 테스트',
            en: 'Mouse Button Test'
        },
        resetButton: {
            ko: '🔄 기록 초기화',
            en: '🔄 Reset Records'
        },
        gameBtnStart: {
            ko: '⚡ 반응속도 테스트',
            en: '⚡ Reaction Test'
        },
        gameBtnEnd: {
            ko: '❌ 테스트 종료',
            en: '❌ End Test'
        },
        gameTitle: {
            ko: '⚡ 반응속도 테스트',
            en: '⚡ Reaction Test'
        },
        gameInstructions: {
            ko: '단어가 나타나면 빠르게 입력하세요!',
            en: 'Type the word as fast as you can!'
        },
        startButtonText: {
            ko: '시작하기',
            en: 'Start'
        },
        resultsTitle: {
            ko: '결과',
            en: 'Results'
        },
        avgTimeLabel: {
            ko: '평균 반응 시간:',
            en: 'Average Time:'
        },
        fastestLabel: {
            ko: '최고 기록:',
            en: 'Fastest:'
        },
        slowestLabel: {
            ko: '최저 기록:',
            en: 'Slowest:'
        },
        progressText: {
            ko: '진행도',
            en: 'Progress'
        },
        ready: {
            ko: '준비...',
            en: 'Ready...'
        }
    };

    private windowsLayout: KeyboardKey[][] = [
        [
            { code: 'Escape', label: 'Esc' },
            { code: 'F1', label: 'F1' },
            { code: 'F2', label: 'F2' },
            { code: 'F3', label: 'F3' },
            { code: 'F4', label: 'F4' },
            { code: 'F5', label: 'F5' },
            { code: 'F6', label: 'F6' },
            { code: 'F7', label: 'F7' },
            { code: 'F8', label: 'F8' },
            { code: 'F9', label: 'F9' },
            { code: 'F10', label: 'F10' },
            { code: 'F11', label: 'F11' },
            { code: 'F12', label: 'F12' }
        ],
        [
            { code: 'Backquote', label: '`' },
            { code: 'Digit1', label: '1' },
            { code: 'Digit2', label: '2' },
            { code: 'Digit3', label: '3' },
            { code: 'Digit4', label: '4' },
            { code: 'Digit5', label: '5' },
            { code: 'Digit6', label: '6' },
            { code: 'Digit7', label: '7' },
            { code: 'Digit8', label: '8' },
            { code: 'Digit9', label: '9' },
            { code: 'Digit0', label: '0' },
            { code: 'Minus', label: '-' },
            { code: 'Equal', label: '=' },
            { code: 'Backspace', label: '⌫', className: 'backspace' }
        ],
        [
            { code: 'Tab', label: '⇥', className: 'tab' },
            { code: 'KeyQ', label: 'Q', korean: 'ㅂ' },
            { code: 'KeyW', label: 'W', korean: 'ㅈ' },
            { code: 'KeyE', label: 'E', korean: 'ㄷ' },
            { code: 'KeyR', label: 'R', korean: 'ㄱ' },
            { code: 'KeyT', label: 'T', korean: 'ㅅ' },
            { code: 'KeyY', label: 'Y', korean: 'ㅛ' },
            { code: 'KeyU', label: 'U', korean: 'ㅕ' },
            { code: 'KeyI', label: 'I', korean: 'ㅑ' },
            { code: 'KeyO', label: 'O', korean: 'ㅐ' },
            { code: 'KeyP', label: 'P', korean: 'ㅔ' },
            { code: 'BracketLeft', label: '[' },
            { code: 'BracketRight', label: ']' },
            { code: 'Backslash', label: '\\' }
        ],
        [
            { code: 'CapsLock', label: 'Caps', className: 'caps' },
            { code: 'KeyA', label: 'A', korean: 'ㅁ' },
            { code: 'KeyS', label: 'S', korean: 'ㄴ' },
            { code: 'KeyD', label: 'D', korean: 'ㅇ' },
            { code: 'KeyF', label: 'F', korean: 'ㄹ' },
            { code: 'KeyG', label: 'G', korean: 'ㅎ' },
            { code: 'KeyH', label: 'H', korean: 'ㅗ' },
            { code: 'KeyJ', label: 'J', korean: 'ㅓ' },
            { code: 'KeyK', label: 'K', korean: 'ㅏ' },
            { code: 'KeyL', label: 'L', korean: 'ㅣ' },
            { code: 'Semicolon', label: ';' },
            { code: 'Quote', label: '\'' },
            { code: 'Enter', label: '⏎', className: 'enter' }
        ],
        [
            { code: 'ShiftLeft', label: '⇧ Shift', className: 'shift-left' },
            { code: 'KeyZ', label: 'Z', korean: 'ㅋ' },
            { code: 'KeyX', label: 'X', korean: 'ㅌ' },
            { code: 'KeyC', label: 'C', korean: 'ㅊ' },
            { code: 'KeyV', label: 'V', korean: 'ㅍ' },
            { code: 'KeyB', label: 'B', korean: 'ㅠ' },
            { code: 'KeyN', label: 'N', korean: 'ㅜ' },
            { code: 'KeyM', label: 'M', korean: 'ㅡ' },
            { code: 'Comma', label: ',' },
            { code: 'Period', label: '.' },
            { code: 'Slash', label: '/' },
            { code: 'ShiftRight', label: 'Shift ⇧', className: 'shift-right' }
        ],
        [
            { code: 'ControlLeft', label: 'Ctrl', className: 'ctrl-left' },
            { code: 'MetaLeft', label: '⊞' },
            { code: 'AltLeft', label: 'Alt' },
            { code: 'Space', label: 'Space', className: 'space' },
            { code: 'AltRight', label: 'Alt' },
            { code: 'MetaRight', label: '⊞' },
            { code: 'ControlRight', label: 'Ctrl' }
        ]
    ];

    private macLayout: KeyboardKey[][] = [
        [
            { code: 'Escape', label: 'Esc' },
            { code: 'F1', label: 'F1' },
            { code: 'F2', label: 'F2' },
            { code: 'F3', label: 'F3' },
            { code: 'F4', label: 'F4' },
            { code: 'F5', label: 'F5' },
            { code: 'F6', label: 'F6' },
            { code: 'F7', label: 'F7' },
            { code: 'F8', label: 'F8' },
            { code: 'F9', label: 'F9' },
            { code: 'F10', label: 'F10' },
            { code: 'F11', label: 'F11' },
            { code: 'F12', label: 'F12' }
        ],
        [
            { code: 'Backquote', label: '`' },
            { code: 'Digit1', label: '1' },
            { code: 'Digit2', label: '2' },
            { code: 'Digit3', label: '3' },
            { code: 'Digit4', label: '4' },
            { code: 'Digit5', label: '5' },
            { code: 'Digit6', label: '6' },
            { code: 'Digit7', label: '7' },
            { code: 'Digit8', label: '8' },
            { code: 'Digit9', label: '9' },
            { code: 'Digit0', label: '0' },
            { code: 'Minus', label: '-' },
            { code: 'Equal', label: '=' },
            { code: 'Backspace', label: '⌫', className: 'backspace' }
        ],
        [
            { code: 'Tab', label: '⇥', className: 'tab' },
            { code: 'KeyQ', label: 'Q', korean: 'ㅂ' },
            { code: 'KeyW', label: 'W', korean: 'ㅈ' },
            { code: 'KeyE', label: 'E', korean: 'ㄷ' },
            { code: 'KeyR', label: 'R', korean: 'ㄱ' },
            { code: 'KeyT', label: 'T', korean: 'ㅅ' },
            { code: 'KeyY', label: 'Y', korean: 'ㅛ' },
            { code: 'KeyU', label: 'U', korean: 'ㅕ' },
            { code: 'KeyI', label: 'I', korean: 'ㅑ' },
            { code: 'KeyO', label: 'O', korean: 'ㅐ' },
            { code: 'KeyP', label: 'P', korean: 'ㅔ' },
            { code: 'BracketLeft', label: '[' },
            { code: 'BracketRight', label: ']' },
            { code: 'Backslash', label: '\\' }
        ],
        [
            { code: 'CapsLock', label: 'Caps', className: 'caps' },
            { code: 'KeyA', label: 'A', korean: 'ㅁ' },
            { code: 'KeyS', label: 'S', korean: 'ㄴ' },
            { code: 'KeyD', label: 'D', korean: 'ㅇ' },
            { code: 'KeyF', label: 'F', korean: 'ㄹ' },
            { code: 'KeyG', label: 'G', korean: 'ㅎ' },
            { code: 'KeyH', label: 'H', korean: 'ㅗ' },
            { code: 'KeyJ', label: 'J', korean: 'ㅓ' },
            { code: 'KeyK', label: 'K', korean: 'ㅏ' },
            { code: 'KeyL', label: 'L', korean: 'ㅣ' },
            { code: 'Semicolon', label: ';' },
            { code: 'Quote', label: '\'' },
            { code: 'Enter', label: '⏎', className: 'enter' }
        ],
        [
            { code: 'ShiftLeft', label: '⇧ Shift', className: 'shift-left' },
            { code: 'KeyZ', label: 'Z', korean: 'ㅋ' },
            { code: 'KeyX', label: 'X', korean: 'ㅌ' },
            { code: 'KeyC', label: 'C', korean: 'ㅊ' },
            { code: 'KeyV', label: 'V', korean: 'ㅍ' },
            { code: 'KeyB', label: 'B', korean: 'ㅠ' },
            { code: 'KeyN', label: 'N', korean: 'ㅜ' },
            { code: 'KeyM', label: 'M', korean: 'ㅡ' },
            { code: 'Comma', label: ',' },
            { code: 'Period', label: '.' },
            { code: 'Slash', label: '/' },
            { code: 'ShiftRight', label: 'Shift ⇧', className: 'shift-right' }
        ],
        [
            { code: 'ControlLeft', label: 'Ctrl' },
            { code: 'AltLeft', label: '⌥' },
            { code: 'MetaLeft', label: '⌘', className: 'ctrl-left' },
            { code: 'Space', label: 'Space', className: 'space' },
            { code: 'MetaRight', label: '⌘' },
            { code: 'AltRight', label: '⌥' },
            { code: 'ControlRight', label: 'Ctrl' }
        ]
    ];

    constructor() {
        this.keyboardElement = document.getElementById('keyboard')!;
        this.logListElement = document.getElementById('logList')!;
        this.resetBtn = document.getElementById('resetBtn')!;
        this.languageBtn = document.getElementById('languageBtn')!;
        this.osBtn = document.getElementById('osBtn')!;
        this.mouseButtonsElement = document.getElementById('mouseButtons')!;

        this.instructionElement = document.getElementById('instruction')!;
        this.gameBtn = document.getElementById('gameBtn')!;
        this.reactionGame = document.getElementById('reactionGame')!;
        this.gameInput = document.getElementById('gameInput') as HTMLInputElement;
        this.gameWord = document.getElementById('gameWord')!;
        this.gameWordContainer = document.querySelector('.game-word-container')!;
        this.gameTimer = document.getElementById('gameTimer')!;
        this.gameResults = document.getElementById('gameResults')!;

        this.loadStats();
        this.loadLanguage();
        this.loadOS();
        this.createKeyboard();
        this.initMouseButtons();
        this.initEventListeners();
        this.updateDisplay();
        this.updateLanguage();
        this.updateOSButton();
    }

    private createKeyboard(): void {
        this.keyboardElement.innerHTML = '';
        this.keyElements.clear();
        
        const layout = this.currentOS === 'windows' ? this.windowsLayout : this.macLayout;
        
        layout.forEach(row => {
            const rowElement = document.createElement('div');
            rowElement.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyElement = document.createElement('div');
                keyElement.className = `key ${key.className || ''}`;
                
                if (key.korean) {
                    const englishSpan = document.createElement('span');
                    englishSpan.className = 'key-english';
                    englishSpan.textContent = key.label;
                    
                    const koreanSpan = document.createElement('span');
                    koreanSpan.className = 'key-korean';
                    koreanSpan.textContent = key.korean;
                    
                    keyElement.appendChild(englishSpan);
                    keyElement.appendChild(koreanSpan);
                } else {
                    keyElement.textContent = key.label;
                }
                
                keyElement.dataset.code = key.code;
                
                this.keyElements.set(key.code, keyElement);
                rowElement.appendChild(keyElement);
            });
            
            this.keyboardElement.appendChild(rowElement);
        });
    }

    private initMouseButtons(): void {
        const buttons = this.mouseButtonsElement.querySelectorAll('.mouse-button');
        buttons.forEach((button) => {
            const btnNumber = parseInt((button as HTMLElement).dataset.button || '0');
            this.mouseElements.set(btnNumber, button as HTMLElement);
        });
    }

    private initEventListeners(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e: KeyboardEvent) => this.handleKeyUp(e));
        document.addEventListener('mousedown', (e: MouseEvent) => this.handleMouseDown(e));
        document.addEventListener('mouseup', (e: MouseEvent) => this.handleMouseUp(e));
        document.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());
        
        this.resetBtn.addEventListener('click', () => this.resetStats());
        this.languageBtn.addEventListener('click', () => this.toggleLanguage());
        this.osBtn.addEventListener('click', () => this.toggleOS());
        
        this.gameBtn.addEventListener('click', () => this.toggleGame());
        this.gameInput.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleEnterKey();
            }
        });
        
        window.addEventListener('blur', () => this.clearAllKeys());
    }

    private isBlockedShortcut(e: KeyboardEvent): boolean {
        if (e.ctrlKey && (e.code === 'KeyW' || e.code === 'KeyT' || e.code === 'KeyN' || e.code === 'KeyR')) {
            return true;
        }
        if (e.altKey && e.code === 'F4') {
            return true;
        }
        if (e.code === 'F5' || (e.ctrlKey && e.code === 'F5')) {
            return true;
        }
        if (e.code.startsWith('F') && e.code.length <= 3) {
            return true;
        }
        return false;
    }

    private handleKeyDown(e: KeyboardEvent): void {
        if (this.isBlockedShortcut(e)) {
            e.preventDefault();
        }

        const code = e.code;
        
        if (!this.pressedKeys.has(code)) {
            const timestamp = Date.now();
            this.pressedKeys.set(code, timestamp);
            this.stats.currentCount = this.pressedKeys.size;
            this.stats.totalPresses++;
            this.pressOrder++;
            
            const keyLabel = this.keyElements.get(code)?.textContent || code;
            this.addLog({
                key: keyLabel,
                code: code,
                type: 'press',
                timestamp: timestamp,
                order: this.pressOrder
            });
            
            const keyElement = this.keyElements.get(code);
            if (keyElement) {
                keyElement.classList.remove('pressed-trail');
                keyElement.classList.add('pressed');
            }
            
            if (this.stats.currentCount > this.stats.recordCount) {
                this.stats.recordCount = this.stats.currentCount;
                const recordElement = document.getElementById('recordKeys');
                if (recordElement) {
                    recordElement.classList.add('new-record');
                    setTimeout(() => {
                        recordElement.classList.remove('new-record');
                    }, 600);
                }
                this.saveStats();
            }
            
            this.updateDisplay();
        }
    }

    private handleKeyUp(e: KeyboardEvent): void {
        const code = e.code;
        
        if (this.pressedKeys.has(code)) {
            const pressTime = this.pressedKeys.get(code)!;
            const releaseTime = Date.now();
            const duration = releaseTime - pressTime;
            
            const keyLabel = this.keyElements.get(code)?.textContent || code;
            this.addLog({
                key: keyLabel,
                code: code,
                type: 'release',
                timestamp: releaseTime,
                duration: duration,
                order: this.pressOrder
            });
            
            this.pressedKeys.delete(code);
            this.stats.currentCount = this.pressedKeys.size;
            
            const keyElement = this.keyElements.get(code);
            if (keyElement) {
                keyElement.classList.remove('pressed');
                keyElement.classList.add('pressed-trail');
                
                setTimeout(() => {
                    keyElement.classList.remove('pressed-trail');
                }, 2000);
            }
            
            this.updateDisplay();
            this.saveStats();
        }
    }

    private handleMouseDown(e: MouseEvent): void {
        const button = e.button;
        const buttonLabels = this.currentLanguage === 'ko' 
            ? ['좌클릭', '휠클릭', '우클릭'] 
            : ['Left', 'Middle', 'Right'];
        const buttonName = buttonLabels[button] || `Button${button}`;
        
        if (!this.pressedKeys.has(`Mouse${button}`)) {
            const timestamp = Date.now();
            this.pressedKeys.set(`Mouse${button}`, timestamp);
            this.stats.currentCount = this.pressedKeys.size;
            this.stats.totalPresses++;
            this.pressOrder++;
            
            this.addLog({
                key: buttonName,
                code: `Mouse${button}`,
                type: 'press',
                timestamp: timestamp,
                order: this.pressOrder
            });
            
            const mouseElement = this.mouseElements.get(button);
            if (mouseElement) {
                mouseElement.classList.remove('pressed-trail');
                mouseElement.classList.add('pressed');
            }
            
            if (this.stats.currentCount > this.stats.recordCount) {
                this.stats.recordCount = this.stats.currentCount;
                const recordElement = document.getElementById('recordKeys');
                if (recordElement) {
                    recordElement.classList.add('new-record');
                    setTimeout(() => {
                        recordElement.classList.remove('new-record');
                    }, 600);
                }
                this.saveStats();
            }
            
            this.updateDisplay();
        }
    }

    private handleMouseUp(e: MouseEvent): void {
        const button = e.button;
        const buttonLabels = this.currentLanguage === 'ko' 
            ? ['좌클릭', '휠클릭', '우클릭'] 
            : ['Left', 'Middle', 'Right'];
        const buttonName = buttonLabels[button] || `Button${button}`;
        const mouseKey = `Mouse${button}`;
        
        if (this.pressedKeys.has(mouseKey)) {
            const pressTime = this.pressedKeys.get(mouseKey)!;
            const releaseTime = Date.now();
            const duration = releaseTime - pressTime;
            
            this.addLog({
                key: buttonName,
                code: mouseKey,
                type: 'release',
                timestamp: releaseTime,
                duration: duration,
                order: this.pressOrder
            });
            
            this.pressedKeys.delete(mouseKey);
            this.stats.currentCount = this.pressedKeys.size;
            
            const mouseElement = this.mouseElements.get(button);
            if (mouseElement) {
                mouseElement.classList.remove('pressed');
                mouseElement.classList.add('pressed-trail');
                
                setTimeout(() => {
                    mouseElement.classList.remove('pressed-trail');
                }, 2000);
            }
            
            this.updateDisplay();
            this.saveStats();
        }
    }

    private clearAllKeys(): void {
        this.keyElements.forEach((keyElement) => {
            keyElement.classList.remove('pressed');
            keyElement.classList.remove('pressed-trail');
        });
        this.mouseElements.forEach((mouseElement) => {
            mouseElement.classList.remove('pressed');
            mouseElement.classList.remove('pressed-trail');
        });
        this.pressedKeys.clear();
        this.stats.currentCount = 0;
        this.updateDisplay();
    }

    private updateDisplay(): void {
        const currentKeysElement = document.getElementById('currentKeys');
        const recordKeysElement = document.getElementById('recordKeys');
        const totalPressesElement = document.getElementById('totalPresses');
        
        if (currentKeysElement) {
            currentKeysElement.textContent = this.stats.currentCount.toString();
        }
        if (recordKeysElement) {
            recordKeysElement.textContent = this.stats.recordCount.toString();
        }
        if (totalPressesElement) {
            totalPressesElement.textContent = this.stats.totalPresses.toString();
        }
        
        this.updateLogs();
    }

    private addLog(entry: LogEntry): void {
        this.logs.unshift(entry);
        if (this.logs.length > 50) {
            this.logs.pop();
        }
        this.updateLogs();
    }

    private updateLogs(): void {
        this.logListElement.innerHTML = '';
        
        if (this.logs.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.opacity = '0.5';
            emptyMsg.textContent = this.translations.noLogs[this.currentLanguage];
            this.logListElement.appendChild(emptyMsg);
            return;
        }

        this.logs.forEach(entry => {
            const logItem = document.createElement('div');
            logItem.className = `log-item ${entry.type}`;
            
            const logHeader = document.createElement('div');
            logHeader.className = 'log-header';
            
            const keySpan = document.createElement('span');
            keySpan.className = 'log-key';
            const actionText = entry.type === 'press' 
                ? this.translations.keyPressed[this.currentLanguage]
                : this.translations.keyReleased[this.currentLanguage];
            keySpan.textContent = `${entry.key} - ${actionText}`;
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'log-time';
            timeSpan.textContent = this.formatTimestamp(entry.timestamp);
            
            logHeader.appendChild(keySpan);
            logHeader.appendChild(timeSpan);
            
            const logDetails = document.createElement('div');
            logDetails.className = 'log-details';
            
            if (entry.duration !== undefined) {
                const durationDetail = document.createElement('span');
                durationDetail.className = 'log-detail';
                durationDetail.innerHTML = `⏱ ${this.translations.duration[this.currentLanguage]}: ${entry.duration}ms`;
                logDetails.appendChild(durationDetail);
            }
            
            const orderDetail = document.createElement('span');
            orderDetail.className = 'log-detail';
            orderDetail.innerHTML = `#${this.translations.order[this.currentLanguage]}: ${entry.order}`;
            logDetails.appendChild(orderDetail);
            
            logItem.appendChild(logHeader);
            if (logDetails.children.length > 0) {
                logItem.appendChild(logDetails);
            }
            
            this.logListElement.appendChild(logItem);
        });
    }

    private formatTimestamp(timestamp: number): string {
        const date = new Date(timestamp);
        const timeString = date.toLocaleTimeString(this.currentLanguage === 'ko' ? 'ko-KR' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const ms = date.getMilliseconds().toString().padStart(3, '0');
        return `${timeString}.${ms}`;
    }

    private toggleLanguage(): void {
        this.currentLanguage = this.currentLanguage === 'ko' ? 'en' : 'ko';
        this.saveLanguage();
        this.updateLanguage();
        this.updateLogs();
        this.updateGameUI();
        this.updateGameButton();
    }

    private toggleOS(): void {
        this.currentOS = this.currentOS === 'windows' ? 'mac' : 'windows';
        this.saveOS();
        this.createKeyboard();
        this.updateOSButton();
    }

    private updateOSButton(): void {
        if (this.currentOS === 'windows') {
            this.osBtn.textContent = '🪟 Windows';
        } else {
            this.osBtn.textContent = '🍎 Mac';
        }
    }

    private updateLanguage(): void {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key && this.translations[key]) {
                element.textContent = this.translations[key][this.currentLanguage];
            }
        });

        const mainTitle = document.getElementById('mainTitle');
        const subtitle = document.getElementById('subtitle');
        const currentLabel = document.getElementById('currentLabel');
        const recordLabel = document.getElementById('recordLabel');
        const totalLabel = document.getElementById('totalLabel');
        const logTitle = document.getElementById('logTitle');
        const mouseTitle = document.getElementById('mouseTitle');
        const resetBtn = document.getElementById('resetBtn');
        
        if (mainTitle) {
            mainTitle.textContent = this.translations.mainTitle[this.currentLanguage];
        }
        if (subtitle) {
            subtitle.textContent = this.translations.subtitle[this.currentLanguage];
        }
        if (currentLabel) {
            currentLabel.textContent = this.translations.currentKeys[this.currentLanguage];
        }
        if (recordLabel) {
            recordLabel.textContent = this.translations.recordKeys[this.currentLanguage];
        }
        if (totalLabel) {
            totalLabel.textContent = this.translations.totalPresses[this.currentLanguage];
        }
        if (logTitle) {
            logTitle.textContent = (this.currentLanguage === 'ko' ? '📝 입력 기록' : '📝 Input Log');
        }
        if (mouseTitle) {
            mouseTitle.textContent = (this.currentLanguage === 'ko' ? '🖱️ 마우스 버튼 테스트' : '🖱️ Mouse Button Test');
        }
        if (resetBtn) {
            resetBtn.textContent = this.translations.reset[this.currentLanguage];
        }

        const mouseButtons = this.mouseButtonsElement.querySelectorAll('.mouse-button');
        const mouseLabels = this.currentLanguage === 'ko' 
            ? ['좌클릭', '휠클릭', '우클릭'] 
            : ['Left', 'Middle', 'Right'];
        
        mouseButtons.forEach((btn, index) => {
            btn.textContent = mouseLabels[index];
        });

        this.languageBtn.textContent = this.translations.language[this.currentLanguage];
    }

    private resetStats(): void {
        if (confirm(this.translations.confirmReset[this.currentLanguage])) {
            this.stats = {
                currentCount: 0,
                recordCount: 0,
                totalPresses: 0
            };
            this.logs = [];
            this.pressOrder = 0;
            this.clearAllKeys();
            this.saveStats();
            this.updateDisplay();
        }
    }

    private saveStats(): void {
        localStorage.setItem('keyboardTestStats', JSON.stringify(this.stats));
    }

    private loadStats(): void {
        const saved = localStorage.getItem('keyboardTestStats');
        if (saved) {
            this.stats = JSON.parse(saved);
            this.stats.currentCount = 0;
        }
    }

    private saveLanguage(): void {
        localStorage.setItem('keyboardTestLanguage', this.currentLanguage);
    }

    private loadLanguage(): void {
        const saved = localStorage.getItem('keyboardTestLanguage');
        if (saved === 'ko' || saved === 'en') {
            this.currentLanguage = saved;
        }
    }

    private saveOS(): void {
        localStorage.setItem('keyboardTestOS', this.currentOS);
    }

    private loadOS(): void {
        const saved = localStorage.getItem('keyboardTestOS');
        if (saved === 'windows' || saved === 'mac') {
            this.currentOS = saved;
        }
    }

    private toggleGame(): void {
        if (!this.gameMode) {
            this.startGame();
        } else {
            this.endGame();
        }
    }

    private startGame(): void {
        this.gameMode = true;
        this.gameActive = true;
        this.currentWordIndex = 0;
        this.reactionTimes = [];
        
        this.instructionElement.style.display = 'none';
        this.reactionGame.style.display = 'block';
        this.gameResults.style.display = 'none';
        this.gameWordContainer.style.display = 'flex';
        
        const wordList = wordLists[this.currentLanguage];
        const shuffled = [...wordList].sort(() => Math.random() - 0.5);
        this.gameWords = shuffled.slice(0, 5);
        
        this.gameInput.disabled = false;
        this.gameInput.value = '';
        this.gameInput.focus();
        
        this.updateGameButton();
        this.showNextWord();
    }

    private endGame(): void {
        this.gameMode = false;
        this.gameActive = false;
        this.gameInput.disabled = true;
        this.stopTimer();
        this.gameTimer.style.visibility = 'hidden';
        
        this.instructionElement.style.display = 'flex';
        this.reactionGame.style.display = 'none';
        
        this.currentWordIndex = 0;
        this.gameWords = [];
        this.reactionTimes = [];
        this.gameInput.value = '';
        this.gameWord.textContent = '';
        this.gameResults.style.display = 'none';
        
        this.updateGameButton();
    }

    private updateGameButton(): void {
        const btnText = document.getElementById('gameBtnText')!;
        if (this.gameMode) {
            btnText.textContent = this.translations.gameBtnEnd[this.currentLanguage];
        } else {
            btnText.textContent = this.translations.gameBtnStart[this.currentLanguage];
        }
    }

    private showNextWord(): void {
        if (this.currentWordIndex >= this.gameWords.length) {
            this.showResults();
            return;
        }

        this.stopTimer();
        this.gameTimer.textContent = '0.000s';
        this.gameTimer.style.visibility = 'hidden';
        this.gameWord.textContent = this.translations.ready[this.currentLanguage];
        this.gameWordContainer.classList.add('preparing');
        this.gameInput.value = '';
        this.gameInput.classList.remove('correct', 'wrong');
        this.gameInput.disabled = true;
        this.isWaitingForNext = false;
        this.updateGameProgress();
        
        const randomDelay = 500 + Math.random() * 1500;
        
        setTimeout(() => {
            if (!this.gameActive) return;
            
            this.gameWord.textContent = this.gameWords[this.currentWordIndex];
            this.gameWordContainer.classList.remove('preparing');
            this.gameInput.disabled = false;
            this.gameInput.focus();
            this.wordStartTime = Date.now();
            this.startTimer();
        }, randomDelay);
    }

    private handleEnterKey(): void {
        if (!this.gameActive || this.isWaitingForNext) return;

        const currentWord = this.gameWords[this.currentWordIndex];
        const inputValue = this.gameInput.value.trim();

        if (inputValue === currentWord) {
            const reactionTime = Date.now() - this.wordStartTime;
            this.reactionTimes.push(reactionTime);
            this.stopTimer();
            
            this.gameInput.classList.remove('wrong');
            this.gameInput.classList.add('correct');
            this.isWaitingForNext = true;
            this.gameInput.disabled = true;
            
            setTimeout(() => {
                this.currentWordIndex++;
                this.isWaitingForNext = false;
                this.gameInput.disabled = false;
                this.showNextWord();
                this.gameInput.focus();
            }, 300);
        } else {
            this.gameInput.classList.add('wrong');
            this.gameInput.classList.remove('correct');
            
            setTimeout(() => {
                this.gameInput.classList.remove('wrong');
            }, 500);
        }
    }

    private startTimer(): void {
        this.gameTimer.style.visibility = 'visible';
        this.gameTimer.textContent = '0.000s';
        
        this.timerInterval = window.setInterval(() => {
            if (!this.gameActive || this.wordStartTime === 0) return;
            
            const elapsed = (Date.now() - this.wordStartTime) / 1000;
            this.gameTimer.textContent = `${elapsed.toFixed(3)}s`;
        }, 10);
    }

    private stopTimer(): void {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    private showResults(): void {
        this.gameActive = false;
        this.gameInput.disabled = true;
        this.gameWord.textContent = '';
        this.gameWordContainer.style.display = 'none';
        
        const avgTime = Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length);
        const fastestTime = Math.min(...this.reactionTimes);
        const slowestTime = Math.max(...this.reactionTimes);
        
        document.getElementById('avgTime')!.textContent = `${avgTime}ms`;
        document.getElementById('fastestTime')!.textContent = `${fastestTime}ms`;
        document.getElementById('slowestTime')!.textContent = `${slowestTime}ms`;
        
        this.gameResults.style.display = 'block';
        
        this.updateGameUI();
    }

    private updateGameProgress(): void {
        const progressText = document.getElementById('progressText')!;
        progressText.textContent = `${this.currentWordIndex + 1} / ${this.gameWords.length || 5}`;
    }

    private updateGameUI(): void {
        const resultsTitle = document.getElementById('resultsTitle')!;
        const avgTimeLabel = document.getElementById('avgTimeLabel')!;
        const fastestLabel = document.getElementById('fastestLabel')!;
        const slowestLabel = document.getElementById('slowestLabel')!;

        resultsTitle.textContent = this.translations.resultsTitle[this.currentLanguage];
        avgTimeLabel.textContent = this.translations.avgTimeLabel[this.currentLanguage];
        fastestLabel.textContent = this.translations.fastestLabel[this.currentLanguage];
        slowestLabel.textContent = this.translations.slowestLabel[this.currentLanguage];
    }
}

new KeyboardTester();

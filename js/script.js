let display = document.getElementById("display")
let currentInput = ""
let memory = 0
let lastValue = ""
let previousInput = ""
let isWaitNextValue = false

// Format number with commas
function formatNumber(number) {
	if (!isFinite(number)) return number
	return parseFloat(number)
		.toFixed(12)
		.replace(/\.?0+$/, "")
		.toLocaleString("en-US")
}

function appendNumber(number) {
	if (currentInput.length < 12) {
		if (number === "." && currentInput.includes(".")) return
		currentInput += number
		if (currentInput.includes(".")) {
			display.textContent = currentInput
		} else {
			display.textContent = formatNumber(currentInput)
		}
	}
}

function appendOperator(operator) {
	if (currentInput) {
		// Only replace the last operator if it exists and if the new operator is different
		if (isOperator(currentInput.slice(-1)) && currentInput.slice(-1) !== operator) {
			currentInput = currentInput.slice(0, -1)
		}
		// Only add operator if there's a number before it
		if (!isOperator(currentInput.slice(-1)) || currentInput.slice(-1) !== operator) {
			currentInput += operator
		}
		display.textContent = formatNumber(convertOperators(currentInput))
	}
}

function isOperator(char) {
	return ["+", "-", "*", "/"].includes(char)
}

function updateCalculation() {
	try {
		// Only calculate if there's a complete expression
		if (currentInput && !isOperator(currentInput.slice(-1))) {
			let result = eval(convertToSymbols(currentInput))
			display.textContent = formatNumber(result)
			currentInput = result.toString()
		}
	} catch (error) {
		display.textContent = "Error"
		currentInput = ""
	}
}

function calculate() {
	updateCalculation()
	lastValue = currentInput
}

function memoryAdd() {
	memory += parseFloat(display.textContent.replace(/,/g, ""))
}

function memorySubtract() {
	memory -= parseFloat(display.textContent.replace(/,/g, ""))
}

function memoryRecall() {
	display.textContent = formatNumber(memory)
	currentInput = memory.toString()
}

function memoryClear() {
	memory = 0
}

function toggleSign() {
	if (currentInput) {
		currentInput = (parseFloat(currentInput) * -1).toString()
		display.textContent = formatNumber(convertOperators(currentInput))
	}
}

function percentage() {
	if (currentInput) {
		currentInput = (parseFloat(currentInput) / 100).toString()
		display.textContent = formatNumber(convertOperators(currentInput))
	}
}

function squareRoot() {
	if (currentInput) {
		currentInput = Math.sqrt(parseFloat(currentInput)).toString()
		display.textContent = formatNumber(convertOperators(currentInput))
	}
}

function percentageChange() {
	if (lastValue) {
		let current = parseFloat(currentInput)
		let previous = parseFloat(lastValue)
		if (previous !== 0) {
			let change = ((current - previous) / previous) * 100
			display.textContent = formatNumber(change.toFixed(2)) + "%"
		} else {
			display.textContent = "Error"
		}
	} else {
		display.textContent = "Error"
	}
}

function clearEntry() {
	currentInput = ""
	display.textContent = "0" // Reset display to '0'
}

function convertOperators(expression) {
	return expression.replace(/\//g, "÷").replace(/\*/g, "×")
}

function convertToSymbols(expression) {
	return expression.replace(/÷/g, "/").replace(/×/g, "*")
}

// Attach event listeners to all buttons
document.querySelectorAll(".btn").forEach((button) => {
	button.addEventListener("click", function () {
		const value = this.textContent
		if (value === "=") {
			if (isWaitNextValue) {
				// Δ% 버튼을 누른 후 '=' 버튼을 눌렀을 때
				percentageChange() // 백분율 변화 계산
				isWaitNextValue = false // 대기 상태 해제
			} else {
				calculate() // 일반 계산
			}
		} else if (value === "CEC") {
			clearEntry()
		} else if (value === "M+") {
			memoryAdd()
		} else if (value === "M-") {
			memorySubtract()
		} else if (value === "MR") {
			memoryRecall()
		} else if (value === "MC") {
			memoryClear()
		} else if (value === "+/-") {
			toggleSign()
		} else if (value === "%") {
			percentage()
		} else if (value === "√") {
			squareRoot()
		} else if (value === "∆%") {
			lastValue = currentInput // 현재 입력값 저장
			currentInput = "" // 현재 입력 초기화
			display.textContent = "0" // 디스플레이를 0으로 설정
			isWaitNextValue = true // 다음 숫자 입력 대기
		} else {
			if (isNaN(value)) {
				appendOperator(value) // 연산자 추가
			} else {
				appendNumber(value) // 숫자 추가
			}
		}
	})
})

// Show the instructions section when "How to Add" button is clicked
document.getElementById("show-instructions").addEventListener("click", () => {
	document.getElementById("home-screen-instructions").style.display = "block"
})

// Hide the instructions section when the close button is clicked
document.getElementById("close-instructions").addEventListener("click", () => {
	document.getElementById("home-screen-instructions").style.display = "none"
})

document.getElementById("header").addEventListener("click", () => {
	document.getElementById("descCalc").style.display = "flex"
	document.getElementById("close-header").style.display = "flex"
})

document.getElementById("close-header").addEventListener("click", () => {
	document.getElementById("descCalc").style.display = "none"
	document.getElementById("close-header").style.display = "none"
})

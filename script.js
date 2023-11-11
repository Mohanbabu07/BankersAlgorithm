
    function createMatrixInput(matrixType) {
        const processes = parseInt(document.getElementById('processes').value);
        const resources = parseInt(document.getElementById('resources').value);

        const matrixTable = document.getElementById(matrixType + 'Matrix');
        matrixTable.innerHTML = '';

        for (let i = 0; i < processes; i++) {
            const row = matrixTable.insertRow(-1);

            for (let j = 0; j < resources; j++) {
                const cell = row.insertCell(-1);
                const input = document.createElement('input');
                input.type = 'text';
                input.name = `${matrixType}[${i}][${j}]`;
                cell.appendChild(input);
            }
        }
    }

    function createAvailableResourcesInput() {
        const resources = parseInt(document.getElementById('resources').value);

        const availableTable = document.getElementById('availableResources');
        availableTable.innerHTML = '<tr><td>Available Resources:</td></tr>';

        const row = availableTable.insertRow(-1);

        for (let i = 0; i < resources; i++) {
            const cell = row.insertCell(-1);
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `available[${i}]`;
            input.placeholder = `Available ${i + 1}`;
            cell.appendChild(input);
        }
    }

    function runBankersAlgorithm() {
		const processes = parseInt(document.getElementById('processes').value);
		const resources = parseInt(document.getElementById('resources').value);
	
		const allocation = [];
		const maximum = [];
		const available = [];
	
		for (let i = 0; i < processes; i++) {
			allocation[i] = [];
			maximum[i] = [];
			for (let j = 0; j < resources; j++) {
				allocation[i][j] = parseInt(document.querySelector(`input[name="allocation[${i}][${j}]"]`).value);
				maximum[i][j] = parseInt(document.querySelector(`input[name="maximum[${i}][${j}]"]`).value);
			}
		}
	
		for (let i = 0; i < resources; i++) {
			available[i] = parseInt(document.querySelector(`input[name="available[${i}]"]`).value);
		}
	
		const work = [...available];
		const finish = new Array(processes).fill(false);
		const safeSequence = [];
		let isSafe = true;
	
		let found;
		do {
			found = false;
			for (let i = 0; i < processes; i++) {
				if (!finish[i]) {
					let canExecute = true;
					for (let j = 0; j < resources; j++) {
						if (maximum[i][j] - allocation[i][j] > work[j]) {
							canExecute = false;
							break;
						}
					}
	
					if (canExecute) {
						for (let j = 0; j < resources; j++) {
							work[j] += allocation[i][j];
						}
						finish[i] = true;
						safeSequence.push(i);
						found = true;
					}
				}
			}
		} while (found);
	
		for (let i = 0; i < processes; i++) {
			if (!finish[i]) {
				isSafe = false;
				break;
			}
		}
	
		const resultDiv = document.getElementById('result');
		if (isSafe) {
			const safeSequenceString = safeSequence.join(" -> ");
			resultDiv.innerHTML = `Safe sequence: ${safeSequenceString}<br>System is safe.`;
		} else {
			resultDiv.innerHTML = "No safe sequence exists.<br>System is not safe.";
		}
		displayNeedMatrix(allocation, maximum);
	}
	
    function displayNeedMatrix(allocation, maximum) {
        const processes = allocation.length;
        const resources = allocation[0].length;

        const needMatrix = [];
        for (let i = 0; i < processes; i++) {
            needMatrix[i] = [];
            for (let j = 0; j < resources; j++) {
                needMatrix[i][j] = maximum[i][j] - allocation[i][j];
            }
        }

        const needMatrixDiv = document.getElementById('needMatrixDiv');
        needMatrixDiv.innerHTML = '<h2>Need Matrix:</h2>';

        const table = document.createElement('table');
        needMatrixDiv.appendChild(table);

        // Create table headers
        const headerRow = table.insertRow(0);
        for (let j = 0; j < resources; j++) {
            const headerCell = headerRow.insertCell(j);
            headerCell.innerHTML = `<b>Resource ${j + 1}</b>`;
        }

        // Populate the table with need matrix values
        for (let i = 0; i < processes; i++) {
            const row = table.insertRow(-1);
            for (let j = 0; j < resources; j++) {
                const cell = row.insertCell(j);
                cell.innerHTML = needMatrix[i][j];
            }
        }
    }
	

    document.getElementById('processes').addEventListener('blur', function () {
        createMatrixInput('allocation');
        createMatrixInput('maximum');
        createAvailableResourcesInput();
    });

    document.getElementById('resources').addEventListener('blur', function () {
        createMatrixInput('allocation');
        createMatrixInput('maximum');
        createAvailableResourcesInput();
    });

    createAvailableResourcesInput();

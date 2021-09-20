App = {
	loading: false,
	contracts: {},
	accounts: [],
	load: async () => {
		//Load app...
		console.log('App Loading...');
		await App.loadWeb3();
		await App.loadAccount();
		await App.loadContract();
		await App.render();
		await App.renderTasks();
	},
	loadWeb3: async () => {
		if (typeof web3 !== 'undefined') {
			App.web3Provider = window.ethereum;
			web3 = new Web3(window.ethereum);
		} else {
			window.alert("Please connect to Metamask.")
		}

		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			try {
				// Request account access if needed
				accounts = await ethereum.request({ method: 'eth_requestAccounts' });
				// Acccounts now exposed
				web3.eth.defaultAccount = accounts[0];
				//web3.eth.sendTransaction({/* ... */ })
				
			} catch (error) {
				// User denied account access...
			}
		}
		// Non-dapp browsers...
		else {
			console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
	},
	loadAccount: async () => {
		App.account = accounts[0];
		console.log('Account: ' + App.account);
	},
	loadContract: async () => {
		const todoList = await $.getJSON('TodoList.json');
		App.contracts.TodoList = TruffleContract(todoList);
		App.contracts.TodoList.setProvider(window.ethereum);
		// console.log(todoList);

		App.todoList = await App.contracts.TodoList.deployed();
	},
	render: async () => {
		if (App.loading) return;

		App.setLoading(true);
		document.getElementById('account').innerHTML = 'Account: ' + App.account;
		App.setLoading(false);
	},
	setLoading: (boolean) => {
		App.loading = boolean
		const loader = $('#loader')
		const content = $('#content')
		if (boolean) {
			loader.show()
			content.hide()
		} else {
			loader.hide()
			content.show()
		}
	},

	createTask: async () => {
		App.setLoading(true)
		const content = $('#newTask').val();
		await App.todoList.createTask(content, false, {from: App.account});
		window.location.reload();
	},

	renderTasks: async () => {
		const taskCount = await App.todoList.taskCount();

		for (let i = 1; i <= taskCount.toNumber(); i++) {
			const task = await App.todoList.tasks(i);
			if (task[3]) {
				console.log('Task');
				const $taskTemplate = $('.taskTemplate');
				const taskId = task[0].toNumber();
				const taskContent = task[1];
				const taskCompleted = task[4];

				const $newTaskTemplate = $taskTemplate.clone();
				$newTaskTemplate.find('.content').html(taskContent);
				$newTaskTemplate.find('input')
					.prop('name', taskId)
					.prop('checked', taskCompleted)
					.on('click', App.toggleCompleted)

				// Put the task in the correct list
				if (taskCompleted) {
					$('#completedTaskList').append($newTaskTemplate)
				} else {
					$('#taskList').append($newTaskTemplate)
				}
				// Show the task
				$newTaskTemplate.show()
			}
			else {
				console.log('Note');
				const noteTemplate = document.getElementsByClassName("noteTemplate");
				const noteId = task[0].toNumber();
				const noteContent = task[1];

				const newnoteTemplate = noteTemplate[0].cloneNode(true);
				newnoteTemplate.style.display = 'flex';
				newnoteTemplate.innerHTML = noteId + '. ' + noteContent;
				document.getElementById("noteList").appendChild(newnoteTemplate);
			}
		}
	}
}

$(() => {
	$(window).load(() => {
		App.load()
	})
})
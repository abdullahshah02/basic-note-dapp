// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
	struct Task {
		uint id;
		string content;
		uint createdTimestamp;
		bool isTask;
		bool completed;
	}
	uint public taskCount = 0;
	mapping(uint => Task) public tasks;

	constructor() public {
		createTask("Welcome to Laddoo Notes", false);
	}

	event TaskCreated(uint id, string content, bool completed);
	// function getTaskCount() public view returns(uint) {
	// 	return taskCount;
	// }

	function createTask(string memory _content, bool _isTask) public {
		taskCount++;
		tasks[taskCount] = Task(taskCount, _content, block.timestamp, _isTask, false);
		emit TaskCreated(taskCount, _content, false);
	}
}
$(document).ready(init);

var arrayOfRowContainersObjectsG=[];
var arrayOfTasksObjectsG=[];
var newTaskObjectG; 

function init(){
	$('#add-task-button').on('click', addTaskButton);
	$('.tasks-list').on('click', '.delete-button', deleteTaskButton);
	$('.tasks-list').on('click', '.completed-checkbox', completedCheckboxButton);
	//$('.tasks-list').on('click', '.edit-button', saveEditsButton);

	//$('.tasks-titles').on('click', '.date-output', sortFields);
	//$('.tasks-titles').on('click', '.number-output', sortFields);
	//$('.tasks-titles').on('click', '.email-output', sortFields);

  
	$.get('/tasks', function(data) {
		  debugger;
			console.log('data is', data);
			arrayOfTasksObjectsG = data;
			updateArrayOfRowContainers();
			displayTasksList();
   });
	
	
	/*
	var newTask = "buy shoes";
	var statusOfTask = true;

	$.post('/tasks', {task:newTask, status:statusOfTask})
	.success(function(data) {
		//debugger;
  	console.log('posting task', data);
    
    var $li = $('<li>').text(newName);
    $('#output').append($li);
    
  }).fail(function(err) {
    alert('something went wrong :(')
  });
  */
}

function addTaskButton(){
	console.log('add task button');
	var date = $('#date-input').val();
	var task = $('#task-input').val();
	var status = false;
  var index = arrayOfTasksObjectsG.length + 1;

	var taskObject={
				date:date,
	  		task:task,
	  		status:status,
	  		index: index
	  	};

	arrayOfTasksObjectsG.push(taskObject);

  $.post('/tasks/add', taskObject)
	.success(function(data) {
		debugger;
  	console.log('posting task', data);

  	// update array of containers 
  	updateArrayOfRowContainers();
  	displayTasksList();
    /*
    var $li = $('<li>').text(newName);
    $('#output').append($li);
    */
  }).fail(function(err) {
    alert('something went wrong :(')
  });

  /*
	$.get('/tasks', function(data) {
		//debugger;
		console.log('data is', data);
	  
   }); // $.get
  */
}

function deleteTaskButton(){
	var indexOfElementToRemove = $(this).closest('.row-container').index();
	arrayOfTasksObjectsG.splice(indexOfElementToRemove,1);

	$.post('/tasks/delete', {indexToRemove:indexOfElementToRemove})
	.success(function(data) {
		debugger;
  	console.log('resulting array', data);



  arrayOfRowContainersObjectsG.splice(indexOfElementToRemove,1);
	//saveToLocalStorage(arrayOfContactsObjectsG);
	updateArrayOfRowContainers();
	displayTasksList();

  	// update array of containers 
    /*
    var $li = $('<li>').text(newName);
    $('#output').append($li);
    */
  }).fail(function(err) {
    alert('something went wrong :(')
  });
	
}

function completedCheckboxButton(){
	var completedValue = JSON.parse($(this).val());
	if(completedValue == false){
		completedValue = true;
	} else {
		completedValue = false;
	}
	$(this).attr('value', completedValue);
	
	var indexChecked = $(this).closest('.row-container').index();

	$.post('/tasks/checkbox', {indexChecked: indexChecked, status:completedValue})
	.success(function(data) {
		debugger;
  	console.log('checkbox, returned arry; ', data);

  	arrayOfTasksObjectsG = data;

  	// update array of containers 
  	updateArrayOfRowContainers();
  	displayTasksList();
    /*
    var $li = $('<li>').text(newName);
    $('#output').append($li);
    */
  }).fail(function(err) {
    alert('something went wrong :(')
  });





}

function saveToServer(arrayOfTasksObjects){
	// GET array of Task objects from server 

	// Parse the JSON String to get the object

	// Modify the object

	// Stringify the object

	// Post back to server 

}

function updateArrayOfRowContainers(){
	$('.tasks-list').empty(); 
	arrayOfRowContainersObjectsG.splice(0, arrayOfRowContainersObjectsG.length);

	arrayOfTasksObjectsG.map(function(task){
		var $rowContainer = $('<div>').addClass('row row-container');
		var $dateColumn = $('<div>').addClass('date-col col-md-2 col-sm-4 col-xs-6').text(task.date); //.attr('contenteditable', true);
    $rowContainer.append($dateColumn); 
    var $taskColumn = $('<div>').addClass('task-col col-md-2 col-sm-4 col-xs-6').text(task.task);//.attr('contenteditable', true);
		$rowContainer.append($taskColumn);
		//var $emailColumn = $('<div>').addClass('email-col col-md-2 col-sm-4 col-xs-6').text(contact.email).attr('contenteditable', true);
		//$rowContainer.append($emailColumn);
    
    //var $completedButton = $('<div>').addClass('completed-button col-md-2 col-sm-4 col-xs-6');
    debugger;
    var completedFlag = JSON.parse(task.status); 
    debugger;
    console.log('completed Flag', completedFlag);
    var $completedCheckbox = $('<input>').addClass('completed-checkbox col-md-2 col-sm-4 col-xs-6').attr('type', 'checkbox').attr('value', JSON.parse(completedFlag));
   
    if(completedFlag == true) {
    	debugger;
    	$completedCheckbox.prop('checked', true); 
    }
    else {
    	$completedCheckbox.prop('checked', false); 
    }
    
    //var $completedIcon = $('<i>').addClass('fa fa-floppy-o');
    //$completedCheckbox.append($completedIcon);
    $rowContainer.append($completedCheckbox);

    var $deleteButton = $('<div>').addClass('delete-button col-md-2 col-sm-4 col-xs-6');
    var $deleteIcon = $('<i>').addClass('fa fa-trash');
    $deleteButton.append($deleteIcon);
    $rowContainer.append($deleteButton);
    
    arrayOfRowContainersObjectsG.push($rowContainer);
	});
}

function displayTasksList(){
	$('.tasks-list').append(arrayOfRowContainersObjectsG);
	$('.input-field').val('');  // Clears all the input fields
}


	

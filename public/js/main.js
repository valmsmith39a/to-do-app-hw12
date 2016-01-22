$(document).ready(init);

var arrayOfRowContainersObjectsG=[];
var arrayOfTasksObjectsG=[];
var newTaskObjectG; 

function init(){
	$('#add-task-button').on('click', addTaskButton);
	//$('#date-input').val(moment().format('M-D-YYYY'));
	$('.tasks-list').on('click', '.delete-button', deleteTaskButton);
	$('.tasks-list').on('click', '.completed-checkbox', completedCheckboxButton);
	
	$.get('/tasks', function(data) {
			arrayOfTasksObjectsG = data;
			updateArrayOfRowContainers();
			displayTasksList();
   });
}

function addTaskButton(){
	var date = $('#date-input').val();
	var task = $('#task-input').val();
	var status = false;
  var index = arrayOfTasksObjectsG.length;

	var taskObject={
				date:date,
	  		task:task,
	  		status:status,
	  		index: index
	  	};

	arrayOfTasksObjectsG.push(taskObject);

  $.post('/tasks/add', taskObject)
	.success(function(data) {
  	// update array of containers 
  	updateArrayOfRowContainers();
  	displayTasksList();
  }).fail(function(err) {
    alert('something went wrong :(')
  });
}

function deleteTaskButton(){
	var indexOfElementToRemove = $(this).closest('.row-container').index();
	arrayOfTasksObjectsG.splice(indexOfElementToRemove,1);

	$.post('/tasks/delete', {indexToRemove:indexOfElementToRemove})
	.success(function(data) {

  arrayOfRowContainersObjectsG.splice(indexOfElementToRemove,1);
	updateArrayOfRowContainers();
	displayTasksList();
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
  	arrayOfTasksObjectsG = data;
  	updateArrayOfRowContainers();
  	displayTasksList();
  }).fail(function(err) {
    alert('something went wrong :(');
  });
}

function updateArrayOfRowContainers(){
	$('.tasks-list').empty(); 
	arrayOfRowContainersObjectsG.splice(0, arrayOfRowContainersObjectsG.length);

	arrayOfTasksObjectsG.map(function(task){
		var $rowContainer = $('<div>').addClass('row row-container');
		var $dateColumn = $('<div>').addClass('date-col col-md-1 col-xs-3').text(task.date); 
    $rowContainer.append($dateColumn); 
    var $taskColumn = $('<div>').addClass('task-col col-md-7 col-xs-3').text(task.task);
		$rowContainer.append($taskColumn);

    var completedFlag = JSON.parse(task.status); 
    var $completedCheckbox = $('<input>').addClass('completed-checkbox col-md-2 col-xs-3').attr('type', 'checkbox').attr('value', JSON.parse(completedFlag)).attr('id', 'complete-checkbox');

    if(completedFlag == true) {
    	$completedCheckbox.prop('checked', true); 
    }
    else {
    	$completedCheckbox.prop('checked', false); 
    }
    
    $rowContainer.append($completedCheckbox);

    var $deleteButton = $('<div>').addClass('delete-button col-md-2 col-xs-3');
    var $deleteIcon = $('<i>').addClass('fa fa-trash');
    $deleteButton.append($deleteIcon);
    $rowContainer.append($deleteButton);
    
    arrayOfRowContainersObjectsG.push($rowContainer);
	});
}

function displayTasksList(){
	$('.tasks-list').append(arrayOfRowContainersObjectsG);
	$('#task-input').val('');
}


	

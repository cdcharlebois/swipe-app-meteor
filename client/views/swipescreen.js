/*

    Swipe screen hook-up

 */

var reg = new RegExp('^[0-9|;]+$');
var student;
Session.set("innerTemplate", "useridentry");

Template.swipescreen.showDynamicContent = function() {
	return Template[Session.get("innerTemplate")]();
};

Template.useridentry.rendered = function() {
	$(this.find('#student-id-entry')).focus();
};

Template.useridentry.events = {
	'keypress #student-id-entry': function(e) {
		e.preventDefault();
		var character = String.fromCharCode(e.which);
		if(reg.test(character)) {
			e.target.value += character;
			console.log(e.target.value);
		}
		// handle if user is found
		if(e.target.value.length === 8) {
			var s = Students.findOne({universityID: e.target.value});
			if(s) {
				console.log("found");
				student = s;
				Session.set("innerTemplate", "studenthelp");
			} else {
				alert('student does not exist');
			}
		}
	}
};

Template.studenthelp.studentName = function() {
	return student.name;
};

Template.studenthelp.tutor = function() {
	return student.isTutor === 'true';
};

Template.studenthelp.events({
	'click #noHelp': function() {
		console.log('no help');
		Visits.insert({name: student.name, timeIn: new Date(), timeOut: null, needHelp: false});
		location.reload();
	},
	'click #needHelp': function() {
		console.log('need help');
		Session.set("innerTemplate", "courseselection");
	},
	'click #tutor': function() {
		console.log('work');
	}
});

Template.courseselection.courses = function() {
	return Courses.find();
};

Template.courseselection.events({
	'click button': function(e) {
		console.log(e.target.value);
		Visits.insert({name: student.name, timeIn: new Date(), timeOut: null, needHelp: true, course: e.target.value});
		location.reload();
	}
});
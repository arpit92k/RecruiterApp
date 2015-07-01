window.MYAPP =window.MYAPP || {}

MYAPP.Router = Backbone.Router.extend({
	routes: {
		'recruiters' : 'showRecruiters',
		'candidates' : 'showCandidates',
		'*path' : 'showBoth'
	},
	showRecruiters: function() {
		MYAPP.recruiterCollection = new MYAPP.RecruiterCollection();
		MYAPP.recruiterCollection.fetch();
		MYAPP.recruiterView = new MYAPP.RecruiterView();
		MYAPP.recruiterView.render(MYAPP.recruiterCollection);
	},
	showCandidates: function(){
		MYAPP.candidateCollection = new MYAPP.CandidateCollection();
		MYAPP.candidateCollection.fetch();
		MYAPP.candidateView = new MYAPP.CandidateView();
		MYAPP.candidateView.render(MYAPP.candidateCollection);
	},
	showBoth: function(){
		this.showRecruiters();
		this.showCandidates();
	}
});

//Recruiter View
MYAPP.RecruiterView = Backbone.View.extend({
	el: $('#recruiter-list'),
	template: _.template($("#recruiter-list-item").html()),
	initialize: function(){
		this.render();
    },
    render: function(data){
    	if (data)
    		data=data.toJSON();
        this.$el.html(this.template({data}));
    },
    events: {
		"click #add-recruiter": "addRecruiter",
		"keypress #new-recruiter-name"  : "addRecruiterOnEnter",
    },
    addRecruiter: function(e){
    	var newName=$('#new-recruiter-name').val();
    	if (!newName)
    		return;
    	var newRecruiter=new MYAPP.RecruiterModel({
    		id:MYAPP.recruiterCollection.nextId(),
    		name:newName
    	});
    	MYAPP.recruiterCollection.add(newRecruiter);
    	newRecruiter.save();
    	$('#new-recruiter-name').val('');
    	MYAPP.recruiterView.render(MYAPP.recruiterCollection);
    },
    addRecruiterOnEnter: function(e){
    	if (e.keyCode != 13)
    		return;
    	this.addRecruiter(e);
    }
});
//Recruiter Model
MYAPP.RecruiterModel = Backbone.Model.extend({
	defaults: {
		id: 0,
		name: ''
	}
});
//Recruiter Collection
MYAPP.RecruiterCollection = Backbone.Collection.extend({
	model: MYAPP.RecruiterModel,
	localStorage: new Backbone.LocalStorage("MYAPP-recruiters"),	
	nextId: function() {
		if (!this.length) 
			return 1;
		return this.last().get('id') + 1;
	},
	comparator: 'id'
});

//Candidate view
MYAPP.CandidateView = Backbone.View.extend({
	el: $('#candidate-list'),
	template: _.template($("#candidate-list-item").html()),
	initialize: function(){
        //this.render();
    },
    render: function(data){
    	if(data)
    		data=data.toJSON();
        this.$el.html(this.template({data}));
    },
    events: {
		"click #add-candidate": "addCandidate",
		"keypress #new-candidate-name"  : "addCandidateOnEnter",
    },
    addCandidate: function(e){
    	var newName=$('#new-candidate-name').val();
    	if (!newName)
    		return;
    	var newCandidate=new MYAPP.CandidateModel({
    		id:MYAPP.candidateCollection.nextId(),
    		name:newName
    	});
    	MYAPP.candidateCollection.add(newCandidate);
    	newCandidate.save();
    	$('#new-candidate-name').val('');
    	MYAPP.candidateView.render(MYAPP.candidateCollection);
    },
    addCandidateOnEnter: function(e){
    	if (e.keyCode != 13)
    		return;
    	this.addCandidate(e);
    }
});
//Candidate Model
MYAPP.CandidateModel = Backbone.Model.extend({
	defaults: {
		id: 0,
		name: '',
		recruiterId:0
	}
});
//Candidate Collection
MYAPP.CandidateCollection = Backbone.Collection.extend({
    model: MYAPP.CandidateModel,
    localStorage: new Backbone.LocalStorage("MYAPP-candidates"),	
	nextId: function() {
		if (!this.length) 
			return 1;
		return this.last().get('id') + 1;
	},
	comparator: 'id'
});

MYAPP.MappingView = Backbone.View.extend({
	model:MYAPP.CandidateModel
});

MYAPP.router = new MYAPP.Router();
Backbone.history.start();



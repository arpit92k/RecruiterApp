window.MYAPP =window.MYAPP || {}

MYAPP.Router = Backbone.Router.extend({
	routes: {
		'recruiters' : 'showRecruiters',
		'candidates' : 'showCandidates',
		'assignCandidates/:id' : 'mapCandidates',
		'listCandidates/:id' : 'listCandidates',
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
	},
	mapCandidates: function(rid){
		MYAPP.recruiterCollection = new MYAPP.RecruiterCollection();
		MYAPP.recruiterCollection.fetch();
		MYAPP.candidateCollection = new MYAPP.CandidateCollection();
		MYAPP.candidateCollection.fetch();
		var recruiter=MYAPP.recruiterCollection.where({id:parseInt(rid)})[0].toJSON();
		MYAPP.mappingView = new MYAPP.MappingView();
		MYAPP.mappingView.render(recruiter);
	},
	listCandidates: function(rid){
		MYAPP.recruiterCollection = new MYAPP.RecruiterCollection();
		MYAPP.recruiterCollection.fetch();
		MYAPP.candidateCollection = new MYAPP.CandidateCollection();
		MYAPP.candidateCollection.fetch();
		var recruiter=MYAPP.recruiterCollection.where({id:parseInt(rid)})[0].toJSON();
		MYAPP.mappingListView = new MYAPP.MappingListView();
		MYAPP.mappingListView.render(recruiter);
	}
});
//Recruiter Model
MYAPP.RecruiterModel = Backbone.Model.extend({
	defaults: {
		id: 0,
		name: ''
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
		"click .assign-candidates":"assignCandidates",
		"click .list-candidates":"listCandidates",
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
    },
    assignCandidates: function(e){
    	var rid=parseInt(e.currentTarget.dataset.id);
    	window.location.href=window.location.href+"/#assignCandidates/"+rid;
    },
    listCandidates: function(e){
    	var rid=parseInt(e.currentTarget.dataset.id);
    	window.location.href=window.location.href+"/#listCandidates/"+rid;
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
//Candidate Model
MYAPP.CandidateModel = Backbone.Model.extend({
	defaults: {
		id: 0,
		name: '',
		recruiterId:0
	}
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
	el: $('#mapping-area'),
	template: _.template($("#mapping-template").html()),
	initialize: function(){
		//this.render();
    },
    render: function(rec){
    	var cand=MYAPP.candidateCollection.where({recruiterId:0});
        this.$el.html(this.template({
        	recruiter:rec,
        	candidates:cand
        }));
    },
    events: {
		"click .assign-recruiter": "assignRecruiter"
    },
    assignRecruiter: function(e){
    	var rid=parseInt(e.currentTarget.dataset.rid);
    	var cid=parseInt(e.currentTarget.dataset.cid);
    	var candidate=MYAPP.candidateCollection.where({id:cid})[0];
    	candidate.set({
    		recruiterId:rid
    	});
    	candidate.save();
    	var rec=MYAPP.recruiterCollection.where({id:rid})[0].toJSON();
    	this.render(rec);
    }
});

MYAPP.MappingListView = Backbone.View.extend({
	el: $('#mapping-area'),
	template: _.template($("#mapping-list-template").html()),
	initialize: function(){
		//this.render();
    },
    render: function(rec){
    	var rid=parseInt(rec.id);
    	var cand=MYAPP.candidateCollection.where({recruiterId:rid});
        this.$el.html(this.template({
        	recruiter:rec,
        	candidates:cand
        }));
    },
    events: {
		"click .assign-recruiter": "assignRecruiter"
    }
});

MYAPP.router = new MYAPP.Router();
Backbone.history.start();



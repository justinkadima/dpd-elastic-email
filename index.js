var util=require('util');
var qs=require('querystring');
var https=require('https');

var Resource=require('deployd/lib/resource');



function ElasticEmail(){
    Resource.apply(this, arguments);

}

util.inherits(ElasticEmail,Resource);


ElasticEmail.prototype.clientGeneration=true;

ElasticEmail.basicDashboard={
 settings:[
  {
      name:'username',
      type:'text',
      description:'Elastic account username'
  },
  {
      name:'key',
      type:'text',
      description:'Elastic api key'
  },
  {
      name:'defaultFromName',
      type:'text',
      description:'The default FROM name'
   },
   {
      name:'defaultFromEmail',
      type:'text',
      description:'The default FROM email address'
   },
   {
        name:'defaultSubject',
        type:'text',
        description:'The default subject '
    },
    {
         name:'developmentMode',
        type:'checkbox',
        description:'if true then it will print emails to console instead of sending them'

    }
 ]


};


ElasticEmail.prototype.handle=function(ctx,next){

   if(ctx.req && ctx.req.method!='POST'){
        return next();
    }

    if(!this.config.username || !this.config.key){
        console.log('Elastic username & key missing!');
        next();
    }

    console.log(ctx);
    var options=ctx.body || {};

    console.log(options);

    options.fromName=options.fromName || this.config.defaultFromName;
    options.fromEmail=options.fromEmail || this.config.defaultFromEmail;
    options.subject=options.subject || this.config.defaultSubject;

    console.log(options);

    var errors={};

    if(!options.to){
        errors.to=' \'to\' is required';

    }
    if(!options.fromEmail){
        errors.from=' \'from\' is required';
    }
    if(!options.subject){
        errors.subject=' \'subject\' is required';
    }

    if(!options.text && !options.html){
        errors.content=' \'text\' or  \'html\' is required ';
    }

    if(errors.length>0){
        return ctx.done({statusCode: 400, errors: errors});
    }


    var post_data = qs.stringify({
		'username' : this.config.username,
		'api_key': this.config.key,
		'from': options.fromEmail,
		'from_name' : options.fromName,
		'to' : options.to,
		'subject' : options.subject,
		'body_html' : options.text,
		'body_text' : options.html
	});


    if(this.config.developmentMode){
        console.log(post_data);
        return ctx.done(null);
    }

    console.log(post_data);

	var post_options = {
		host: 'api.elasticemail.com',
		path: '/mailer/send',
		port: '443',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': post_data.length
		}
	};

	var result = '';
	// Create the request object.
	var post_req = https.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			result = chunk;
		});
		res.on('error', function (e) {
			result = 'Error: ' + e.message;
		});
	});

	// Post to Elastic Email
	post_req.write(post_data);
	post_req.end();
	
    return ctx.done(null,{message: result});
}





module.exports=ElasticEmail;

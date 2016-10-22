var Resource=require('deployd/lib/resource');
var util=require('util');




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
      name:'password',
      type:'text',
      description:'Elastic account password'
  },
  {
      name:'defaultFROM',
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

    /*if(ctx.req && ctx.req.method!='POST'){
        return next();
    }*/
    var options=ctx.body || {};

    console.log(options);


}

module.exports=ElasticEmail;

(function($,window){
   var Map= function(){
       this.mapObj={};
       this.keyList=new Array();
   };
    Map.prototype.push=function(key,value){
        if(!this.isContain(key)){
            this.keyList.push(key);
        }
        this.mapObj[key]=value;
    }
    Map.prototype.get=function(key){
       if(this.isContain(key)){
           return this.mapObj[key];
       }
        return undefined;
    }
    Map.prototype.key=function(){
       return  this.keyList;
    }
    Map.prototype.keySort=function(){
        return  this.keyList.sort(sortNumber)
    }
    Map.prototype.remove=function(key){
    	if(this.isContain(key)){
            var newList=new Array();
            var newMapObj={};
            var keyList=this.keyList;
            var mapObj=this.mapObj;
            for(var i=0;i<keyList.length;i++){
            	if(key!=keyList[i]){
            		newList.push(keyList[i]);
            		newMapObj[keyList[i]]=mapObj[keyList[i]];
            	}
            }
            this.keyList=newList;
            this.mapObj=newMapObj;
        }
     }
    Map.prototype.isContain=function(key){
        for(var i in this.keyList){
            if(this.keyList[i]==key){
                return true;
            }
        }
        return false;
    }

    function sortNumber(a,b) {
        return a - b
    }
    window.Map=Map;
})(jQuery,window);
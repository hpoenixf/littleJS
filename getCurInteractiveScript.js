//获取正在执行的js标签
function getCurInteractiveScript(){  
     //先看ff4+原生支持的  
     if(document.currentScript){  
           return document.currentScript;  
     }  
  
     var elems  = document.getElementsByTagName("script");  
     for(var i=0,elem;elem=elems[i++];){  
           if(elem.readyState === 'interactive'){  
                   return elem;  
           }   
     }  
  
     return null;  
}  

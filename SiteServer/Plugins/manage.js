var $url="/pages/plugins/manage",$urlReload="/pages/plugins/manage/actions/reload",data={pageLoad:!1,pageAlert:null,pageType:parseInt(utils.getQueryString("pageType")||"1"),isNightly:null,pluginVersion:null,allPackages:null,packageIds:null,enabledPackages:[],disabledPackages:[],errorPackages:[],updatePackages:[],updatePackageIds:[],referencePackageIds:[]},methods={getIconUrl:function(e){return"https://www.siteserver.cn/plugins/"+e},load:function(){var e=this;$api.get($url).then(function(a){var t=a.data;e.isNightly=t.isNightly,e.pluginVersion=t.pluginVersion,e.allPackages=t.allPackages,e.packageIds=t.packageIds;for(var n=0;n<e.allPackages.length;n++){var i=e.allPackages[n];i.isRunnable&&i.metadata?i.isDisabled?e.disabledPackages.push(i):e.enabledPackages.push(i):e.errorPackages.push(i)}$apiCloud.get("updates",{params:{isNightly:e.isNightly,pluginVersion:e.pluginVersion,packageIds:e.packageIds}}).then(function(a){for(var t=a.data,n=0;n<t.value.length;n++){var i=t.value[n],l=$.grep(e.allPackages,function(e){return e.id==i.pluginId});if(1==l.length){var s=l[0];s.updatePackage=i,s.metadata&&s.metadata.version?-1==compareversion(s.metadata.version,i.version)&&(e.updatePackages.push(s),e.updatePackageIds.push(s.id)):(e.updatePackages.push(s),e.updatePackageIds.push(s.id))}}}).catch(function(a){e.pageAlert=utils.getPageAlert(a)}).then(function(){e.pageLoad=!0})}).catch(function(a){e.pageAlert=utils.getPageAlert(a)}).then(function(){e.pageLoad=!0})},enablePackage:function(e){var a=e.isDisabled?"启用":"禁用";if(-1!==this.referencePackageIds.indexOf(e.id))return swal("无法"+a,"存在其他插件依赖此插件，需要删除依赖插件后才能进行"+a+"操作","error");swal({title:a+"插件",text:"此操作将会禁用“"+e.id+"”，确认吗？",type:"question",showCancelButton:!0,cancelButtonText:"取 消",confirmButtonText:e.isDisabled?"启 用":"禁 用"}).then(function(t){t.value&&(utils.loading(!0),$api.post($url+"/"+e.id+"/actions/enable").then(function(){utils.loading(!1),swal({type:"success",title:"插件"+a+"成功",text:"插件"+a+"成功，系统需要重载页面",confirmButtonText:"重新载入"}).then(function(){window.top.location.reload(!0)})}))})},deletePackage:function(e){if(-1!==this.referencePackageIds.indexOf(e.id))return swal("无法删除","存在其他插件依赖此插件，需要删除依赖插件后才能进行删除操作","error");swal({title:"删除插件",text:"此操作将会删除“"+e.id+"”，确认吗？",type:"question",showCancelButton:!0,cancelButtonText:"取 消",confirmButtonText:"确认删除"}).then(function(a){a.value&&(utils.loading(!0),$api.delete($url+"/"+e.id).then(function(){utils.loading(!1),swal({type:"success",title:"插件删除成功",text:"插件删除成功，系统需要重载页面",confirmButtonText:"重新载入"}).then(function(){window.top.location.reload(!0)})}))})},btnReload:function(){utils.loading(!0),$api.post($urlReload).then(function(){utils.loading(!1),swal({type:"success",title:"插件重新加载成功",text:"插件重新加载成功，系统需要重载页面",confirmButtonText:"重新载入"}).then(function(){window.top.location.reload(!0)})})}},$vue=new Vue({el:"#main",data:data,methods:methods,created:function(){this.load()}});
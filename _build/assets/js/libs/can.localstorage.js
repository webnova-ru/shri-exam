can.Model("can.Model.LocalStorage",{localStore:function(t){var e=this.storageName,n=JSON.parse(window.localStorage[e]||(window.localStorage[e]="[]")),i=t.call(this,n);i!==!1&&(can.each(n,function(t){delete t.editing}),window.localStorage[e]=JSON.stringify(n))},findAll:function(){var t=new can.Deferred;return this.localStore(function(e){var n=[],i=this;can.each(e,function(t){n.push(new i(t))}),t.resolve({data:n})}),t},destroy:function(t){var e=new can.Deferred;return this.localStore(function(n){for(var i=0;i<n.length;i++)if(n[i].id===t){n.splice(i,1);break}e.resolve({})}),e},create:function(t){var e=new can.Deferred;return this.localStore(function(e){t.id=t.id||parseInt(1e5*Math.random(),10),e.push(t)}),e.resolve({id:t.id}),e},update:function(t,e){var n,i=new can.Deferred;return this.localStore(function(i){for(var r=0;r<i.length;r++)if(i[r].id===t){n=i[r];break}can.extend(n,e)}),i.resolve({}),i}},{});
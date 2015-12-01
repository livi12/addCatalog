function educationPower(options){
	var self = this;
	this.element=$(options.element);		/*被添加菜单的元素*/
	this.addFirstMenuBtn=$(options.addFirstMenuBtn);	/*添加一级菜单的按钮*/
	this.item={link:"",str:"",no:""};
	this.itemtHead=null;/*this.itemtHead 为点击添加二级按钮的 thead*/
	this.linkInfo={}; /*this.linkInfo 为点击编辑按钮时的二级菜单的信息 str link no*/
	this.deleteSeconde=false; /*是否删除当前二级菜单*/
	this.templateCon=$(options.templateCon).html();
	this.ops=$.extend({
	 	addFirstCallback:function(){return false;}	/*复写添加一级菜单按钮的函数*/
		}, options);
	this.clickAddFirstMenu();
	this.clickAddSecondMenu();
	this.editSecondLevelMenu();
	this.deleteSecondMenu();

}
educationPower.prototype={
	/*点击添加一级菜单的按钮*/
	clickAddFirstMenu:function(){
		var self=this;
		this.addFirstMenuBtn.on('click', function(event) {
			event.preventDefault();
			var dialogContent= _.template(self.templateCon)({link: false,data:self.item});
			self.ops.addFirstCallback(dialogContent);
		});
	},
	/*添加一级菜单*/
	addFirstLevelMenu:function(item){
		/*item为回调函数返回的信息，若为false，则不添加，否则返回boject对象，包含一级菜单的信息，名称，排序的序号，不填的时候排在最后面
		名称：item.str
		序号：item.no
		*/
		if(!item){
			return false;
		}
		else{
			var table=$('<table data-no="'+item.no+'"><thead class="first-level-menu" ><tr><td class="label">'+item.str+'</td><td class="operate"><button class="add-menu">+添加二级菜单</button></td></tr></thead></table>');
			this.element.append(table);
		}
	},
	/*添加二级菜单*/
	addSecondLevelMenu:function(item){
		/*item为传进来的二级菜单的信息，名称，url,排序的序号，不填的时候排在最后面
		名称：item.str
		序号：item.no
		链接：item.link
		obj为要添加在某个一级菜单后面
		*/
		var tbody=this.itemtHead.next()
		if(!tbody.length){
			tbody=$('<tbody class="second-level-menu"><tr data-no="'+item.no+'"><td class="label"><a href="'+item.link+'" class="secondLevelLink">'+item.str+'</a></td><td class="operate"><a href="javascript:void(0)" class="link editLink">编辑</a><a href="javascript:void(0)" class="link deleteLink">删除</a></td></tr></tbody>');
		}
		else{
			tbody.append($('<tr data-no="'+item.no+'"><td class="label"><a href="'+item.link+'" class="secondLevelLink">'+item.str+'</a></td><td class="operate"><a href="javascript:void(0)" class="link editLink">编辑</a><a href="javascript:void(0)" class="link deleteLink">删除</a></td></tr>'));
		}
		this.itemtHead.after(tbody);
	},
	/*点击了某个添加二级菜单的thead,保存改thead*/
	clickAddSecondMenu:function(){
		var self=this;
		this.element.on('click', '.add-menu', function(event) {
			event.preventDefault();

			self.itemtHead=$(this).closest('.first-level-menu');
			var dialogContent=_.template(self.templateCon)({link: true,data : self.item} );
			self.ops.addFirstCallback(dialogContent);
		});
	},
	/*编辑二级菜单*/
	editSecondLevelMenu:function(){
		var self=this;
		this.element.on('click', '.second-level-menu .editLink', function(event) {
			event.preventDefault();
			var secondMenu=$(this).closest('.operate').prev('.label').children('.secondLevelLink');
			self.linkInfo.link=secondMenu.attr('href');
			self.linkInfo.str=secondMenu.text();
			self.linkInfo.no=secondMenu.closest('tr').attr('data-no');
			var dialogContent=_.template(self.templateCon)({link: true,data:self.linkInfo});
			self.ops.addFirstCallback(dialogContent);

		});
	},
	/*删除二级菜单*/
	deleteSecondMenu:function(){
		var self=this;
		this.element.on('click', '.second-level-menu .deleteLink', function(event) {
			event.preventDefault();
			var secondMenu=$(this).closest('tr').remove();
		});
	},
	/*获取当前操作的一级菜单*/
	getFirstMenu:function(){
		return this.itemtHead;
	}

}

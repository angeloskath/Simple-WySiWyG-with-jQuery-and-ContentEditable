//      wysiwyg.js
//      
//      Copyright 2011 Katharopoulos Angelos <katharas@gmail.com>
//      
//      This program is free software; you can redistribute it and/or modify
//      it under the terms of the GNU General Public License as published by
//      the Free Software Foundation; either version 2 of the License, or
//      (at your option) any later version.
//      
//      This program is distributed in the hope that it will be useful,
//      but WITHOUT ANY WARRANTY; without even the implied warranty of
//      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//      GNU General Public License for more details.
//      
//      You should have received a copy of the GNU General Public License
//      along with this program; if not, write to the Free Software
//      Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
//      MA 02110-1301, USA.

function WySiWyG(txt, htmlcontent)
{
	
	var _self = this;
	
	this.lastcontentchange = new Date().getTime();
	this.oldcontent = null;
	this.onchangeh = null;
	
	this.textarea = jQuery(txt);
	this.initialcontent = jQuery(htmlcontent);
	this.div = null;
	
	this.grippie = null;
	
	this.grippieoff = {};
	this.startH = null;
	
	this.IESelection = false;
	
	this.toolbar_img = {
			bold: ['imgs/bold.gif','imgs/bold_reverse.gif'],
			italic: ['imgs/italic.gif','imgs/italic_reverse.gif'],
			underline: ['imgs/underline.gif','imgs/underline_reverse.gif'],
			jLeft: ['imgs/justifyleft.gif','imgs/justifyleft_reverse.gif'],
			jCenter: ['imgs/justifycenter.gif','imgs/justifycenter_reverse.gif'],
			jRight: ['imgs/justifyright.gif','imgs/justifyright_reverse.gif'],
			insertUL: ['imgs/insertunorderedlist.gif','imgs/insertunorderedlist_reverse.gif'],
			insertOL: ['imgs/insertorderedlist.gif','imgs/insertorderedlist_reverse.gif'],
		};
	
	this.toolbar = {
			bold: null,
			italic: null,
			underline: null,
			jLeft: null,
			jCenter: null,
			jRight: null,
			insertUL: null,
			insertOL: null
		};
	
	this.onclick = function (event) {
		_self.checkToolbarItemsStatus();
	}
	this.onkeyup = function (event) {
		switch (event.which)
		{
			case 9:
				//_self.indent();
				break;
		}
		_self.checkToolbarItemsStatus();
		_self.checkForOnChange(event);
		event.preventDefault();
	}
	
	this.checkForOnChange = function (event) {
		var html = _self.getHTML();
		if (html != _self.oldcontent)
		{
			_self.lastcontentchange = new Date().getTime();
			_self.oldcontent = html;
			setTimeout(function () {
					if (new Date().getTime() - _self.lastcontentchange < 900) return;
					_self.change();
				}, 1000);
		}
	}
	
	this.change = function (f) {
		if (typeof(f)=='undefined')
		{
			if (typeof(this.onchangeh)=='object')
			{
				for (i=0;i<this.onchangeh.length;i++)
				{
					if (typeof(this.onchangeh[i])=='function')
					{
						try {
							this.onchangeh[i](this);
						} catch (e) {}
					}
				}
			}
		}
		else if (typeof(f)=='function')
		{
			if (typeof(this.onchangeh)=='undefined')
			{
				this.onchangeh = new Array();
			}
			try {
				this.onchangeh[this.onchangeh.length] = f;
			} catch (e) {
				this.onchangeh = new Array();
				this.onchangeh[this.onchangeh.length] = f;
			}
		}
	}
	
	this.checkToolbarItemsStatus = function () {
		var state;
		if (this.toolbar.bold!=null)
		{
			try {
				state = document.queryCommandState("bold");
				if (state)
				{
					jQuery(this.toolbar.bold).attr('src',this.toolbar_img.bold[1]);
				}
				else
				{
					jQuery(this.toolbar.bold).attr('src',this.toolbar_img.bold[0]);
				}
			} catch (e) {
				jQuery(this.toolbar.bold).attr('src',this.toolbar_img.bold[0]);
			}
		}
		if (this.toolbar.italic!=null)
		{
			try {
				state = document.queryCommandState("italic");
				if (state)
				{
					jQuery(this.toolbar.italic).attr('src',this.toolbar_img.italic[1]);
				}
				else
				{
					jQuery(this.toolbar.italic).attr('src',this.toolbar_img.italic[0]);
				}
			} catch (e) {
				jQuery(this.toolbar.italic).attr('src',this.toolbar_img.italic[0]);
			}
		}
		if (this.toolbar.underline!=null)
		{
			try {
				state = document.queryCommandState("underline");
				if (state)
				{
					jQuery(this.toolbar.underline).attr('src',this.toolbar_img.underline[1]);
				}
				else
				{
					jQuery(this.toolbar.underline).attr('src',this.toolbar_img.underline[0]);
				}
			} catch (e) {
				jQuery(this.toolbar.underline).attr('src',this.toolbar_img.underline[0]);
			}
		}
		if (this.toolbar.jLeft!=null)
		{
			try {
				state = document.queryCommandState("justifyLeft");
				if (state)
				{
					jQuery(this.toolbar.jLeft).attr('src',this.toolbar_img.jLeft[1]);
				}
				else
				{
					jQuery(this.toolbar.jLeft).attr('src',this.toolbar_img.jLeft[0]);
				}
			} catch (e) {
				jQuery(this.toolbar.jLeft).attr('src',this.toolbar_img.jLeft[0]);
			}
		}
		if (this.toolbar.jCenter!=null)
		{
			try {
				state = document.queryCommandState("justifyCenter");
				if (state)
				{
					jQuery(this.toolbar.jCenter).attr('src',this.toolbar_img.jCenter[1]);
				}
				else
				{
					jQuery(this.toolbar.jCenter).attr('src',this.toolbar_img.jCenter[0]);
				}
			} catch (e) {
				jQuery(this.toolbar.jCenter).attr('src',this.toolbar_img.jCenter[0]);
			}
		}
		if (this.toolbar.jRight!=null)
		{
			try {
				state = document.queryCommandState("justifyRight");
				if (state)
				{
					jQuery(this.toolbar.jRight).attr('src',this.toolbar_img.jRight[1]);
				}
				else
				{
					jQuery(this.toolbar.jRight).attr('src',this.toolbar_img.jRight[0]);
				}
			} catch (e) {
				jQuery(this.toolbar.jRight).attr('src',this.toolbar_img.jRight[0]);
			}
		}
		if (this.toolbar.insertUL!=null)
		{
			try {
				state = document.queryCommandState("insertUnorderedList");
				if (state)
				{
					jQuery(this.toolbar.insertUL).attr('src',this.toolbar_img.insertUL[1]);
				}
				else
				{
					jQuery(this.toolbar.insertUL).attr('src',this.toolbar_img.insertUL[0]);
				}
			} catch (e) {
				jQuery(this.toolbar.insertUL).attr('src',this.toolbar_img.insertUL[0]);
			}
		}
		if (this.toolbar.insertOL!=null)
		{
			try {
				state = document.queryCommandState("insertOrderedList");
				if (state)
				{
					jQuery(this.toolbar.insertOL).attr('src',this.toolbar_img.insertOL[1]);
				}
				else
				{
					jQuery(this.toolbar.insertOL).attr('src',this.toolbar_img.insertOL[0]);
				}
			} catch (e) {
				jQuery(this.toolbar.insertOL).attr('src',this.toolbar_img.insertOL[0]);
			}
		}
	}
	this.setToolbar = function(tool) {
		var ch = jQuery(tool).children('img');
		for (i=0;i<ch.length;i++)
		{
			var el = jQuery(ch[i]);
			switch (el.attr('rel'))
			{
				case 'Bold':
					this.toolbar.bold = el[0];
					this.toolbar.bold.src = '';
					el.click(this.toggleBold);
					break;
				case 'Italic':
					this.toolbar.italic = el[0];
					el.click(this.toggleItalic);
					break;
				case 'Underline':
					this.toolbar.underline = el[0];
					el.click(this.toggleUnderline);
					break;
				case 'justifyLeft':
					this.toolbar.jLeft = el[0];
					el.click(this.justifyLeft);
					break;
				case 'justifyCenter':
					this.toolbar.jCenter = el[0];
					el.click(this.justifyCenter);
					break;
				case 'justifyRight':
					this.toolbar.jRight = el[0];
					el.click(this.justifyRight);
					break;
				case 'insertUL':
					this.toolbar.insertUL = el[0];
					el.click(this.insertUL);
					break;
				case 'insertOL':
					this.toolbar.insertOL = el[0];
					el.click(this.insertOL);
					break;
				
			}
		}
		this.checkToolbarItemsStatus();
	}
	this.setFont = function(font) {
		jQuery(this.div).css('font-family',font);
	}
	
	this.addLink = function() {
		var userSelection = this.getUserSelection();
		alert(userSelection);
		document.execCommand("createLink");
	}
	
	this.toggleBold = function() {
		document.execCommand("bold",false,null);
		_self.checkToolbarItemsStatus();
	}
	this.toggleItalic = function() {
		document.execCommand("italic",false,null);
		_self.checkToolbarItemsStatus();
	}
	this.toggleUnderline = function() {
		document.execCommand("underline",false,null);
		_self.checkToolbarItemsStatus();
	}
	this.addBlock = function (block) {
		document.execCommand("formatBlock",false,block);
		_self.div.focus();
	}
	this.insertParagraph = function () {
		document.execCommand("insertParagraph",false,null);
		_self.div.focus();
	}
	this.insertUL = function () {
		document.execCommand("insertUnorderedList",false,null);
		_self.checkToolbarItemsStatus();
	}
	this.insertOL = function () {
		document.execCommand("insertOrderedList",false,null);
		_self.checkToolbarItemsStatus();
	}
	this.justifyRight = function () {
		document.execCommand("justifyRight",false,null);
		_self.checkToolbarItemsStatus();
	}
	this.justifyCenter = function () {
		document.execCommand("justifyCenter",false,null);
		_self.checkToolbarItemsStatus();
	}
	this.justifyLeft = function () {
		document.execCommand("justifyLeft",false,null);
		_self.checkToolbarItemsStatus();
	}
	this.indent = function () {
		document.execCommand("indent",false,null);
		_self.div.focus();
	}
	this.outdent = function () {
		this.div.execCommand("outdent",false,null);
		_self.div.focus();
	}
	
	this.getHTML = function () {
		return jQuery(this.div).html();
	}
	this.focus = function () {
		this.div.focus();
	}
	
	this.getUserSelection = function () {
		if (window.getSelection)
		{
			this.IESelection = false;
			return window.getSelection();
		}
		else
		{
			this.IESelection = true;
			return document.selection.createRange();
		}
	}
	
	this.grippieMouseMove = function (e) {
		var y = e.pageY-_self.grippieoff.top;
		_self.div.height(_self.startH+y);
		jQuery('#grippie_overlay').height(_self.startH+y);
		e.preventDefault();
	}
	this.grippieMouseDown = function (e) {
		_self.startH = _self.div.height();
		var ifoff = _self.div.offset();
		jQuery('body').append(jQuery('<div id="grippie_overlay"></div>').css({
							position: 'absolute',
							top: ifoff.top,
							left: ifoff.left,
							width: _self.div.width(),
							height: _self.div.height(),
							background: '#b1ca35',
							opacity: '0.5',
							padding: '5px'
							}));
		_self.grippieoff = _self.grippie.offset();
		jQuery(document).mousemove(_self.grippieMouseMove);
		jQuery(document).mouseup(_self.grippieMouseUp);
		
		e.preventDefault();
	}
	this.grippieMouseUp = function () {
		jQuery(document).unbind('mousemove');
		jQuery('#grippie_overlay').remove();
	}
	
	this.initEditor = function () {
		this.div = jQuery('<div contenteditable="true" class="editor"></div>').css({
				width: (this.textarea.width()-10)+'px',
				height: this.textarea.height(),
				overflow: 'auto',
				marginTop: '0px',
				padding: '5px'
			});
		this.textarea.css('display','none');
		this.div.attr('id','editor_'+this.textarea.attr('id'));
		this.div.insertAfter(this.textarea);

		if (this.initialcontent!=null && this.initialcontent.html()!=null) this.div.html(this.initialcontent.html());
		else this.div.html('<p>&nbsp;</p>');
		
		this.div.click(this.onclick);
		this.div.keyup(this.onkeyup);
		
		this.grippie = jQuery('<div></div>').css({
				margin: '0px',
				padding: '0px',
				width: this.textarea.width(),
				height: '9px',
				background: '#EEE url(imgs/grippie.png) no-repeat center 2px',
				border: '1px solid #b1ca35',
				cursor: 's-resize'
			});
		this.grippie.insertAfter(this.div);
		this.grippie.mousedown(this.grippieMouseDown);
		
		this.div.bind('paste',this.checkForOnChange);
	}
	this.initEditor();
}

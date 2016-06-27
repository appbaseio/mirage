(function() {
	if (typeof Object.defineProperty === 'function') {
		try { Object.defineProperty(Array.prototype, 'sortBy', { value: sb }); } catch (e) {}
	}
	if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

	function sb(f) {
		for (var i = this.length; i;) {
			var o = this[--i];
			this[i] = [].concat(f.call(o, o, i), o);
		}
		this.sort(function(a, b) {
			for (var i = 0, len = a.length; i < len; ++i) {
				if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
			}
			return 0;
		});
		for (var i = this.length; i;) {
			this[--i] = this[i][this[i].length - 1];
		}
		return this;
	}

	var originalLeave = $.fn.popover.Constructor.prototype.leave;
	$.fn.popover.Constructor.prototype.leave = function(obj){
	  var self = obj instanceof this.constructor ?
	    obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
	  var container, timeout;

	  originalLeave.call(this, obj);

	  if(obj.currentTarget) {
	    container = $(obj.currentTarget).siblings('.popover')
	    timeout = self.timeout;
	    container.one('mouseenter', function(){
	      //We entered the actual popover – call off the dogs
	      clearTimeout(timeout);
	      //Let's monitor popover content instead
	      container.one('mouseleave', function(){
	        $.fn.popover.Constructor.prototype.leave.call(self, self);
	      });
	    })
	  }
	};
})();

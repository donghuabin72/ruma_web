function HashMap() {
	
	this.keys = new Array();
	
	this.data = new Object();

	/**
	 * 加入一个键值对
	 * 
	 * @param key 键值
	 * @param value 属性值
	 */
	this.put = function(key, value) {
		if (this.data[key] == null) {
			this.keys.push(key);
			this.data[key] = value;
		} else {
			this.data[key] = this.data[key];
		}
		return true;
	};

	/**
	 * 获取键值对应的属性值
	 * 
	 * @param key 键值
	 * @returns 属性值
	 */
	this.get = function(key) {
		return this.data[key];
	};

	/**
	 * 删除一个键值对
	 * 
	 * @param key 键值
	 */
	this.remove = function(key) {
		for (var i = 0; i < this.keys.length; i++) {
			if (key === this.keys[i]) {
				var del_keys = this.keys.splice(i, 1);
				this.data[del_keys[0]] = null;
				return true;
			}
		}
		return false;
	};

	/**
	 * 清空哈希表
	 * 
	 */
	this.clear = function() {
		if (!this.isEmpty) {
			for (var i = 0; i < this.keys.length; i++) {
				for (k in keys) {
					this.remove(k);
				}
				return true;
			}
			return false;
		}
	};

	/**
	 * 遍历Map执行处理函数
	 * 
	 * @param fn 回调函数 function(key,value,index){..}
	 */
	this.each = function(fn) {
		if (typeof fn != 'function') {
			return;
		}
		var len = this.keys.length;
		for (var i = 0; i < len; i++) {
			var k = this.keys[i];
			fn(k, this.data[k], i);
		}
	};

	/**
	 * 获取键值数组
	 * 
	 * @return entity[{key,value},{key,value}]
	 */
	this.entrySet = function() {
		var len = this.keys.length;
		var entrys = new Array(len);
		for (var i = 0; i < len; i++) {
			entrys[i] = {
				key : this.keys[i],
				value : this.data[this.keys[i]]
			};
		}
		return entrys;
	};
	
	/**
	 * 判断Map是否为空
	 */
	this.isEmpty = function() {
		return this.keys.length == 0;
	};

	/**
	 * 获取键值对数量
	 */
	this.size = function() {
		return this.keys.length;
	};

	/**
	 * 判断指定键值是否在哈希表中存在
	 */
	this.containsKey = function(key) {
		return this.keys.filter(function(v) {
			if (v === key) {
				return key;
			}
		}).length > 0;
	};
	
	/**
	 * 重写toString
	 */
	this.toString = function() {
		var s = "{";
		for (var i = 0; i < this.keys.length; i++) {
			var k = this.keys[i];
			s += k + "=" + this.data[k];
			if (this.keys.length > i + 1) {
				s += ',';
			}
		}
		s += "}";
		return s;
	};
	
	/**
	 * 解析字符串到Map {a=A,b=B,c=B,}
	 */
	this.parserStringAndAddMap = function(str) {
		var count = 0;
		if (str && str.length > 0) {
			str = str.trim();
			var startIndex = str.indexOf("{"), endIndex = str.lastIndexOf("}");
			if (startIndex !== -1 && endIndex !== -1) {
				str = str.substring(startIndex + 1, endIndex);
				var arrs = str.split(",");
				for (var i = 0; i < arrs.length; i++) {
					var kv = arrs[i].trim();
					if (kv.length > 0 && kv.indexOf("=") !== -1) {
						var kv_arr = kv.split("=");
						if (kv_arr.length == 2) {
							if (this.put(kv_arr[0].trim(), kv_arr[1].trim())) {
								count++;
							} else {
								console.error('error: kv:' + kv);
							}

						}
					}
				}
			} else {
				console.log("data error:" + str);
			}
		} else {
			console.log('data is not empty');
		}
		return count;
	};
}
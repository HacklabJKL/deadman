var app = new Vue({
    el: '#app',
    data: {
	left: {
	},
	totp: '',
	info: '',
	countdown: null,
    },
    
    filters: {
	formatTimeout: function (ts) {
	    if (typeof ts !== 'number') return ''
	    if (ts < 0) return 'AIKA!'
	    var min = Math.floor(ts / 60).toString()
	    var sec = Math.floor(ts % 60).toString()
	    if (sec.length === 1) sec = '0' + sec;
	    return min + ':' + sec;	
	},
    },

    created: function () {
	this.relayLeft()

	window.setInterval(() => {
            this.countdown = this.left.timeout - Date.now()/1000
	},500)
    },

    methods: {
	relayLeft: function () {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('GET', 'left')
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
	    }
	    xhr.send()
	},

	relayOn: function () {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('GET', 'on')
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.info = ''
	    }
	    self.info = 'Turning power on...'
	    xhr.send()
	},

	relayOff: function () {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('GET', 'off')
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.info = ''
	    }
	    self.info = 'Turning power off..'
	    xhr.send()
	},

	relayPush: function (code) {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('GET', 'push?totp=' + encodeURIComponent(code))
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.info = ''
		self.$refs.totp.focus()
		if (!self.left.error) self.totp = ''
	    }
	    self.info = 'Pushing...'
	    xhr.send()
	},
    }
})


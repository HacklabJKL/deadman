var app = new Vue({
    el: '#app',
    data: {
	left: {},
	totp: '',
	info: '',
	countdown: null,
	powered: null,
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
	    this.powered = this.countdown >= 0
	},500)
    },

    methods: {
	relayLeft: function () {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('GET', 'api/v1/left')
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.hideInfoIfOk()
	    }
	    this.info = 'Loading initial state...'
	    xhr.send()
	},

	relayOn: function () {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('PUT', 'api/v1/on')
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.hideInfoIfOk()
	    }
	    self.info = 'Turning power on...'
	    xhr.send()
	},

	relayOff: function () {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('PUT', 'api/v1/off')
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.hideInfoIfOk()
	    }
	    self.info = 'Turning power off..'
	    xhr.send()
	},

	relayPush: function (code) {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('PUT', 'api/v1/push?totp=' + encodeURIComponent(code))
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.hideInfoIfOk()
		self.$refs.totp.focus()
		if (!self.left.error) self.totp = ''
	    }
	    self.info = 'Pushing...'
	    xhr.send()
	},

	hideInfoIfOk: function () {
	    if (!this.left.error) this.info = 'Status OK'
	},
    }
})


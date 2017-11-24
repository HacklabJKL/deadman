var app = new Vue({
    el: '#app',
    data: {
	left: {},
	totp: '',
	info: '',
	countdown: null,
	powered: null,
	alarm: new Audio('media/alarm.ogg'),
	timeout: new Audio('media/timeout.ogg'),
	push: new Audio('media/push.ogg'),
    },
    
    filters: {
	formatTimeout: function (ts) {
	    if (typeof ts !== 'number') return ''
	    if (ts < 0) return '--:--'
	    var min = Math.floor(ts / 60).toString()
	    var sec = Math.floor(ts % 60).toString()
	    if (min.length === 1) min = '0' + min;
	    if (sec.length === 1) sec = '0' + sec;
	    return min + ':' + sec;	
	},
    },

    created: function () {
	this.relayLeft()
	this.alarm.loop = true

	window.setInterval(() => {
            this.countdown = this.left.timeout - Date.now()/1000
	    this.powered = this.countdown >= 0

	    // Beep
	    if (this.countdown < 0) {
		if (!this.alarm.paused) {
		    this.alarm.pause()
		    this.timeout.play()
		}
	    } else if (this.countdown < 30 && this.alarm.paused) {
		this.alarm.play()
	    } else if (this.countdown >= 30 && !this.alarm.paused) {
		this.alarm.pause()
	    }
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
	    this.info = 'Ladataan alkutila...'
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
	    self.info = 'Kytketään sähköt päälle...'
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
	    this.info = 'Katkaistaan sähköt...'
	    if (window.confirm("Tämä katkaisee sähköt tulostimesta. Oletko varma?")) {
		xhr.send()
	    } else {
		this.left.error = "Peruutettu"
	    }
	},

	relayPush: function (code) {
	    var xhr = new XMLHttpRequest()
	    var self = this
	    xhr.open('PUT', 'api/v1/push?totp=' + encodeURIComponent(code))
	    xhr.onload = function () {
		self.left = JSON.parse(xhr.responseText)
		self.hideInfoIfOk()
		self.$refs.totp.focus()
		if (!self.left.error) {
		    self.totp = ''
		    self.push.play()
		}
	    }
	    self.info = 'Pushing...'
	    xhr.send()
	},

	hideInfoIfOk: function () {
	    if (!this.left.error) this.info = 'Status OK'
	},
    }
})

